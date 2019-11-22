import request from '@/utils/request'

export function getWork(query){
  let url = 'v1/work'
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

export function getInfo(id){
  let url = 'v1/permission/'+ id;
  return request({
    url: url,
    method: 'get',
  })
}

export function createWork(data){
  let url = 'v1/work'
  return request({
    url : url,
    method : 'post',
    data
  })
}