import request from '@/utils/request'

export function getPositions(query) {
  let url = 'v1/position'
  let params = []
  Object.keys(query).map( key =>{
    params.push( key + '=' + query[key])
  })
  url += "?"+params.join("&")
  return request({
    url: url,
    method: 'get',
  })
}

export function getInfo(id){
  let url = 'v1/position/'+id
  return request({
    url: url,
    method: 'get',
  })
}


export function createPosition(data) {
  return request({
    url: 'v1/position/create',
    method: 'post',
    data
  })
}

export function updatePosition(data) {
  return request({
    url: 'v1/position/update',
    method: 'post',
    data
  })
}

export function deletePosition(data) {
  return request({
    url: 'v1/position/delete',
    method: 'post',
    data
  })
}
