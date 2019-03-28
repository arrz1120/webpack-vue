import fly from 'flyio'

fly.config.timeout=10000
fly.config.baseURL=__DEV__?'/mock':''
fly.config.headers={
  'Content-Type':'application/json'
}
fly.interceptors.response.use(res=>{
  if(res.status===200){
    return res.data
  }
  return res
},err=>{
  return Promise.reject(err)
})

export default fly
