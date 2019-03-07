import requestClient from '../libs/network'
import { QUERY_FREE_TASKS_URL, QUERY_MY_TASKS_LIST } from '../constants/apis'

export const fetchFreeTasks = async parmas => {
  // const ret = await requestClient.post(QUERY_FREE_TASKS_URL, parmas)
  // if (ret) {
  //   return ret.result || []
  // }
  return [{
    id: 1,
    restaurantName: 'dwdwdwd', 
    publishDate: '2121291', 
    address: 'dwodnwdnw', 
    city: 'shanghai', 
    reward: '24'
  },{
    id: 2,
    restaurantName: 'niiinin', 
    publishDate: '7878728', 
    address: 'njknjknkq', 
    city: 'beijin', 
    reward: '99'
  }]
}

export const fetchChallengedTasks = async parmas => {
  const ret = await requestClient.post(QUERY_MY_TASKS_LIST)
  if (ret) {
    return ret.result || []
  }
  return []
}
