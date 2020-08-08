// miniprogram/pages/ContestLevel2/ContestLevel2.js
const CF = require('../../../js/CloudFunction.js')
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ContestId: "",
    FileId: [],
    cardCur: 0,
    ContestName: "",
    ContestType: "",
    ContestStartDate: "",
    ContestEndDate: "",
    ContestPlace: "",
    ContestDescription: "",
    MatchPlace: "",
    TeamAName: "",
    TeamBName: "",
    AllMatchInfo: [],
    MatchNotYetStart:[],
    MatchIsGoing: [],
    MatchIsEnded: [],
    ContestMember:[],  //所有已注册的参赛成员
    statusBarHeight: '',
    selection: 1,
    IsAdmin:0,
    ContestRecordId:"",
    loadModal:true

  },
  IsReady(){
    var that = this;
    console.log("app.globalData.IsContestMatchRead,app.globalData.IsContestInfoReady",app.globalData.IsContestMatchRead,app.globalData.IsContestInfoReady)
    if(app.globalData.IsContestMatchReady==0||app.globalData.IsContestInfoReady==0){
      setTimeout(function(){
        that.IsReady();
      },100)
    }else{
      app.globalData.IsContestMatchReady=0;
      app.globalData.IsContestInfoReady=0;
      var ContestInfo = app.TempData.ContestInfo
      var AdminContest = app.globalData.MyAdminContest;
      console.log("AdminContest",AdminContest)
      var AdminContestlen = AdminContest.length;
      var IsAdmin =0;
      for(var i=0;i<AdminContestlen;i++){
        if(this.data.ContestId == AdminContest[i].ContestId){
          IsAdmin = 1;
          break;
        }
      }
      console.log("IsAdmin",IsAdmin);
      this.setData({
        loadModal:false,
        IsAdmin:IsAdmin,
        AllMatchInfo: app.TempData.ContestMatch,
        RefereeCode: app.TempData.RefereeCode,
        AdministratorCode: app.TempData.AdministratorCode,
        RefereeNum: app.TempData.RefereeNum,
        AdministratorNum: app.TempData.AdministratorNum,
        ContestName: ContestInfo.ContestName,
        ContestPlace: ContestInfo.ContestPlace,
        StartDate: ContestInfo.StartDate,
        EndDate: ContestInfo.EndDate,
        FileId: ContestInfo.FileId,
        ContestType: ContestInfo.ContestType,
        HoldOrganization: ContestInfo.HoldOrganization,
        ContestDescription:ContestInfo.ContestDescription,
        ContestRecordId:ContestInfo._id
      })
      CF.MainAddScanNumber(this.data.ContestRecordId)
      that.SplitAllMatchInfo();
      console.log("that.data.FileId",that.data.FileId);
      console.log("AllMatch Info", that.data.AllMatchInfo);
      console.log("Match Not Yet Start", that.data.MatchNotYetStart);
      console.log("MatchIsGoing", that.data.MatchIsGoing);
      console.log("MatchIsEnded", that.data.MatchIsEnded);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that= this;
    this.setData({
      ContestId: options.ContestId
    })
    CF.SearchContestMatch(this.data.ContestId);
    CF.SearchContestInfo(this.data.ContestId);
    CF.SearchContestMember(this.data.ContestId);  //此处搜索过以后在三级页面用数据
    this.IsReady(); //判断数据是否加载好
    //--------------------UI数据-----------------------------------
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchContestMatch(this.data.ContestId);
    CF.SearchContestInfo(this.data.ContestId);
    CF.SearchContestMember(this.data.ContestId);  //此处搜索过以后在三级页面用数据
    this.IsReady(); //判断数据是否加载好
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //将比赛按照类型进行分配
  SplitAllMatchInfo(){
    var len = this.data.AllMatchInfo.length
    var i=0;
    var MatchNotYetStart=[]
      var MatchIsGoing=[]
    var MatchIsEnded=[]
    for(i=0;i<len;i++){
      var item = this.data.AllMatchInfo[i]
      var Status = item.Status;
      if(Status==-1){
        MatchNotYetStart.push(item);
      }else if(Status==0 || Status==2){
        MatchIsGoing.push(item)
      }else{
        MatchIsEnded.push(item)
      }
    }
    this.setData({
      MatchNotYetStart: MatchNotYetStart,
      MatchIsGoing: MatchIsGoing,
      MatchIsEnded: MatchIsEnded
    })
  },
  GotoContestLevel3(e){
    console.log(e)
    wx.navigateTo({
      url: '../ContestLevel3/ContestLevel3?MatchId=' + e.currentTarget.dataset.id.MatchId
    })
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
      selection: data.index
    })
  },
  returnHome() {
    wx.switchTab({
      url: '../../A_HomePage/HomePage',
    })
  },
  GotoAdminLevel2(){
    wx.navigateTo({
      url: '../ContestLevel2Admin/ContestLevel2Admin?ContestId=' +this.data.ContestId
    })
  }
})