import request from '@/utils/request'

export function getOrgs() {
  return request({
    url: 'v1/org',
    method: 'get',
  })
}

export function getList() {
  return request({
    url: 'v1/org/list',
    method: 'get',
  })
}


export function getPositions() {
  return request({
    url: 'v1/org/positions',
    method: 'get',
  })
}

export function createOrg(data) {
  return request({
    url: 'v1/org/create',
    method: 'post',
    data
  })
}

export function updateOrg(data) {
  return request({
    url: 'v1/org/update',
    method: 'post',
    data
  })
}

export function deleteOrg(data) {
  return request({
    url: 'v1/org/delete',
    method: 'post',
    data
  })
}
