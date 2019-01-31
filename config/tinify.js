const path=require('path')
const tinify=require('tinify')
const globby=require('globby')

tinify.key='vj8hSptk8lkSWfFXgVxR9Y36SGwq0mSN'

!(async ()=>{

  try {
    await tinify.validate()
  } catch (err) {
    console.log(err)
    return
  }

  try {
    const imgs=await globby('src/assets/images',{
      expandDirectories:{
        files:['*.jpg','*.png']
      }
    })
    if(imgs.length===0) return
    const stats={
      total:imgs.length,
      complete:0,
      success:0,
      failure:0,
    }
    
    stats.total=imgs.length
    console.log(`----- 压缩中, 请稍候 -----`)
    imgs.forEach(async imgPath=>{
      try {
        await tinify.fromFile(imgPath).toFile(imgPath)
        stats.success+=1
        stats.complete+=1
        console.log(`成功: ${imgPath}`)
      } catch (err) {
        stats.failure+=1
        stats.complete+=1
        console.log(err)
        console.log(`失败: ${imgPath}`)
      }
      if(stats.complete===stats.total){
        console.log(``)
        console.log(`----- 压缩图片资源完毕 -----`)
        console.log(`总共: ${stats.total}`)
        console.log(`成功: ${stats.success}`)
        console.log(`失败: ${stats.failure}`)
      }
    })
  } catch (err) {
    console.log(err)
  }
  
})()
