const path=require('path')
const inquirer=require('inquirer')
const fs=require('fs')

const locals={
  filename:'',
  docTitle:''
}
const staticDir={
  js:'src/entry',
  vue:'src',
  scss:'src/assets/sass',
  html:'src/views'
}
const getVueTmpl=filename=>{
  return `
<template>
  <section>

  </section>
</template>

<script>
  import './assets/sass/${filename}.scss'
  export default {
    name:'${filename}',
  }
</script>
  `
}
const getJSTmpl=filename=>{
  return `
import Vue from 'vue'
import '../js/lib/common.js'
import App from '../${filename}.vue'

Vue.config.productionTip = false
new Vue({
  el: '#app',
  render:(h=>h(App))
})
  `
}
const getHTMLTmpl=docTitle=>{
  return `
<!DOCTYPE html>
<html lang="zh">
<head>
  <title>${docTitle}</title>
  <meta charset="UTF-8">
  <meta name="renderer" content="webkit">
  <meta name="force-rendering" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <meta content="email=no" name="format-detection" />
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1,viewport-fit=cover">
  <script>
    !(function(){
      var win=window
      var doc=document
      var UA=navigator.userAgent
      var isAndroid=/android|adr/gi.test(UA)
      var isIos=/iphone|ipod|ipad/gi.test(UA)&&!isAndroid
      var isMobile=isAndroid||isIos
      var config={
        isAndroid:isAndroid,
        isIos:isIos,
        isMobile:isMobile,
        isWeixin:/MicroMessenger/gi.test(UA),
        dpr:isIos?win.devicePixelRatio:1,
        rem:null,
      }
      var adapt=function(){
        var docEl=doc.documentElement
        var width=docEl.getBoundingClientRect().width>750?750:docEl.getBoundingClientRect().width
        config.rem=width/16
        docEl.style.fontSize=config.rem+'px'
      }
      var timer
      win.addEventListener('resize',function(){
        clearTimeout(timer)
        timer=setTimeout(adapt,300)
      })
      win.addEventListener('pageshow',function(e){
        if(e.persisted){
          clearTimeout(timer)
          timer=setTimeout(adapt,300)
        }
      })
      adapt()
      win.adapter=config
    })()
  </script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
  `
}
const createFile=(filePath,fileData)=>{
  fs.access(filePath,err=>{
    if(!err){
      console.log(`${filePath} 已存在`)
      return
    }
    fs.writeFile(filePath,fileData,err=>{
      if(err){
        console.log(err)
        console.log(`${filePath} 创建失败`)
        return
      }
      console.log(`${filePath} 创建成功`)
    })
  })
}
inquirer
  .prompt({
    type:'input',
    name:'filename',
    message:'页面名称:',
    async validate(input){
      const done=this.async()
      if(input.trim()===''){
        done('页面名不能为空')
        return
      }
      const filePath=path.resolve(process.cwd(),'./src',`${input}.vue`)
      try {
        fs.accessSync(filePath)
        done('页面已存在，请重新输入')
        return
      } catch (err) {
        locals.filename=input
        done(null,true)
      }
    }
  })
  .then(()=>{
    return inquirer.prompt({
      type:'input',
      name:'docTitle',
      message:'文档名称:',
      async validate(input){
        const done=this.async()
        locals.docTitle=input
        done(null,true)
      }
    })
  })
  .then(()=>{
    const {filename,docTitle}=locals
    const vueFile=path.resolve(staticDir.vue,`${filename}.vue`)
    createFile(vueFile,getVueTmpl(filename))
    const jsFile=path.resolve(staticDir.js,`${filename}.js`)
    createFile(jsFile,getJSTmpl(filename))
    const htmlFile=path.resolve(staticDir.html,`${filename}.html`)
    createFile(htmlFile,getHTMLTmpl(docTitle))
    const scssFile=path.resolve(staticDir.scss,`${filename}.scss`)
    createFile(scssFile,'')
  })
  .catch(err=>{
    console.log(err)
    process.exit()
  })
