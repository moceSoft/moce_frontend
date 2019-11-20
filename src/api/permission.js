import request from '@/utils/request'

export function getPermission(query){
  let url = 'v1/permission'
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

export function getDefaultPermission(){
  return request({
    url: 'v1/permission',
    method: 'get',
  })
}