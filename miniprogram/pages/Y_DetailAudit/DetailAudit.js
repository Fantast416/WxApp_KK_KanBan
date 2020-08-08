// miniprogram/pages/DetailAudit/DetailAudit.js
const app = getApp()
const CF = require('../../js/CloudFunction.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ContestId: [],
    RecordId:"",
    ContestName: "",
    ContestPlace: "",
    StartDate: "",
    EndDate: "",
    FileId: "",
    ContestType:"",
    HoldOrganization: "",
    ContestDescription: "",
    Reason:"",
    ContestTag:[]
  },
  IsReady() {
    var that = this;
    console.log(",app.globalData.IsContestInfoReady", app.globalData.IsContestInfoReady)
    if (app.globalData.IsContestInfoReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      app.globalData.IsContestInfoReady = 0;
      var ContestInfo = app.TempData.ContestInfo
      this.setData({
        ContestName: ContestInfo.ContestName,
        RecordId:ContestInfo._id,
        ContestPlace: ContestInfo.ContestPlace,
        StartDate: ContestInfo.StartDate,
        EndDate: ContestInfo.EndDate,
        FileId: ContestInfo.FileId,
        ContestType: ContestInfo.ContestType,
        HoldOrganization: ContestInfo.HoldOrganization,
        ContestDescription: ContestInfo.ContestDescription,
        ContestTag:ContestInfo.ContestTag
      })
      console.log("that.data.FileId", that.data.FileId);
      console.log("AllMatch Info", that.data.AllMatchInfo);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      ContestId: options.ContestId
    })
    CF.SearchContestInfo(this.data.ContestId);
    this.IsReady()
  },
  handleImagePreview(e) {
    const index = e.target.dataset.index
    const images = this.data.FileId
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  Pass(){
    var Reason = "通过"
    var RecordId = this.data.RecordId
    CF.UpdateContestApprovalStatus(RecordId,1,Reason)
  },
  BindInputReason(e){
    console.log("e.detail.value",e.detail.value)
    this.setData({
      Reason:e.detail.value
    })
  },
  Reject(){
    var Reason = this.data.Reason
    var RecordId = this.data.RecordId
    CF.UpdateContestApprovalStatus(RecordId,-1,Reason)
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

  }
})