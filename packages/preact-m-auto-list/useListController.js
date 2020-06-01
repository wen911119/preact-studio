import { useEffect, useReducer, useCallback } from 'preact/compat'

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_QUERY_PARAMS':
      return {
        ...state,
        queryParams: Object.assign({ pageNum: 1 }, action.payload.params, {
          pageSize: action.payload.pageSize
        }),
        firstPageOk: false
      }
    case 'FETCH_START':
      return {
        ...state,
        isLoading: !state.firstPageOk
      }
    case 'FETCH_ERROR': {
      return {
        ...state,
        isLoading: false,
        isError: !state.firstPageOk
      }
    }
    case 'FETCH_SUCCESS': {
      let newData = action.payload.list
      if (state.firstPageOk) {
        newData = Array.from(state.data).concat(newData)
      }
      if (state.loadmoreCallback) {
        state.loadmoreCallback({ success: true, nomore: action.payload.nomore })
      }
      if (state.refreshCallback) {
        state.refreshCallback()
      }
      return {
        ...state,
        isLoading: false,
        isError: false,
        firstPageOk: true,
        data: newData,
        loadmoreCallback: undefined,
        refreshCallback: undefined
      }
    }

    case 'LOAD_MORE': {
      return {
        ...state,
        queryParams: {
          ...state.queryParams,
          pageNum: state.queryParams.pageNum + 1
        },
        loadmoreCallback: action.payload.loadmoreCallback
      }
    }
    default:
      throw new Error()
  }
}

const useListController = ({ fetchListData, format, params, pageSize }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    firstPageOk: false,
    queryParams: null,
    loadmoreCallback: undefined,
    refreshCallback: undefined,
    data: []
  })
  useEffect(() => {
    dispatch({ type: 'INIT_QUERY_PARAMS', payload: { params, pageSize } })
  }, [params, pageSize, dispatch])

  const fetcher = useCallback(
    async p => {
      const {
        list,
        pageInfo: { totalPage, currentPage }
      } = format(await fetchListData(p))
      return { list, nomore: currentPage >= totalPage }
    },
    [format, fetchListData]
  )

  const queryParams = state.queryParams
  useEffect(() => {
    if (queryParams) {
      dispatch({ type: 'FETCH_START' })
      fetcher(queryParams)
        .then(d => dispatch({ type: 'FETCH_SUCCESS', payload: d }))
        .catch(err => {
          console.log(err)
          dispatch({ type: 'FETCH_ERROR' })
        })
    }
  }, [queryParams, fetcher])

  // const loadmore = useCallback(
  //   done => {
  //     dispatch({
  //       type: 'LOAD_MORE',
  //       payload: {
  //         loadmoreCallback: done
  //       }
  //     })
  //   },
  //   [dispatch]
  // )

  const currentPageNum = state.pageNum

  const fetchFirstPage = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_FIRST_PAGE_START' })
      const { list } = format(
        await fetchListData(Object.assign({}, params, { pageNum: 1, pageSize }))
      )
      dispatch({ type: 'LOAD_FIRST_PAGE_SUCCESS', payload: list })
    } catch (error) {
      dispatch({ type: 'LOAD_FIRST_PAGE_ERROR' })
    }
  }, [format, fetchListData, dispatch, pageSize, params])

  const fetchNextPage = useCallback(
    async done => {
      try {
        const {
          list,
          pageInfo: { totalPage, currentPage }
        } = format(
          await fetchListData(
            Object.assign({}, params, { pageNum: currentPageNum + 1, pageSize })
          )
        )
        dispatch({ type: 'LOAD_NEXT_PAGE_SUCCESS', payload: list })
        done({ success: true, nomore: currentPage >= totalPage })
      } catch (error) {
        done({ success: false })
      }
    },
    [pageSize, fetchListData, currentPageNum, dispatch, format]
  )

  const onRefresh = done => {
    // 故意加点延时，因为接口速度太快会导致动画时间太短
    setTimeout(async () => {
      try {
        const { list } = format(
          await fetchListData(
            Object.assign({}, params, { pageNum: 1, pageSize })
          )
        )
        dispatch({ type: 'REFRESH_SUCCESS', payload: list })
        done()
      } catch (error) {
        console.log(error)
        done(error)
      }
    }, 300)
  }
  const retry = fetchFirstPage

  useEffect(() => {
    fetchFirstPage(params, pageSize)
  }, [params, pageSize])
  return [state, fetchNextPage, retry, onRefresh]
}

export default useListController
