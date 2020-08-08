//miniprogram/pages/ContestLevel3/ContestLevel3.js
const CF = require('../../../js/CloudFunction.js')
const PF = require('../../../js/PreFunction.js')
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
    Status: -1,
    MatchSendInformation: [],
    ContestMember: [],
    SpareContestMember: [],
    CurrentMemberId: "",
    CurrentMember: {
      MemberName: '暂无',
      MemberTag: '',
      MemberDescription: ''
    },
    MatchMember: [],
    MatchMemberId: [],
    MatchMemberSupport: [],
    MatchMemberScore: [],
    ChatRoomInfo: [],
    MainChatRoomInfo: [],
    NewInfo: [],
    selection: '',
    NeedRefresh: 1,
    statusBarHeight: '',
    RefereeName: "",
    Time: [],
    DuringTime: 0, //比赛已经开始的时间
    scrollTop:0,
    scrollTopAdmin:0,
    loadModal: true,
    PreMemberInfo: {},
    PreScore: {},
    ScoreItems: [],
    Score: [],
    NewScore: [],
    IsLogin:0,
    IsViewer:0
  },
  //--------------------------------------------------------------------
  IsReady() {
    var that = this;
    console.log("app.globalData.IsChatRoomReady,app.globalData.IsMatchReady,app.globalData.IsMatchSendInfoReady",
      app.globalData.IsChatRoomReady, app.globalData.IsMatchReady, app.globalData.IsMatchSendInfoReady)
    if (app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchReady == 0 || app.globalData.IsMatchSendInfoReady == 0 || app.globalData.IsPreLoadSearchScoreReady == 0 || app.globalData.IsPreLoadSearchMemberReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      console.log("IsViewer3",app.globalData.IsBind)
      app.globalData.IsChatRoomReady = 0;
      app.globalData.IsMatchReady = 0;
      app.globalData.IsMatchSendInfoReady = 0;
      app.globalData.IsPreLoadSearchScoreReady = 0;
      app.globalData.IsPreLoadSearchMemberReady = 0;
      var IsViewer = 1-app.globalData.IsBind
      console.log("IsViewer4", IsViewer)
      console.log(app.TempData.MatchInfo)
      that.setData({
        IsViewer:IsViewer,
        loadModal: false,
        MatchResultId: app.TempData.MatchInfo[0]._id,
        MatchPlace: app.TempData.MatchInfo[0].MatchPlace,
        MatchName: app.TempData.MatchInfo[0].MatchName,
        MatchMemberId: app.TempData.MatchInfo[0].MemberId,
        MatchMemberSupport: app.TempData.MatchInfo[0].MemberSupport,
        MatchMemberScore: app.TempData.MatchInfo[0].MemberScore,
        CurrentMemberId: app.TempData.MatchInfo[0].CurrentMemberId,
        Time: app.TempData.MatchInfo[0].Time,
        ContestMember: app.TempData.TempContestMember,
        Status: app.TempData.MatchInfo[0].Status,
        ChatRoomId: app.TempData.ChatRoom[0]._id,
        ChatRoomInfo: app.TempData.ChatRoom[0],
        MatchSendInformation: app.TempData.MatchSendInfo,
        PreMemberInfo: app.TempData.PreMemberInfo,
        PreScore: app.TempData.PreScore,
        ScoreItems: app.TempData.ContestInfo.Pre_ScoreItem
      })
      console.log("PreScore",this.data.PreScore)
      this.GetMemberInfo();
      this.SplitChatRoomInfo();
      this.GetCurrentMemberInfo();
      this.RefreshInfo();
      this.RefreshCurrentMemberInfo();
      this.CalculateTime();
      this.InitScore();
    }
  },
  InitScore() {
    var that = this
    var PreScore = this.data.PreScore;
    console.log("PreScore", PreScore);
    var ScoreItemsLen = this.data.ScoreItems.length
      var PreMemberInfoLen = this.data.MatchMemberId.length;
      console.log("ScoreItemsLen,PreMemberInfoLen", ScoreItemsLen, PreMemberInfoLen)
      console.log("MatchMember", this.data.MatchMember)
      var InitScore = []
    if (PreScore.Score.length != 0) {
      for (var i = 0; i < PreMemberInfoLen; i++) { // [[],[],[]]
        var temp = {
          "Score": []
        }
        console.log("i",i)
        temp["MemberId"] = this.data.MatchMember[i].Info.MemberId
        var flag = 0;
        PreScore.Score.forEach(function (item, index) {
          console.log("item.MemberId,that.data.MatchMember[i]",item.MemberId,that.data.MatchMember[i].Info.MemberId)
          if (item.MemberId == that.data.MatchMember[i].Info.MemberId) {
            temp["Score"] = JSON.parse(JSON.stringify(item.ItemScore));
            flag = 1;
          }
        })
        if (flag == 0) {
          for (var j = 0; j < ScoreItemsLen; j++) {
            temp["Score"].push("");
          }
        }
        InitScore.push(temp);
      }
    }else{
      console.log("null")
      for (var i = 0; i < PreMemberInfoLen; i++) {
        var temp = {
          "Score": []
        }
        for(var j=0;j<ScoreItemsLen; j++){
          temp["Score"].push("");
        }
        InitScore.push(temp);
      }
    }

    console.log("InitScore", InitScore)
    // var InitScore2=[{"Score":["12","13","16"],"MemberId":"d41d8cc98f00b204e9800998ecf8427e"},{"Score":["15","15","15"],"MemberId":"d41d8ce98f00b204e9800998ecf8427e"},{"Score":["14","12","12"],"MemberId":"d41d8cd98f00b204e9800998ecf8427e"}]
    var InitScore2 = []
    InitScore2 = JSON.parse(JSON.stringify(InitScore));
    this.setData({
      Score: InitScore,
      NewScore: InitScore2
    })
  },
  GetMemberInfo() {
    var that = this;
    var MatchMemberId = this.data.MatchMemberId;
    var AllMember = this.data.ContestMember;
    var MatchMemberIdLen = 0;
    var AllMemberLen = 0;
    if (MatchMemberIdLen != null && AllMember != null) {
      MatchMemberIdLen = this.data.MatchMemberId.length;
      AllMemberLen = this.data.ContestMember.length;
    }
    var SpareMember = []
    var Member = []
    console.log("AllMember", AllMember)
    var flag = 0;

    for (var i = 0; i < AllMemberLen; i++) {
      flag = 0;
      var TempId = AllMember[i].MemberId
      for (var j = 0; j < MatchMemberIdLen; j++) {
        if (TempId == MatchMemberId[j]) {
          Member.push({
            "Info": AllMember[i],
            "Index": j
          });
          break;
        }
      }
    }
    //Member中现在存了所有参加比赛的人员的信息，现在要把每个人的打分赋值分发下去
    var PreScore = this.data.PreScore;
    Member.forEach(function (item2, index2) {
      var flag = 0;
      var MemberId = item2.Info.MemberId
      PreScore.Score.forEach(function (item, index) {
        var MemberScore = item.MemberScore;
        if (MemberId == item.MemberId) {
          item2.Score = MemberScore;
          flag = 1;
        }
      })
      if (flag == 0) {
        item2.Score = 0;
      }
    })
    console.log("MemberNew", Member)
    this.setData({
      MatchMember: Member,
    })

  },
  CalculateTime() {
    var Time = this.data.Time
    var During = 0;
    if (Time == null) {
      return;
    }
    var len = Time.length;
    var count = 0; //count 计算数组中出现0以后的长度数 例如：Time=[123,234,0,123,234,345]  count=2;
    //Time=[1213,3214,4243,4444] count = 3; 
    var pos = -1; //记录最后一个0的位置
    for (var i = 0; i < len; i++) {
      if (Time[i] == 0) {
        count = 0;
        pos = i;
      } else {
        count++;
      }
    }
    var Currenttimestamp = (new Date()).getTime();
    console.log(Currenttimestamp); //1495302061441
    if (count % 2 == 1) { //len 为奇数，代表比赛正在进行，len为偶数则代表比赛暂停或已经结束
      for (var i = pos + 1; i < len; i += 2) {
        if (i + 1 != len) {
          During = During + Time[i + 1] - Time[i];
        } else {
          During = During + Currenttimestamp - Time[i]
        }
      }
    } else {
      for (var i = pos + 1; i < len; i += 2) {
        During = During + Time[i + 1] - Time[i];
      }
    }
    During = Math.ceil(During / (60 * 1000))
    this.setData({
      DuringTime: During
    })
    console.log("During", During)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options!=undefined){
    this.setData({
      MatchId: options.MatchId,
      selection: '0'
    })
  }
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    //this.calculateScrollViewHeight()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    this.CheckUserInfo()
    console.log("IsViewer",app.globalData.IsBind)
    this.IsAddPreScoreReady()
  },

  IsAddPreScoreReady() {
    var that = this;
    console.log("app.globalData.IsAddPreScoreReady", app.globalData.IsAddPreScoreReady)
    if (app.globalData.IsAddPreScoreReady == 0) {
      setTimeout(function () {
        that.IsAddPreScoreReady()
      }, 300)
    } else {
      console.log("IsViewer2",app.globalData.IsBind)
      app.globalData.IsAddPreScoreReady = 0;
      CF.SearchChatRoom(this.data.MatchId);
      CF.SearchMatch(this.data.MatchId);
      CF.SearchMatch_Information(this.data.MatchId);
      PF.SearchPreScore(app.globalData.UserId,this.data.MatchId);
      PF.SearchPreMemberInfo(app.globalData.UserId);
      this.IsReady();
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
    this.calculateScrollViewHeight()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      NeedRefresh: 0
    })
    console.log("this.data.NeedRefresh", this.data.NeedRefresh)
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      NeedRefresh: 0
    })
    console.log("this.data.NeedRefresh", this.data.NeedRefresh)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchChatRoom(this.data.MatchId);
    CF.SearchMatch(this.data.MatchId);
    CF.SearchMatch_Information(this.data.MatchId);
    PF.SearchPreScore(app.globalData.UserId,this.data.MatchId);
    PF.SearchPreMemberInfo(app.globalData.UserId);
    this.IsReady();
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
  // //单项打分相关函数
  // BindScoreChange(e) {
  //   var index = e.currentTarget.dataset.index
  //   console.log("index", index)
  //   var MatchMember = this.data.MatchMember;
  //   console.log("MatchMember", MatchMember)
  //   console.log("MatchMember[index]", MatchMember[index])
  //   MatchMember[index].Score = e.detail.value
  //   console.log("MatchMember", MatchMember)
  //   this.setData({
  //     MatchMember: MatchMember
  //   })
  // },
  
  // SubmitScore(e) {
  //   var index = e.currentTarget.dataset.index;
  //   console.log("index", index)
  //   var Score = this.data.MatchMember[index].Score;
  //   console.log("Score", Score)
  //   var MemberScore = this.data.PreScore;
  //   var MemberId = this.data.MatchMember[index].Info.MemberId
  //   console.log("MemberScore",MemberScore)
  //   var flag=0;
  //   MemberScore.Score.forEach(function(item,index){
  //     if(item.MemberId == MemberId){
  //       item.MemberScore = Score;
  //       flag=1;
  //     }
  //   })
  //   if(flag==0){
  //     MemberScore.Score.push({"MemberScore":Score,"MemberId":MemberId})
  //   }
  //   console.log("MemberScore",MemberScore)
  //   var MemberId = ""
  //   this.setData({
  //     PreScore:MemberScore
  //   })
  //   PF.UpdateMemberScore(this.data.PreScore._id,this.data.PreScore.Score);
  // },

  ////////////////////////////////////////////////////////////////
  //////////////////    多项打分相关函数    ///////////////////////
  ////////////////////////////////////////////////////////////////

  BindItemScoreChange: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var itemid = e.currentTarget.dataset.itemid;
    var value = e.detail.value;
    console.log(id, itemid, value)
    console.log("this.data.Score", this.data.Score)
    var newScore = this.data.Score;
    newScore[id].Score[itemid] = value;
    this.setData({
      Score: newScore
    })
    console.log("this.data.Score", this.data.Score)
    console.log("this.data.NewScore", this.data.NewScore)
  
  },

  CheckSubmit: function(index) {
    var ScoreItems = this.data.ScoreItems;
    var Score = this.data.Score;
    console.log(ScoreItems, Score[index])
    var flag = 0;
    Score[index].Score.forEach(function(item,index2){
      console.log(item);
      if(parseInt(item)<0 || parseInt(item)>parseInt(ScoreItems[index2].ScoreBound)){
        flag = -1;
        console.log("-1")
      }
      if(!item) {
        flag = -2;
        console.log("-2")
      }
    })
    if(flag == 0){
      return 1;
    }
    else{
      return flag;
    }
  },

  SubmitItemScore: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index
    var check = '';
    if((check = this.CheckSubmit(index)) == 1){
    wx.showLoading({
      title: '加载中',
    })
    console.log(this.data.MatchMember[index]);
    var MemberId = this.data.MatchMember[index].Info.MemberId;
    var ItemScore = this.data.Score[index].Score; //[321,123,123]
    var TotalScore = 0;
    console.log("ItemScore,MemberId", ItemScore, MemberId)
    ItemScore.forEach(function (item, index) {
      TotalScore += parseInt(item);
    })
    console.log("TotalScore", TotalScore)
    console.log("this.data.Score", this.data.Score);
    console.log("this.data.NewScore", this.data.NewScore);
    var Score = this.data.PreScore.Score
    var NewPreScore = this.data.PreScore;
    var flag = 0;

    Score.forEach(function (item, index) {
      if (item.MemberId == MemberId) {
        item["TotalScore"] = TotalScore.toString();
        item["ItemScore"] = ItemScore;
        flag = 1
      }
    })
    if (flag == 0) { //第一次为该成员打分
      var temp = {};
      temp["MemberId"] = MemberId;
      temp["TotalScore"] = TotalScore.toString();
      temp["ItemScore"] = ItemScore;
      Score.push(temp);
    }
    NewPreScore["Score"] = Score;
    console.log("NewPreScore", NewPreScore)
    this.setData({
      PreScore: NewPreScore
    })
    PF.UpdateMemberScore(this.data.PreScore._id, NewPreScore.Score)
  }else{
    if(check == -1)
    {
      wx.showToast({
        icon:"none",
        title: '请在合理范围内给分',
      })
    }
    else if(check == -2)
    {
      wx.showToast({
        icon:"none",
        title: '请给每一项打分后提交',
      })
    }

  }
  },

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

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
    if (ChatInfo != null) {
      len = ChatInfo.length;
    } else {
      len = 0;
    }
    var scrollTop = len * 70
    console.log("scrollTop", scrollTop);
    this.setData({
      scrollTop: scrollTop
    })
    console.log("ChatInfo,SendTime,Sender,SenderUrl,Status", ChatInfo, SendTime, Sender, SenderUrl, Status)
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
        "Status": Status[i]
      });
    }
    console.log("ChatRoomInfo", ChatRoomInfo)
    this.setData({
      MainChatRoomInfo: ChatRoomInfo
    })
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
    this.setData({
      NewInfo: ""
    })
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
      console.log("MainChatRoomInfo", this.data.MainChatRoomInfo)
      var NewChatRoom = this.data.MainChatRoomInfo
      NewChatRoom.push({
        "ChatInfo": Info,
        "SendTime": Hour_Minute,
        "Sender": SenderName,
        "SenderUrl": SenderUrl,
        "isMyself": 1,
        "IsShowTime": true,
        "Status": 1
      })
      var scrollTop = this.data.scrollTop;
      scrollTop += 70;
      this.setData({
        MainChatRoomInfo: NewChatRoom,
        scrollTop: scrollTop
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
    console.log("app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchReady == 0 || app.globalData.IsMatchSendInfoReady == 0 || app.globalData.IsPreLoadSearchScoreReady == 0 || app.globalData.IsPreLoadSearchMemberReady == 0",
    app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchReady == 0 || app.globalData.IsMatchSendInfoReady == 0 || app.globalData.IsPreLoadSearchScoreReady == 0 || app.globalData.IsPreLoadSearchMemberReady == 0)
    if (app.globalData.IsChatRoomReady == 0 || app.globalData.IsMatchReady == 0 || app.globalData.IsMatchSendInfoReady == 0 || app.globalData.IsPreLoadSearchScoreReady == 0 || app.globalData.IsPreLoadSearchMemberReady == 0) {
      setTimeout(function () {
        that.IsRefreshReady();
      }, 100)
    } else {
      app.globalData.IsChatRoomReady = 0;
      app.globalData.IsMatchReady = 0;
      app.globalData.IsMatchSendInfoReady = 0;
      app.globalData.IsPreLoadSearchScoreReady = 0;
      app.globalData.IsPreLoadSearchMemberReady = 0;
      this.setData({
        CurrentMemberId: app.TempData.MatchInfo[0].CurrentMemberId,
        ChatRoomInfo: app.TempData.ChatRoom[0],
        MatchSendInformation: app.TempData.MatchSendInfo,
        Time: app.TempData.MatchInfo[0].Time,
        PreMemberInfo: app.TempData.PreMemberInfo,
        PreScore: app.TempData.PreScore,
      })
      this.GetCurrentMemberInfo();
      this.SplitChatRoomInfo();
      setTimeout(function () {
        that.RefreshInfo();
      },5000)
    }
  },
  IsRefreshCurrentMemberInfoReady(){
    var that = this
    if ( app.globalData.IsPreLoadSearchScoreReady == 0 || app.globalData.IsPreLoadSearchMemberReady == 0) {
      setTimeout(function () {
        that.IsRefreshCurrentMemberInfoReady();
      }, 300)
    } else {
      app.globalData.IsPreLoadSearchScoreReady = 0;
      app.globalData.IsPreLoadSearchMemberReady = 0;
      this.setData({
        CurrentMemberId: app.TempData.MatchInfo[0].CurrentMemberId,  
        PreMemberInfo: app.TempData.PreMemberInfo,
        PreScore: app.TempData.PreScore,
      })
      this.GetCurrentMemberInfo();
      setTimeout(function () {
        that.RefreshCurrentMemberInfo();
      },120000)
    }
  },
  RefreshCurrentMemberInfo(){
    var that = this;
    console.log("this.data.MatchMember", this.data.MatchMember);
    console.log("this.data.NeedRefresh", this.data.NeedRefresh)
    if (this.data.NeedRefresh == 1){
      PF.SearchPreScore(app.globalData.UserId,this.data.MatchId);
      PF.SearchPreMemberInfo(app.globalData.UserId);
      this.IsRefreshCurrentMemberInfoReady();
    }
  },
  RefreshInfo() {
    var that = this;
    console.log("this.data.MatchMember", this.data.MatchMember);
    console.log("this.data.NeedRefresh", this.data.NeedRefresh)
    if (this.data.NeedRefresh == 1 && this.data.selection == "2"){
      CF.SearchChatRoom(this.data.MatchId);
      CF.SearchMatch_Information(this.data.MatchId)
      CF.SearchMatch(this.data.MatchId);
      PF.SearchPreScore(app.globalData.UserId,this.data.MatchId);
      PF.SearchPreMemberInfo(app.globalData.UserId);
      this.IsRefreshReady();
    }
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
      selection: data.index
    })
    this.RefreshInfo()
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
    query.exec((res) => {
      let selectBarHeight = res[0].height;
      let selectBarTop = res[0].top;
      let cuBarHeight = res[1].height;
      //let infoBarHeight = res[2].height;
      let selectBarBottom = res[0].bottom;
      let selectBarWidth = res[0].width;
      //let statusBarHeight = this.data.statusBarHeight;
      let windowWidth = wx.getSystemInfoSync().windowWidth;
			let chatScrollViewHeight = wx.getSystemInfoSync().screenHeight - selectBarTop - selectBarHeight - cuBarHeight - (windowWidth - selectBarWidth);
			let infoScrollViewHeight = wx.getSystemInfoSync().screenHeight - selectBarBottom - (windowWidth - selectBarWidth);
      //let infoScrollViewHeight = wx.getSystemInfoSync().screenHeight - infoBarHeight - selectBarHeight - statusBarHeight - 5.6 * cuBarHeight;
      let newsScrollViewHeight = infoScrollViewHeight;
      console.log(">>>>>>>>>Scroll height:", chatScrollViewHeight, infoScrollViewHeight, newsScrollViewHeight)
      that.setData({
        chatScrollViewHeight: chatScrollViewHeight,
        infoScrollViewHeight: infoScrollViewHeight,
        newsScrollViewHeight: newsScrollViewHeight
      });
    })
  },
  GetCurrentMemberInfo() {
    var that = this;
    var CurrentMemberId = this.data.CurrentMemberId;
    var MatchMember = this.data.MatchMember;
    MatchMember.forEach(function (item, index) {
      if (item.Info.MemberId == CurrentMemberId) {
        that.setData({
          CurrentMember: item.Info
        })
      }
    })
    console.log(this.data.CurrentMember)
  },
  BindNewInfoChange(e) {
    this.setData({
      NewInfo: e.detail.value
    })
    console.log(this.data.NewInfo)
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