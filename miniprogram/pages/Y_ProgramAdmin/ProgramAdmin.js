// miniprogram/pages/ProgramAdmin/ProgramAdmin.js
const app = getApp()
const CF = require('../../js/CloudFunction.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NeedAuditContest:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


},
  GotoAuditContest(e){
    console.log(e)
    wx.navigateTo({
      url: '../Y_DetailAudit/DetailAudit?ContestId='+e.currentTarget.dataset.id.ContestId,
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
    var that = this
    CF.SearchNeedAuditContest();
    setTimeout(function(){
      that.setData({
        NeedAuditContest:app.globalData.NeedAuditContest
      })
      console.log("this.data.NeedAuditContest",that.data.NeedAuditContest)
    },1000)
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

  }
})