import { useEffect, useReducer } from 'preact/compat'

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FIRST_PAGE_START':
      return { ...state, isLoading: true, isError: false }
    case 'LOAD_FIRST_PAGE_ERROR':
      return { ...state, isLoading: false, isError: true }
    case 'LOAD_FIRST_PAGE_SUCCESS':
      return {
        loading: false,
        isError: false,
        pageNum: 1,
        data: action.payload
      }
    case 'LOAD_NEXT_PAGE_SUCCESS':
      return {
        loading: false,
        isError: false,
        pageNum: state.pageNum + 1,
        data: state.data.concat(action.payload)
      }
    case 'REFRESH_SUCCESS':
      return {
        loading: false,
        isError: false,
        pageNum: 1,
        data: action.payload
      }
    default:
      throw new Error()
  }
}

const useListController = ({ fetchListData, format, params, pageSize }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    pageNum: 1,
    data: []
  })

  const fetchFirstPage = async () => {
    try {
      dispatch({ type: 'LOAD_FIRST_PAGE_START' })
      const { list } = format(
        await fetchListData(Object.assign({}, params, { pageNum: 1, pageSize }))
      )
      dispatch({ type: 'LOAD_FIRST_PAGE_SUCCESS', payload: list })
    } catch (error) {
      dispatch({ type: 'LOAD_FIRST_PAGE_ERROR' })
    }
  }
  const onLoadMore = async done => {
    try {
      const {
        list,
        pageInfo: { totalPage, currentPage }
      } = format(
        await fetchListData(
          Object.assign({}, params, { pageNum: state.pageNum + 1, pageSize })
        )
      )
      dispatch({ type: 'LOAD_NEXT_PAGE_SUCCESS', payload: list })
      done({ success: true, nomore: currentPage >= totalPage })
    } catch (error) {
      done({ success: false })
    }
  }
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
  const onRetry = fetchFirstPage

  useEffect(() => {
    fetchFirstPage()
  }, [JSON.stringify(params), pageSize])
  return [state, onLoadMore, onRetry, onRefresh]
}

export default useListController
