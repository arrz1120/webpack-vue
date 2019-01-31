const path=require('path')
const inquirer=require('inquirer')
const fs=require('fs')
const vfs=require('vinyl-fs')
const projectConf=require('../project.config.js')

const getPath=(...target)=>{
  return path.resolve(process.cwd(),...target)
}
const buildDir=getPath(projectConf.buildDir)
const isBuildDirExisted=fs.existsSync(buildDir)
if(!isBuildDirExisted){
  console.log(`warning: ${buildDir} 目录不存在`)
  process.exit()
}
const originStaticDir=projectConf.originStaticDir
if(!originStaticDir){
  console.log(`release 失败: originStaticDir 目录不存在`)
  return
}
const originTempDir=projectConf.originTempDir
if(!originTempDir){
  console.log(`release 失败: originTempDir 目录不存在`)
  return
}

console.log('')
console.log('----- 静态资源 ( js + images + css ) -----')
console.log(`${buildDir} >>> ${originStaticDir}`)
console.log('')
console.log('----- HTML -----')
console.log(`${buildDir} >>> ${originTempDir}`)
console.log('')

inquirer
  .prompt({
    type:'rawlist',
    name:'copyType',
    message:'选择复制内容:',
    choices:[
      {
        name:'静态资源 + HTML ( HTML && js + images + css )',
        value:'all',
        checked:true,
      },
      {
        name:'静态资源 ( js + images + css )',
        value:'static'
      }
    ],
    validate(input){
      const done=this.async()
      if(input.length===0){
        done('请选择要复制的选项')
        return
      }
      done(null,true)
    }
  })
  .then(({copyType})=>{
    const globBuildTemp=path.resolve(projectConf.buildDir,'./*.html')
    const globBuildStatic=[
      path.resolve(projectConf.buildDir,'./**/*'),
      `!${globBuildTemp}`
    ]
    console.log('')
    console.log('----- 复制中 -----')
    vfs
      .src(globBuildStatic)
      .pipe(vfs.dest(originStaticDir))
    if(copyType==='all'){
    vfs
      .src(globBuildTemp)
      .pipe(vfs.dest(originTempDir))
    }
    console.log('----- 复制完毕 -----')
  })
  .catch(err=>{
    console.log(`release 失败: ${err}`)
  })




