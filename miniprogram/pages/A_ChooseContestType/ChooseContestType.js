// miniprogram/pages/ChooseContestType/ChooseContestType.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent("#MainBar").setData({
      selected: 1
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ChooseSports(e){
    if(app.globalData.userInfo==""){
      wx.showToast({
        icon:"none",
        title: '请先前往我的页面登录',
      })
      return;
    }
    var Type = e.currentTarget.dataset.id;
    if(Type=='Other'){
      wx.showToast({
        title: '暂未开通',
      })
      return
    }
    wx.navigateTo({
      url: '../CreateContest/CreateContest?ContestType='+Type
    })
  }
 
})