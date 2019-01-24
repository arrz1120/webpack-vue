const Koa=require('koa')
const bodyParser=require('koa-bodyparser')
const logger=require('koa-logger')
const lanIp=require('address').ip()
const Router=require('koa-router')
const sleep=require('sleep-promise')
const autoConfig=require('jsonfile').readFileSync('./project.config.json')
const mockApi=require('./mockApi.js')
const app=new Koa()
const router=new Router()

app.use(logger())
app.use(bodyParser())

/*
允许跨域请求 cors
app.use(async (ctx,next)=>{
  ctx.response.set({
    // 允许请求的域名
    'Access-Control-Allow-Origin':'*',
    // 允许请求发送 cookie, 注意同时客户端 ajax 需设置 withCredentials:true
    // 需要注意的是，如果要发送 cookie，Access-Control-Allow-Origin 就不能设为 '*'
    // 必须指定明确的、与请求网页一致的域名
    'Access-Control-Allow-Credentials':true,
    // 允许请求的方法
    'Access-Control-Allow-Methods':'POST,GET,PUT,OPTIONS'
  })
  next()
})
*/

mockApi.forEach((item,i)=>{
  router[item.method||'get'](item.url,async (ctx)=>{
    if(item.delay){
      await sleep(item.delay)
    }
    ctx.body=item.res
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

app.on('error',(err,ctx)=>{
  console.log('server error',err,ctx)
})
app.listen(autoConfig.serverPort,()=>{
  console.log(`${lanIp}:${autoConfig.serverPort} OK!`)
})