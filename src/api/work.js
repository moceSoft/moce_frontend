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
  let url = 'v1/work/'+ id;
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

export function updateWork(id, data){
  data.begin_time = data.begin_time / 1000;
  data.end_time = data.end_time / 1000;
  // if(!data.need_check){
  //   data.check_user = 0
  // }
  let url = 'v1/work/'+id
  return request({
    url : url,
    method : 'put',
    data
  })
}