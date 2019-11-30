import request from '@/utils/request'


export function getWorkCalendarHeatmap(query) {
  let url = 'v1/user/info'
  let params = []
  Object.keys(query).map( key =>{
    params.push( key + '=' + query[key]);
  })
  url += "?"+params.join("&");
  return request({
    url: url,
    method: 'get',
  })
}