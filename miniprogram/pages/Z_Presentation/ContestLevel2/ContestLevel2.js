// miniprogram/pages/ContestLevel2/ContestLevel2.js
const CF = require('../../../js/CloudFunction.js')
const PF = require('../../../js/PreFunction.js');
const {
  BindPreMember
} = require('../../../js/PreFunction.js');
var app = getApp();
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
    MatchNotYetStart: [],
    MatchIsGoing: [],
    MatchIsEnded: [],
    ContestMember: [], //所有已注册的参赛成员
    statusBarHeight: '',
    selection: 1,
    IsAdmin: 0,
    ContestRecordId: "",
    CurrentMemberInfo: {},
    loadModal: true,
    BindPre: 0,
    IsBindOk: 0,
    StuId: "",
    Name: "",
    IsViewer: 0,
    IsViewerMain: 0,
    InputReferee: "",
    IdentifyReferee: 0,
    IdentifyRefereeCode:''
  },
  IsReady() {
    var that = this;
    console.log("app.globalData.IsContestMatchReady,app.globalData.IsContestInfoReady", app.globalData.IsContestMatchReady, app.globalData.IsContestInfoReady)
    if (app.globalData.IsContestMatchReady == 0 || app.globalData.IsContestInfoReady == 0 || app.globalData.IsContestMemberReady == 0 || app.globalData.IsPreReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      app.globalData.IsContestMatchReady = 0;
      app.globalData.IsContestInfoReady = 0;
      app.globalData.IsContestMemberReady = 0;
      app.globalData.IsPreReady = 0;
      var ContestInfo = app.TempData.ContestInfo
      var AdminContest = app.globalData.MyAdminContest;

      console.log("AdminContest", AdminContest)
      var AdminContestlen = AdminContest.length;
      var IsAdmin = 0;
      for (var i = 0; i < AdminContestlen; i++) {
        if (this.data.ContestId == AdminContest[i].ContestId) {
          IsAdmin = 1;
          break;
        }
      }
      console.log("IsAdmin", IsAdmin);
      this.setData({
        loadModal: false,
        IsAdmin: IsAdmin,
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
        ContestDescription: ContestInfo.ContestDescription,
        ContestRecordId: ContestInfo._id,
        IdentifyRefereeCode:ContestInfo.Pre_IdentifyCode
      })
      if (app.TempData.TempContestMember != undefined) {
        this.setData({
          ContestMember: app.TempData.TempContestMember
        })
      } else {
        this.setData({
          ContestMember: []
        })
      }
      CF.MainAddScanNumber(this.data.ContestRecordId)
      that.SplitAllMatchInfo();
      console.log("that.data.FileId", that.data.FileId);
      console.log("AllMatch Info", that.data.AllMatchInfo);
      console.log("Match Not Yet Start", that.data.MatchNotYetStart);
      console.log("MatchIsGoing", that.data.MatchIsGoing);
      console.log("MatchIsEnded", that.data.MatchIsEnded);
      if (app.globalData.PreIsFirst == 1) {
        this.setData({
          IsViewer: 1
        })
      } else {
        this.setData({
          IsBindOk: 1,
          IsViewerMain: app.globalData.IsBind
        })
      }
    }
  },
  ChooseViewer() {
    this.setData({
      IsViewer: 0,
      IsViewerMain: 0
    })
    app.globalData.IsBind = 0;
    PF.BindPreMember(this.data.ContestId, "观众"+app.globalData.UserId, "", app.globalData.UserId);
    console.log("app.globalData.IsBind",app.globalData.IsBind)
    this.IsGuanZhongBindPreSuccess();
  },
  ChooseReferee() {
    this.setData({
      IsViewer: 0
    })
    this.IdentiyReferee();
  },
  IdentiyReferee() {
    this.setData({
      IdentifyReferee: 1
    })
  },
  BindChangeInputReferee(e) {
    this.setData({
      InputReferee: e.detail.value
    })
  },
  IdentifyConfirm() {
    if (this.data.InputReferee == this.data.IdentifyRefereeCode) {
      this.setData({
        IdentifyReferee: 0
      })
      this.BindPreMember();
    } else {
      wx.showToast({
        icon: 'none',
        title: '验证码错误',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  IsGetOpenidReady(options){
    var that = this;
    if(app.globalData.IsGetOpenidReady ==0){
      setTimeout(function(){
        that.IsGetOpenidReady(options);
      },1000)
    }else{
      this.setData({
        ContestId: options.ContestId
      })
      PF.SearchIsPreMember(this.data.ContestId, app.globalData.UserId);
      CF.SearchContestMatch(this.data.ContestId);
      CF.SearchContestInfo(this.data.ContestId);
      CF.SearchContestMember(this.data.ContestId); //此处搜索过以后在三级页面用数据
      this.IsReady(); //判断数据是否加载好
      //--------------------UI数据-----------------------------------
      this.setData({
        statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff9700',
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    this.IsGetOpenidReady(options);
  },
  BindChangeStuId(e) {
    this.setData({
      StuId: e.detail.value
    })
  },
  BindChangeName(e) {
    this.setData({
      Name: e.detail.value
    })
  },
  BindPreMember(ContestId) {
    this.setData({
      BindPre: 1
    })
  },
  ConfirmPreMember(e) {
    var Name = this.data.Name;
    var StuId = this.data.StuId;
    if (Name != "" && StuId != "") {
      wx.showLoading({
        title: '提交中',
      })
      PF.BindPreMember(this.data.ContestId, Name, StuId, app.globalData.UserId);
      this.IsBindPreSuccess();
    } else {
      wx.showToast({
        icon: 'none',
        title: '请填写信息',
      })
    }

  },
  IsGuanZhongBindPreSuccess(){
    var that = this;
    console.log("app.globalData.IsBindReady",app.globalData.IsBindReady)
    console.log("app.globalData.IsBind2",app.globalData.IsBind)
    if (app.globalData.IsBindReady == 0) {
      setTimeout(function () {
        that.IsGuanZhongBindPreSuccess();
      }, 300)
    } else {
      wx.hideLoading()
      var BindPre = 1-app.globalData,IsBindOk
      this.setData({
        IsBindOk: app.globalData.IsBindOk,
        BindPre: BindPre
      })
      app.globalData.IsBindReady = 0;
      app.globalData.IsBind = 0;
      console.log("app.globalData.IsBind3",app.globalData.IsBind)
    }
  },
  IsBindPreSuccess() {
    var that = this;
    if (app.globalData.IsBindReady == 0) {
      setTimeout(function () {
        that.IsBindPreSuccess();
      }, 300)
    } else {
      wx.hideLoading()
      this.setData({
        IsBindOk: app.globalData.IsBindOk,
        BindPre: !app.globalData.IsBindOk
      })
      app.globalData.IsBindReady = 0;
      app.globalData.IsBind = 1;
    }
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchContestMatch(this.data.ContestId);
    CF.SearchContestInfo(this.data.ContestId);
    CF.SearchContestMember(this.data.ContestId); //此处搜索过以后在三级页面用数据
    this.IsReady(); //判断数据是否加载好
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
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
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //将比赛按照类型进行分配
  SplitAllMatchInfo() {
    var AllContestMember = this.data.ContestMember;
    var temp = "";
    var len = this.data.AllMatchInfo.length
    var i = 0;
    var MatchNotYetStart = []
    var MatchIsGoing = []
    var MatchIsEnded = []
    var AllMatchNew = []
    for (i = 0; i < len; i++) {
      var tempitem = this.data.AllMatchInfo[i]
      var CurrentMemberId = tempitem.CurrentMemberId;
      AllContestMember.forEach(function (item, index) {
        if (item.MemberId == CurrentMemberId) {
          tempitem["CurrentMemberInfo"] = item;
        }
      })
      console.log("tempitem", tempitem)
      var Status = tempitem.Status;
      if (Status == -1) {
        MatchNotYetStart.push(tempitem);
      } else if (Status == 0 || Status == 2) {
        MatchIsGoing.push(tempitem)
      } else {
        MatchIsEnded.push(tempitem)
      }
      AllMatchNew.push(tempitem);
    }
    this.setData({
      MatchNotYetStart: MatchNotYetStart,
      MatchIsGoing: MatchIsGoing,
      MatchIsEnded: MatchIsEnded,
      AllMatchInfo: AllMatchNew
    })
  },
  GotoContestLevel3(e) {
    console.log(e)
    PF.AddPreScore(this.data.ContestId, e.currentTarget.dataset.id.MatchId, app.globalData.UserId)
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
  GotoAdminLevel2() {
    wx.navigateTo({
      url: '../ContestLevel2Admin/ContestLevel2Admin?ContestId=' + this.data.ContestId
    })
  },
  Quit(){
    wx.switchTab({
      url: '../../A_HomePage/HomePage',
    })
  }
})