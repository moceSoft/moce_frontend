import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v1/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'v1/user/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'v1/user/logout',
    method: 'post'
  })
}

export function fetchList(data){
  return request({
    url: 'v1/user',
    method: 'get',
    data
  })
}

export function createUser(data){
  return request({
    url: 'v1/user/create',
    method: 'post',
    data
  })
}