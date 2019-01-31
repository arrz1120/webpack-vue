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
import '../assets/sass/reset.scss'
import Vue from 'vue'
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
  <script>
    window.mobileUtils = function (e, t) {
      var i = navigator.userAgent,
        n = /android|adr/gi.test(i),
        a = /iphone|ipod|ipad/gi.test(i) && !n;
      return {
        isAndroid: n,
        isIos: a,
        isMobile: n || a,
        isWeixin: /MicroMessenger/gi.test(i),
        dpr: a ? Math.min(e.devicePixelRatio, 3) : 1,
        rem: null,
        fixScreen: function () {
          var i = this,
            n = t.querySelector('meta[name="viewport"]'),
            r = n ? n.content : "";
          var o, s = t.documentElement,
            d = s.dataset.mw || 750,
            m = a ? Math.min(e.devicePixelRatio, 3) : 1;
          t.getElementsByTagName("body")[0], s.removeAttribute("data-mw"), s.dataset.dpr = m, n = t.createElement(
            "meta"), n.name = "viewport", n.content = function (e) {
            return "initial-scale=" + e + ",maximum-scale=" + e + ",minimum-scale=" + e +",viewport-fit=cover"
          }(1), s.firstElementChild.appendChild(n);
          var c = function () {
            var e = s.getBoundingClientRect().width;
            e = e > d ? d : e;
            var t = e / 16;
            i.rem = t, s.style.fontSize = t + "px"
          };
          e.addEventListener("resize", function () {
            clearTimeout(o), o = setTimeout(c, 300)
          }, !1), e.addEventListener("pageshow", function (e) {
            e.persisted && (clearTimeout(o), o = setTimeout(c, 300))
          }, !1), c()
        }
      }
    }(window, document), mobileUtils.fixScreen();
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
