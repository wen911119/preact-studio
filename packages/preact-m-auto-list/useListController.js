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

  const fetchFirstPage = () => {
    try {
      dispatch({ type: 'LOAD_FIRST_PAGE_START' })
      fetchListData(Object.assign({}, params, { pageNum: 1, pageSize })).then(
        ret => {
          const { list } = format(ret)
          dispatch({ type: 'LOAD_FIRST_PAGE_SUCCESS', payload: list })
        }
      )
    } catch (error) {
      dispatch({ type: 'LOAD_FIRST_PAGE_ERROR' })
    }
  }
  const onLoadMore = done => {
    try {
      fetchListData(
        Object.assign({}, params, { pageNum: state.pageNum + 1, pageSize })
      ).then(ret => {
        const {
          list,
          pageInfo: { totalPage, currentPage }
        } = format(ret)
        dispatch({ type: 'LOAD_NEXT_PAGE_SUCCESS', payload: list })
        done({ success: true, nomore: currentPage >= totalPage })
      })
    } catch (error) {
      done({ success: false })
    }
  }
  const onRefresh = done => {
    try {
      // 故意加点延时，因为接口速度太快会导致动画时间太短
      setTimeout(() => {
        fetchListData(Object.assign({}, params, { pageNum: 1, pageSize })).then(
          ret => {
            const { list } = format(ret)
            dispatch({ type: 'REFRESH_SUCCESS', payload: list })
            done()
          }
        )
      }, 300)
    } catch (error) {
      console.log(error)
    }
  }
  const onRetry = fetchFirstPage

  useEffect(() => {
    fetchFirstPage()
  }, [JSON.stringify(params), pageSize])
  return [state, onLoadMore, onRetry, onRefresh]
}

export default useListController

// const useListDataFetcher = (
//   fetchListData,
//   params,
//   format,
//   pageSize,
//   pageNum,
//   cb
// ) => {
//   const [listData, updateListData] = useState([])
//   const [isLoading, updateIsLoading] = useState(false)
//   const [isError, updateIsError] = useState(false)
//   useEffect(() => {
//     updateIsLoading(true)
//     const fetchData = async () => {
//       try {
//         const {
//           list,
//           pageInfo: { totalPage, currentPage }
//         } = format(
//           await fetchListData(Object.assign({}, params, { pageNum, pageSize }))
//         )
//       } catch (err) {
//         console.log(err)
//         updateIsError(true)
//       }
//     }
//   }, [params, pageSize, pageNum, cb])
//   return listData
// }

// export const usePagination = (defaultPageSize = 10) => {
//   const [pageSize, updatePageSize] = useState(defaultPageSize)
//   const [pageNum, updatePageNum] = useState(1)
//   const next = useCallback(() => {
//     updatePageNum(n => n + 1)
//   }, [])
//   const reset = useCallback(() => {
//     updatePageSize(defaultPageSize)
//     updatePageNum(1)
//   }, [defaultPageSize])
//   return {
//     pageSize,
//     pageNum,
//     next,
//     reset,
//     updatePageSize
//   }
// }
