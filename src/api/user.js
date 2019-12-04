import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v1/user/login',
    method: 'post',
    data
  })
}

export function getInfo(query) {
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

export function logout() {
  return request({
    url: 'v1/user/logout',
    method: 'post'
  })
}

export function fetchList(query){
  let url = 'v1/user'
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

export function createUser(data){
  return request({
    url: 'v1/user',
    method: 'post',
    data
  })
}

export function validate(data){
  let url = 'v1/user/validate'
  let params = []
  Object.keys(data).map( key =>{
    params.push( key + '=' + data[key])
  })
  url += "?"+params.join("&")
  return request({
    url: url,
    method: 'get',
  })

}