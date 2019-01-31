const createEl=node=>document.createElement(node)

window.tracker=(saName,mta)=>{
  if(saName!=null){
    try {
      const parent=createEl('div')
      const child=createEl('div')
      child.setAttribute('name',saName)
      parent.appendChild(child)
      sa.quick('trackHeatMap',child)
    } catch (err) {}
  }
  if(mta!=null){
    try {
      MtaH5.clickStat(mta)
    } catch (err) {}
  }
}

{
  let _mtac = {"performanceMonitor":1,"senseQuery":1}
  let mta = createEl("script")
  mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4"
  mta.setAttribute("name", "MTAH5")
  mta.setAttribute("sid", "500666562")
  mta.setAttribute("cid", "500666563")
  document.querySelector('body').appendChild(mta)
}

{
  let nodeScript = createEl('script')
  nodeScript.async = true
  nodeScript.src = '//bilog.niiwoo.com/js/webaccess.js'
  document.querySelector('body').appendChild(nodeScript)
}