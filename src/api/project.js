import request from '@/utils/request'

export function getInfo(id, needUserInfo = false) {
  let url = 'v1/project/'+id
  if(needUserInfo == true){
    url += '?user=true'
  }
  return request({
    url: url,
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
    url: 'v1/project',
    method: 'post',
    data
  })
}

export function updateProject(data){
  return request({
    url: 'v1/project/'+data.id,
    method: 'put',
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


export function getWorkStatistics(id){
  let url = 'v1/project/statistics?id='+id
  return request({
    url: url,
    method: 'get',
  })
}

export function deleteProjectUser(data){
  return request({
    url: 'v1/project/deleteuser',
    method: 'post',
    data
  })
}


export function addProjectUser(data){
  return request({
    url: 'v1/project/adduser',
    method: 'post',
    data
  })
}

export function setProjectUserInCharge(data){
  return request({
    url: 'v1/project/updateuser',
    method: 'post',
    data
  })
}

export function fileProject(id){
  return request({
    url : 'v1/project/file?id='+id,
    method : 'get'
  })
}