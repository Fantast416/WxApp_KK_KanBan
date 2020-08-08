// miniprogram/pages/AuditPage/AuditPage.js
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
    ContestTag:[],
    NewContestTag:"",
    Status:"",
    NewFileId:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
      console.log(ContestInfo)
      this.setData({
        ContestName: ContestInfo.ContestName,
        RecordId:ContestInfo._id,
        ContestPlace: ContestInfo.ContestPlace,
        StartDate: ContestInfo.StartDate,
        EndDate: ContestInfo.EndDate,
        ContestType: ContestInfo.ContestType,
        HoldOrganization: ContestInfo.HoldOrganization,
        ContestDescription: ContestInfo.ContestDescription,
        Reason:ContestInfo.ApprovalReason,
        ContestTag:ContestInfo.ContestTag
      })
      this.MergeTag();
      console.log("that.data.FileId", that.data.FileId);
      console.log("AllMatch Info", that.data.AllMatchInfo);
    }
  },
  MergeTag(){
    var ContestTag =this.data.ContestTag
    
    var NewContestTag = "";
    ContestTag.forEach(function(item,index){
      NewContestTag = NewContestTag + item + ','
    }) 
    console.log("NewContestTag",NewContestTag);
    this.setData({
      NewContestTag:NewContestTag
    })
 },
  onLoad: function (options) {
    this.setData({
      Status:options.Status,
      ContestId:options.ContestId
    })
    if(this.data.Status==1){  //被拒绝了，需要整改
      CF.SearchContestInfo(this.data.ContestId);
      this.IsReady()
    }
    console.log("this.data.Status");

  },
  SplitTag(){
    var Tag = this.data.NewContestTag;
    var Len = Tag.length;
    console.log(Tag,Len)
    var flag = 0;  //判定用户用的是中文， 还是英文,
    for(var i=0;i<Len;i++){  //flag==1 用户用的英文逗号
      if(Tag[i]==','){
        flag=1;
        break;
      }
    }
    var NewTag = []
    if(flag==1){
      NewTag = Tag.split(",")
    }else{
      NewTag = Tag.split("，")
    }
    console.log(NewTag,Len,flag)
    this.setData({
      NewContestTag:NewTag
    })
  },
  UpdateContestInfo(e) {
    var that = this
    wx.showLoading({
      title: '更新信息中',
    })
    this.SplitTag();
    console.log("this.data.NewFileId", this.data.NewFileId)
    console.log(that.data.ContestRecordId, that.data.ContestId)
    CF.UpdateContestInfo(that.data.RecordId, that.data.ContestName, that.data.ContestPlace, that.data.StartDate, that.data.EndDate, that.data.ContestDescription, that.data.HoldOrganization,that.data.NewContestTag)
    wx.switchTab({
      url: '../User/User',
    })
    //CF.DeleteImage(this.data.FileId);
    //this.uplodeimage()
  },
  uploadImage(e) {
    var that = this;
    var UploadFileId = [];
    if (this.data.NewFileId.length != 0) {
      CF.UploadImageFiles(this.data.NewFileId, this.data.RecordId);
    } else {
      CF.UpdateContestPic(that.data.RecordId, [])
    }
    wx.switchTab({
      url: '../User/User',
    })
  },  BindStartDateChange: function (e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  BindEndDateChange: function (e) {
    this.setData({
      EndDate: e.detail.value
    })
  },
  BindContestTagChange: function (e) {
    this.setData({
      NewContestTag: e.detail.value
    })
  },
  BindContestNameChange: function (e) {
    this.setData({
      ContestName: e.detail.value
    })
  },
  BindContestPlaceChange: function (e) {
    this.setData({
      ContestPlace: e.detail.value
    })
  },
  BindOrganizationChange: function (e) {
    this.setData({
      HoldOrganization: e.detail.value
    })
  },
  BindContestDescriptionChange: function (e) {
    this.setData({
      ContestDescription: e.detail.value
    })
  },
  CheckContestName() {
    if (this.data.ContestName == "") {
      wx.showToast({
        title: "你还未填写赛事名称",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  CheckContestPlace() {
    if (this.data.ContestPlace == "") {
      wx.showToast({
        title: "你还未填写赛事地点",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  CheckHoldOrganization() {
    if (this.data.HoldOrganization == "") {
      wx.showToast({
        title: "你还未填写主办单位",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  RemoveImage(e) {
    var index = e.target.dataset.index;
    var NewFileId = this.data.NewFileId
    NewFileId.splice(index, 1);
    this.setData({
      NewFileId: NewFileId
    })
    console.log("FileId", this.data.NewFileId)
  },
  chooseImage: function () {
    var that = this;
    console.log("choose image")
    // 选择图片
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("res", res)
        var images = [];
        res.tempFilePaths.forEach(function (item, index) {
          console.log("item", item);
          images.push(item);
        })
        console.log("image", images)
        that.setData({
          NewFileId: images
        })
        console.log("FileId", that.data.FileId)
        console.log("choose image end")
      },
      fail: e => {
        console.error(e)
      }
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
  GotoContestRule(){
    wx.navigateTo({
      url: '../Y_ContestRule/ContestRule',
    })
  }
})