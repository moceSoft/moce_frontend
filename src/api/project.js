import request from '@/utils/request'


export function getInfo(token) {
  return request({
    url: 'v1/project/info',
    method: 'get',
  })
}

export function fetchList(query){
  let url = 'v1/project'
  let params = []
  Object.keys(query).map( key =>{
    params.push( key + '=' + query[key]);
  })
  url += "?"+params.join("&");
  return request({
    url: url,
    method: 'get'
  })
}

export function createProject(data){
  return request({
    url: 'v1/project/create',
    method: 'post',
    data
  })
}

export function updateProject(data){
  return request({
    url: 'v1/project/update',
    method: 'post',
    data
  })
}

export function deleteProject(data){
  return request({
    url: 'v1/project/delete',
    method: 'post',
    data
  })
}