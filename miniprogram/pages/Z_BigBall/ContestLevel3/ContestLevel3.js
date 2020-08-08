// miniprogram/pages/ContestLevel3/ContestLevel3.js
const CF = require('../../../js/CloudFunction.js')
const util = require('../../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputBottom: 0,
    userInfo: {},
    userName: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ChatRoomId: "",
    MatchId: "",
    MatchResultId: "",
    MatchPlace: "",
    TeamAName: "",
    TeamBName: "",
    TeamAScore: "",
    TeamBScore: "",
    TeamASupport: 0,
    TeamBSupport: 0,
    TeamARate: "",
    TeamBRate: "",
    Status: -1,
    MatchSendInformation: [],
    TeamAMember: [],
    TeamBMember: [],
    TeamAMemberId: [],
    TeamBMemberId: [],
    ContestMember: [],
    ChatRoomInfo: [],
    MainChatRoomInfo: [],
    NewInfo: [],
    selection: '',
    NeedRefresh:1,
    statusBarHeight: '',
    RefereeName:"",
    Time:[],
    DuringTime:0, //比赛已经开始的时间
    IsTeamABeenSupported: 1,
    IsTeamBBeenSupported: 1,
    scrollTop:0,
    scrollTopAdmin:0,
    loadModal:true,
    IsLogin:0
  },
  IsReady() {
    var that = this;
    console.log("app.globalData.IsChatRoomReady,app.globalData.IsMatchReady,app.globalData.IsMatchSendInfoReady",
      app.globalData.IsChatRoomReady, app.globalData.IsMatchReady, app.globalData.IsMatchSendInfoReady)
    if (app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchReady == 0 || app.globalData.IsMatchSendInfoReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      app.globalData.IsChatRoomReady = 0;
      app.globalData.IsMatchReady = 0;
      app.globalData.IsMatchSendInfoReady = 0;
      console.log(app.TempData.MatchInfo)
      that.setData({
        loadModal:false,
        MatchResultId: app.TempData.MatchInfo[0]._id,
        MatchPlace: app.TempData.MatchInfo[0].MatchPlace,
        TeamAName: app.TempData.MatchInfo[0].TeamAName,
        TeamBName: app.TempData.MatchInfo[0].TeamBName,
        TeamAScore: app.TempData.MatchInfo[0].TeamAScore,
        TeamBScore: app.TempData.MatchInfo[0].TeamBScore,
        TeamASupport: app.TempData.MatchInfo[0].TeamASupport,
        TeamBSupport: app.TempData.MatchInfo[0].TeamBSupport,
        TeamAMemberId: app.TempData.MatchInfo[0].TeamAMemberId,
        TeamBMemberId: app.TempData.MatchInfo[0].TeamBMemberId,
        RefereeName:app.TempData.MatchInfo[0].RefereeName,
        Time:app.TempData.MatchInfo[0].Time,
        ContestMember: app.TempData.TempContestMember,
        Status: app.TempData.MatchInfo[0].Status,
        ChatRoomId: app.TempData.ChatRoom[0]._id,
        ChatRoomInfo: app.TempData.ChatRoom[0],
        MatchSendInformation: app.TempData.MatchSendInfo,
      })
      console.log("TeamAMemberId,TeamBMemberId", that.data.TeamAMemberId, that.data.TeamBMemberId)
      this.GetTeamMemberInfo();
      this.SplitChatRoomInfo();
      this.GetSupportRate();
      this.RefreshInfo();
      this.CalculateTime();
    }
  },
  CalculateTime(){
    var Time = this.data.Time
    var During = 0;
    if(Time == null){
      return;
    }
    var len = Time.length;
    var count = 0;  //count 计算数组中出现0以后的长度数 例如：Time=[123,234,0,123,234,345]  count=2;
                                                         //Time=[1213,3214,4243,4444] count = 3; 
    var pos = -1; //记录最后一个0的位置
    for(var i=0;i<len;i++){
      if(Time[i]==0){
        count = 0;
        pos = i;
      }else{
        count++;
      }
    }
    var Currenttimestamp = (new Date()).getTime();
    console.log(Currenttimestamp); //1495302061441
    if(count%2==1){   //len 为奇数，代表比赛正在进行，len为偶数则代表比赛暂停或已经结束
      for(var i=pos+1;i<len;i+=2){
         if(i+1!=len){
           During = During + Time[i+1] - Time[i];
         }else{
           During = During + Currenttimestamp - Time[i]
         }
      }
    }else{
      for(var i=pos+1;i<len;i+=2){
          During = During + Time[i+1] - Time[i];
      }
    }
    During = Math.ceil(During / (60*1000))
    this.setData({
      DuringTime:During
    })
    console.log("During",During)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      MatchId: options.MatchId,
      selection: '1'
    })
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    this.calculateScrollViewHeight()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    this.CheckUserInfo()
    CF.SearchChatRoom(this.data.MatchId);
    CF.SearchMatch(this.data.MatchId);
    CF.SearchMatch_Information(this.data.MatchId);
    this.IsReady();
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
    this.setData({
      NeedRefresh:0
    })
    console.log("this.data.NeedRefresh",this.data.NeedRefresh)
  },

  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      NeedRefresh:0
    })
    console.log("this.data.NeedRefresh",this.data.NeedRefresh)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
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
  GetTeamMemberInfo() {
    var that = this;
    var TeamAMemberId = this.data.TeamAMemberId;
    var TeamBMemberId = this.data.TeamBMemberId; 
    var AllMember = this.data.ContestMember;
    var TeamAMemberIdLen = 0;
    var TeamBMemberIdLen = 0;
    var AllMemberLen=0;
    console.log("TeamAMemberId",TeamAMemberId)
    if(TeamAMemberId!=null&&TeamBMemberId!=null&&AllMember!=null){
      TeamAMemberIdLen = this.data.TeamAMemberId.length;
      TeamBMemberIdLen = this.data.TeamBMemberId.length;
      AllMemberLen = this.data.ContestMember.length;
    }
    var TeamA = []
    var TeamB = []
    console.log("AllMember", AllMember)
    var flag = 0;
    for (var i = 0; i < AllMemberLen; i++) {
      flag = 0;
      var TempId = AllMember[i].MemberId
      for (var j = 0; j < TeamAMemberIdLen; j++) {
        if (TempId == TeamAMemberId[j]) {
          TeamA.push(AllMember[i]);
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        for (var j = 0; j < TeamBMemberIdLen; j++) {
          if (TempId == TeamBMemberId[j]) {
            TeamB.push(AllMember[i]);
            flag = 1;
            break;
          }
        }
      }
    }
    console.log("TeamA,TeamB", TeamA, TeamB)
    this.setData({
      TeamAMember: TeamA,
      TeamBMember: TeamB
    })
  },
  SupportTeamA() {
    var that = this;
    var SupportNum = this.data.TeamASupport
    SupportNum++;
    this.setData({
      TeamASupport: SupportNum,
      IsTeamABeenSupported:0
    })
    this.GetSupportRate();
    CF.UpdateTeamASupport(this.data.MatchResultId, SupportNum);
  },
  SupportTeamB() {
    var that = this;
    var SupportNum = this.data.TeamBSupport
    SupportNum++;
    this.setData({
      TeamBSupport: SupportNum,
      IsTeamBBeenSupported: 0
    })
    this.GetSupportRate();
    CF.UpdateTeamBSupport(this.data.MatchResultId, SupportNum);
  },
  CalculateDuring(Time1, Time2) {
    console.log("Time1,Time2", Time1, Time2)
    var Hour1 = Time1.substring(0, 2);
    var Hour2 = Time2.substring(0, 2)
    var Minute1 = Time1.substring(3, 5);
    var Minute2 = Time2.substring(3, 5);
    console.log("Hour1,Hour2,Minute1,Minute2", Hour1, Hour2, Minute1, Minute2);
    var HourDiffer = Hour2 - Hour1;
    var MinuteDiffer = Minute2 - Minute1;
    if (MinuteDiffer < 0) {
      MinuteDiffer += 60;
      HourDiffer -= 1
    }
    return HourDiffer * 60 + MinuteDiffer;
  },
  CalculateDuring(Time1, Time2) {
    console.log("Time1,Time2", Time1, Time2)
    var Hour1 = Time1.substring(0, 2);
    var Hour2 = Time2.substring(0, 2)
    var Minute1 = Time1.substring(3, 5);
    var Minute2 = Time2.substring(3, 5);
    console.log("Hour1,Hour2,Minute1,Minute2", Hour1, Hour2, Minute1, Minute2);
    var HourDiffer = Hour2 - Hour1;
    var MinuteDiffer = Minute2 - Minute1;
    if (MinuteDiffer < 0) {
      MinuteDiffer += 60;
      HourDiffer -= 1
    }
    return HourDiffer * 60 + MinuteDiffer;
  },
  CalculateDuring(Time1, Time2) {
    console.log("Time1,Time2", Time1, Time2)
    var Hour1 = Time1.substring(0, 2);
    var Hour2 = Time2.substring(0, 2)
    var Minute1 = Time1.substring(3, 5);
    var Minute2 = Time2.substring(3, 5);
    console.log("Hour1,Hour2,Minute1,Minute2", Hour1, Hour2, Minute1, Minute2);
    var HourDiffer = Hour2 - Hour1;
    var MinuteDiffer = Minute2 - Minute1;
    if (MinuteDiffer < 0) {
      MinuteDiffer += 60;
      HourDiffer -= 1
    }
    return HourDiffer * 60 + MinuteDiffer;
  },
  CalculateDuring(Time1, Time2) {
    console.log("Time1,Time2", Time1, Time2)
    var Hour1 = Time1.substring(0, 2);
    var Hour2 = Time2.substring(0, 2)
    var Minute1 = Time1.substring(3, 5);
    var Minute2 = Time2.substring(3, 5);
    console.log("Hour1,Hour2,Minute1,Minute2", Hour1, Hour2, Minute1, Minute2);
    var HourDiffer = Hour2 - Hour1;
    var MinuteDiffer = Minute2 - Minute1;
    if (MinuteDiffer < 0) {
      MinuteDiffer += 60;
      HourDiffer -= 1
    }
    return HourDiffer * 60 + MinuteDiffer;
  },

  SplitChatRoomInfo() {
    var ChatRoom = this.data.ChatRoomInfo;
    console.log("ChatRoom", ChatRoom)
    var ChatInfo = ChatRoom.ChatInfo;
    var SendTime = ChatRoom.SendTime;
    var Sender = ChatRoom.Sender;
    var SenderUrl = ChatRoom.SenderUrl;
    var Status = ChatRoom.Status;
    var ChatRoomInfo = [] //用于渲染列表的数组
    var len;
    if(ChatInfo!=null){
       len = ChatInfo.length;
    }else{
      len =0;
    }
    var scrollTop = len*70
    console.log("scrollTop",scrollTop);
    this.setData({
      scrollTop:scrollTop
    })
    console.log("ChatInfo,SendTime,Sender,SenderUrl,Status", ChatInfo, SendTime, Sender, SenderUrl,Status)
    for (var i = 0; i < len; i++) {
      var isMyself = (Sender[i] == this.data.userInfo.nickName ? 1 : 0);
      var TimeArray = SendTime[i].split(" ");
      if (i != 0) {
        var LastTimeArray = SendTime[i - 1].split(" ");
        var Differ1 = this.CalculateDuring(LastTimeArray[1], TimeArray[1]);
        console.log("Differ1", Differ1);
      }
      if (i >= 3) {
        var LastThreeTimeArray = SendTime[i - 3].split(" ");
        var Differ2 = this.CalculateDuring(LastThreeTimeArray[1], TimeArray[1]);
        console.log("Differ2", Differ2);
      }
      var IsShowTime = false;
      if (i != 0) {
        if (Differ1 >= 2) {
          IsShowTime = true;
        }
      } else if (i == 0) {
        IsShowTime = true;
      } else if (i > -3) {
        if (Differ2 >= 5) {
          IsShowTime = true;
        }
      }
      ChatRoomInfo.push({
        "ChatInfo": ChatInfo[i],
        "SendTime": TimeArray[1],
        "Sender": Sender[i],
        "SenderUrl": SenderUrl[i],
        "isMyself": isMyself,
        "IsShowTime": IsShowTime,
        "Status":Status[i]
      });
    }
    console.log("ChatRoomInfo", ChatRoomInfo)
    this.setData({
      MainChatRoomInfo: ChatRoomInfo
    })
  },
  GetSupportRate: function () {
    var supportA = this.data.TeamASupport;
    var supportB = this.data.TeamBSupport;
    if (supportA == supportB) {
      this.setData({
        TeamARate: 50,
        TeamBRate: 50
      })
    } else {
      var rateA = supportA / (supportA + supportB) * 100;
      var rateB = supportB / (supportA + supportB) * 100;
      this.setData({
        TeamARate: rateA,
        TeamBRate: rateB
      })
    }
  },
  CheckUserInfo: function () {
    /*获取wx登录信息*/
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        userName: app.globalData.userInfo.userName
      })
      that.SplitChatRoomInfo();
    }
  },
  BindNewInfoChange(e){
    this.setData({
      NewInfo:e.detail.value
    })
    console.log(this.data.NewInfo)
  },
  IsSendReady() {
    var that = this;
    console.log("app.globalData.IsChatRoomReady", app.globalData.IsChatRoomReady)
    if (app.globalData.IsChatRoomReady == 0) {
      setTimeout(function () {
        that.IsSendReady();
      }, 100)
    } else {
      app.globalData.IsChatRoomReady = 0
      that.setData({
        ChatRoomInfo: app.TempData.ChatRoom[0]
      })
      that.SplitChatRoomInfo();
    }
  },
  IsSendReady() {
    var that = this;
    console.log("app.globalData.IsChatRoomReady", app.globalData.IsChatRoomReady)
    if (app.globalData.IsChatRoomReady == 0) {
      setTimeout(function () {
        that.IsSendReady();
      }, 100)
    } else {
      app.globalData.IsChatRoomReady = 0
      that.setData({
        ChatRoomInfo: app.TempData.ChatRoom[0]
      })
      that.SplitChatRoomInfo();
    }
  },
  SendInfo(e) {
    console.log(e);
    var Info = e.detail.value.NewInfo;
    var that = this;
    var time = util.formatTime(new Date());
    console.log("time", time)
    var DateN = time[1];
    var Hour_Minute = time[2];
    var SenderName = this.data.userInfo.nickName
    var SenderUrl = this.data.userInfo.avatarUrl
    var SendTime = DateN + ' ' + Hour_Minute;
    console.log("userinfo", this.data.userInfo)
    console.log("chatroomid", this.data.ChatRoomId)
    console.log("this.data.hasUserInfo", this.data.hasUserInfo)
    if (this.data.hasUserInfo) {
      this.setData({
        NewInfo: ""
      })
      console.log("MainChatRoomInfo", this.data.MainChatRoomInfo)
      var NewChatRoom = this.data.MainChatRoomInfo
      NewChatRoom.push({
        "ChatInfo": Info,
        "SendTime": Hour_Minute,
        "Sender": SenderName,
        "SenderUrl": SenderUrl,
        "isMyself": 1,
        "IsShowTime": true,
        "Status":1 
      })
      var scrollTop = this.data.scrollTop;
      scrollTop += 70;
      this.setData({
        MainChatRoomInfo:NewChatRoom,
        scrollTop:scrollTop
      })
      CF.SendChatRoomInfo(this.data.ChatRoomId, this.data.MatchId, SenderName, SenderUrl, SendTime, Info)
      this.IsSendReady()

    } else {
      this.setData({
        IsLogin:1
      })
    }
  },
  IsRefreshReady() {
    var that = this
    console.log("app.globalData.IsChatRoomReady,app.globalData.IsMatchSendInfoReady,app.globalData.IsMatchReady",
      app.globalData.IsChatRoomReady, app.globalData.IsMatchSendInfoReady,app.globalData.IsMatchReady)
    if (app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchSendInfoReady == 0||app.globalData.IsMatchReady==0) {
      setTimeout(function () {
        that.IsRefreshReady();
      }, 100)
    } else {
      app.globalData.IsChatRoomReady = 0;
      app.globalData.IsMatchSendInfoReady = 0;
      app.globalData.IsMatchReady = 0;
      this.setData({
        ChatRoomInfo: app.TempData.ChatRoom[0],
        MatchSendInformation: app.TempData.MatchSendInfo,
        Time:app.TempData.MatchInfo[0].Time,
      })
      this.SplitChatRoomInfo();
      setTimeout(function () {
       that.RefreshInfo();
      }, 1000)
    }
  },
  RefreshInfo() {
    var that = this;
    console.log("this.data.NeedRefresh",this.data.NeedRefresh)
    if(this.data.NeedRefresh==1&& this.data.selection == "2"){
      CF.SearchChatRoom(this.data.MatchId);
      CF.SearchMatch_Information(this.data.MatchId)
      CF.SearchMatch(this.data.MatchId);
      this.IsRefreshReady();
    }
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
      selection: data.index
    })
    this.RefreshInfo();
  },
  upper() {

  },
  lower() {

  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  returnHome() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  calculateScrollViewHeight() {
    var that = this;
    var query = wx.createSelectorQuery().in(this)
    query.select('#selectBar').boundingClientRect();
    query.select('#cuBar').boundingClientRect();
    query.select('#infoBar').boundingClientRect();
    query.select('#footBar').boundingClientRect();
    query.exec((res) => {
      let selectBarHeight = res[0].height;
      let selectBarTop = res[0].top;
      let cuBarHeight = res[1].height;
      let infoBarHeight = res[2].height;
      let footBarHeight = res[3].height;
      let statusBarHeight = this.data.statusBarHeight;

      //console.log("height:", selectBarHeight, cuBarHeight, infoBarHeight, statusBarHeight)
      //console.log("height:", selectBarHeight, cuBarHeight, infoBarHeight, statusBarHeight, footBarHeight)
      let chatScrollViewHeight = wx.getSystemInfoSync().screenHeight - selectBarTop - selectBarHeight - cuBarHeight - 10;
      let infoScrollViewHeight = wx.getSystemInfoSync().screenHeight - selectBarTop - selectBarHeight - footBarHeight - 10;
      //let infoScrollViewHeight = wx.getSystemInfoSync().screenHeight - infoBarHeight - selectBarHeight - statusBarHeight - 5.6 * cuBarHeight;
      let newsScrollViewHeight = infoScrollViewHeight;
      //console.log("scroll height:", chatScrollViewHeight, infoScrollViewHeight, newsScrollViewHeight)
      that.setData({
        chatScrollViewHeight: chatScrollViewHeight,
        infoScrollViewHeight: infoScrollViewHeight,
        newsScrollViewHeight: newsScrollViewHeight
      });
    })
  },
  hideModal(){
    this.setData({
      IsLogin:0
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      IsLogin:0,
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //console.log(app.globalData.userInfo);
  },

})