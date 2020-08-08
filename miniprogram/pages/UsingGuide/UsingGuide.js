// miniprogram/pages/UsingGuide/UsingGuide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//-----------UI数据设置------------------
wx.createSelectorQuery().select(".headNavi").boundingClientRect(res => {
  console.log("naviheight", res);
  this.setData({
    naviHeight: res.height
  })
}).exec()
wx.createSelectorQuery().select(".swiperCard").boundingClientRect(res => {
  console.log("swiperheight", res);
  this.setData({
    swiperHeight: res.height
  })
}).exec()
this.setData({
  statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
})
wx.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#ff9700',
})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  returnHome() {
    wx.navigateBack(); 
    
  },
  Preview(e){
    const index = e.target.dataset.index
    const images = ["cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/1.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/2.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/2.1.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/2.2.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/2.3.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.0.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.1.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.2.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.2.1.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.2.3.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.2.2.gif",
    "cloud://wxice-saksi.7778-wxice-saksi-1302267479//UsingGuide/3.3.gif"
  ]
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  }
})