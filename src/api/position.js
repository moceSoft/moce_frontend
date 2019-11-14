import request from '@/utils/request'

export function getPositions(data) {
  return request({
    url: 'v1/position',
    method: 'get',
    data
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
