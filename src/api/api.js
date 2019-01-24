import axios from 'axios'

axios.defaults.baseURL=__DEV__?'/mock':''
axios.defaults.timeout=8000
axios.interceptors.response.use(function (res) {
  if(res.status===200){
    return res.data
  }
  return res
}, function (error) {
  return Promise.reject(error)
})

module.exports={
  getApiMock(){
    return axios.get('/')
  }
}

