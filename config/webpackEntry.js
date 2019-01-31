const path=require('path')
const globby=require('globby')

const glob={
  entry:path.resolve('./src/entry/*.js'),
  html:path.resolve('./src/views/*.html'),
}

const [entryPaths,htmlPaths]=[
  globby.sync(glob.entry),
  globby.sync(glob.html),
]
const webpackEntryName=[]
const webpackEntry={}
entryPaths.forEach(item=>{
  const filename=path.parse(item).name
  webpackEntryName.push(filename)
  webpackEntry[filename]=item
})
const webpackHTML=htmlPaths.map(item=>{
  const pathParse=path.parse(item)
  const filename=pathParse.name
  const basename=pathParse.base
  let isExisted
  {
    const idx=webpackEntryName.findIndex(item=>item===filename)
    isExisted=idx===-1?false:true
  }
  if(isExisted){
    return{
      tmpl:item,
      output:basename,
      scripts:[filename]
    }
  }
})
module.exports={
  webpackEntry,
  webpackHTML,
}







