module.exports={
  rem(px){
    const rem=adapter.rem
    const ratio=16/750
    return px*ratio*rem
  },
  toLogin(tel=''){
    if(Jsbridge.isApp()){
      Jsbridge.toAppLogin()
    }else{
      window.location.href=`//passport.tuandai.com/2login?ret=${encodeURIComponent(window.location.href)}&mobile=${tel}`
    }
  },
  toTBX(){
    if(Jsbridge.isApp()){
      Jsbridge.toAppTBX()
    }else{
      window.location.href='//m.tuandai.com/Member/UserPrize/Index.aspx'
    }
  },
  toTB(){
    window.location.href='//mvip.tuandai.com/member/mall/tuanbiDetail.aspx'
  },
  toP2P(){
    if(Jsbridge.isApp()){
      Jsbridge.exec('ToAppP2p')
    }else{
      window.location.href=`//sj.qq.com/myapp/detail.htm?apkName=com.junte`
    }
  },
}