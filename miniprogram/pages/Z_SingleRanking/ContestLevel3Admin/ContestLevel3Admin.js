// miniprogram/pages/ContestLevel3Admin/ContestLevel3Admin.js
const CF = require('../../../js/CloudFunction.js')
const util = require('../../../utils/util.js')
import pinyin from "wl-pinyin"
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MatchId: "",
    MatchPlace: "",
    Status: -1,
    NewInformation: "",
    Date: "",
    Hour_Minute: "",
    ContestMember: [],
    SpareContestMember: [],
    CurrentMemberId:"",
    CurrentMember:{},
    MatchMember: [],
    MatchMemberId: [],
    MatchMemberSupport: [],
    MatchMemberScore: [],
    indexA: null,
    indexB: null,
    picker: [],
    selection: '',
    MatchSendInformation: [],
    MatchResultId: "",
    ChatRoomId: [],
    ChatRoomInfo: [],
    TeamARate: "",
    TeamBRate: "",
    hidden: true,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ContestProcedures: ["未开始", "正在进行", "暂停中", "已结束"],
    CurrentStep: 0, // 0 为未开始，1为正在进行，2为暂停中，3为已结束
    Time: [], //记录比赛时间数组
    loadModal:true
  },
  IsReady() {
    var that = this
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
      that.setData({
        loadModal:false,
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
      })
      var CurrentStep = 0;
      if (that.data.Status == -1) {
        CurrentStep = 0;
      } else if (that.data.Status == 0) {
        CurrentStep = 1;
      } else if (that.data.Status == 1) {
        CurrentStep = 3;
      } else {
        CurrentStep = 2;
      }
      this.setData({
        CurrentStep: CurrentStep
      })
      console.log("TeamAMemberId", that.data.TeamAMemberId)
      console.log("MatchInfoResultId", app.TempData.MatchInfo[0]._id)
      this.GetMemberInfo();
      this.SetPickerRange();
      this.SplitChatRoomInfo();
      this.GetCurrentMemberInfo();
      if (app.TempData.TempContestMember != undefined) {
        this.setData({
          ContestMember: app.TempData.TempContestMember,
          ContestMemberRecordId: app.TempData.ContestMemberRecordId
        })
        this.SplitContestMember()
      } else {
        this.setData({
          ContestMember: []
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      selection: '3'
    })
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    })
    that.calculateScrollViewHeight()
    this.setData({
      MatchId: options.MatchId
    })
    this.SetInitialTime();
    CF.SearchChatRoom(this.data.MatchId);
    CF.SearchMatch(this.data.MatchId);
    CF.SearchMatch_Information(this.data.MatchId);
    this.IsReady();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec();
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
    CF.SearchChatRoom(this.data.MatchId);
    CF.SearchMatch(this.data.MatchId);
    CF.SearchMatch_Information(this.data.MatchId);
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
  
  BindNewInfomationChange: function (e) {
    this.setData({
      NewInformation: e.detail.value
    })
  },
  SendNewInformation(e) {
    if (this.data.CurrentStep == 3){
      wx.showToast({
        icon: 'none',
        title: '比赛已结束',
      })
      return;
    }
    var Info = e.detail.value.NewInformation;
    this.setData({
      NewInformation:""
    })
    var MatchInfo = this.data.MatchSendInformation;
    console.log("MatchInfo",MatchInfo)
    var time = this.data.Date.substr(5,15) + ' ' + this.data.Hour_Minute;
    var New = {'MatchId':this.data.MatchId,'Information':e.detail.value.NewInformation,'SendTime':this.data.Date.substr(5,15)+' '+this.data.Hour_Minute};
    var NewMatchInfo = [];
    NewMatchInfo.push(New);
    MatchInfo.forEach(function(item,index){
      NewMatchInfo.push(item);
    })
   this.setData({
     MatchSendInformation:NewMatchInfo
   })
   CF.AddNewInformation(this.data.MatchId, e.detail.value.NewInformation, time);
},
  SetInitialTime() {
    var time = util.formatTime(new Date());
    console.log("time", time)
    this.setData({
      Date: time[1],
      Hour_Minute: time[2]
    })
  },
  SetCurrentMember(e) {
    console.log("e.currentTarget.dataset.id", e.currentTarget.dataset.id);
    this.setData({
      CurrentMemberId:e.currentTarget.dataset.id
    })
    CF.UpdateCurrentMemberId(this.data.MatchResultId, e.currentTarget.dataset.id);
    this.GetCurrentMemberInfo()
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
            "Score": this.data.MatchMemberScore[j],
            "Info": AllMember[i],
            "Index":j
          });
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        SpareMember.push(AllMember[i])
      }
    }
    this.setData({
      MatchMember: Member,
      SpareContestMember: SpareMember
    })
  },
  AddMatchMember(e) {
    if (this.data.CurrentStep == 3) {
      wx.showToast({
        icon: 'none',
        title: '比赛已结束',
      })
      return;
    }
    var MemberId = this.data.MatchMemberId;
    var MemberScore = this.data.MatchMemberScore;
    console.log("e.currentTarget.dataset.id", e.currentTarget.dataset.id)
    MemberId.push(e.currentTarget.dataset.id)
    MemberScore.push(0);
    console.log("MemberId", MemberId);
    console.log("e.currentTarget.dataset.id", e.currentTarget.dataset.id)
    console.log("e.currentTarget.dataset.index", e.currentTarget.dataset.index)
    var NewSpareMember = this.data.SpareContestMember;
    NewSpareMember.splice(e.currentTarget.dataset.index, 1);
    console.log("NewSpareMember", NewSpareMember)
    this.setData({
      MatchMemberId: MemberId,
      MatchMemberScore: MemberScore,
      SpareContestMember: NewSpareMember
    })
    this.SplitContestMember();
    this.GetMemberInfo()
    CF.UpdateMatchMember(this.data.MatchResultId, MemberId, MemberScore);
  },
  DeleteMatchMember(e) {
    if (this.data.CurrentStep == 3) {
      wx.showToast({
        icon: 'none',
        title: '比赛已结束',
      })
      return;
    }
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除改成员吗？',
      success(res) {
        if (res.confirm) {
          var MemberId = that.data.MatchMemberId;
          var MatchMember = that.data.MatchMember;
          var MemberScore = that.data.MatchMemberScore;
          console.log("e.currentTarget.dataset.id", e.currentTarget.dataset.id)
          var index = 0;
          that.data.MatchMemberId.forEach(function (item, index) {
            console.log("item,index", item, index);
            if (item == e.currentTarget.dataset.id) {
              MemberId.splice(index, 1);
              MemberScore.splice(index, 1);
              MatchMember.splice(index,1);
            }
          })
          console.log("MemberId", MemberId)
          var NewSpareMember = that.data.SpareContestMember;
          console.log("e.currentTarget.dataset.item", e.currentTarget.dataset.item)
          NewSpareMember.push(e.currentTarget.dataset.item);
          console.log("NewSpareMember", NewSpareMember)
          that.setData({
            MatchMemberId: MemberId,
            MatchMemberScore: MemberScore,
            SpareContestMember: NewSpareMember,
            MatchMember: MatchMember
          })
          that.SplitContestMember();
          that.GetMemberInfo()
          CF.UpdateMatchMember(that.data.MatchResultId, MemberId, MemberScore);

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
      selection: data.index
    })
  },
  returnHome() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  SetPickerRange: function () {
    var arr = new Array(200)
    console.log("arr", arr);
    for (var i = 0; i < arr.length; i++)
      arr[i] = i;
    console.log("arr", arr);
    this.setData({
      picker: arr
    })
  },
  changeStatu: function () {
    var statu = this.data.Statu
    if (statu == 1) {

    } else if (statu == 0) {

    }
  },
  upper() {

  },
  lower() {

  },

  // 搜索选手函数
  BindSearchNameChange(e) {
    this.setData({
      SearchName: e.detail.value
    })
  },
  SearchMember(e) {
    var that = this;
    var letters = pinyin.getFirstLetter(that.data.SearchName)
    if (this.data.list.find((n) => n == letters[0])) {
      this.setData({
        listCurID: letters[0],
        listCur: letters[0],
        SearchName: ''
      })
    } else {
      wx.showToast({
        title: "没有该参赛选手",
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 滑动条相关函数
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },
  SplitContestMember() {
    var ContestMember = this.data.SpareContestMember;
    var len = ContestMember.length;
    var list = [];
    var Index = []
    for (var i = 0; i < len; i++) {
      console.log("ContestMember[i].MemberName", ContestMember[i].MemberName)
      var letters = pinyin.getFirstLetter(ContestMember[i].MemberName)
      Index.push(letters[0]);
      if (!list.find((n) => n == letters[0])) {
        list.push(letters[0]);
      }
    }
    list.sort();
    this.setData({
      list: list,
      Index: Index,
      listCur: list[0]
    })
  },
  MainSetStatus(e) {
    if (this.data.CurrentStep == 3) {
      wx.showToast({
        icon: 'none',
        title: '比赛已结束',
      })
      return;
    }
    var that = this
    var index = e.currentTarget.dataset.index;
    if (index == 3) {
      wx.showModal({
        title: '提示',
        content: '确定结束该场比赛吗？一旦结束无法修改任何状态！',
        success(res) {
          if (res.confirm) {
            that.SetStatus(e);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.SetStatus(e);
    }
  },
  SetStatus(e) {
    if (this.data.CurrentStep == 3) {
      wx.showToast({
        icon: 'none',
        title: '比赛已结束',
      })
      return;
    }
    var index = e.currentTarget.dataset.index;
    if (this.data.CurrentStep == 0) {
      if (index == 2 || index == 3) {
        wx.showToast({
          icon: 'none',
          title: '比赛未在进行中.无法暂停或结束',
        })
        return;
      }
    }
    if (this.data.CurrentStep == 2) {
      if (index == 3) {
        wx.showToast({
          icon: 'none',
          title: '暂停的比赛无法结束，请先调回正在进行',
        })
        return;
      }
    }
    console.log(index);
    var Currenttimestamp = (new Date()).getTime();
    console.log(Currenttimestamp); //1495302061441
    var CurrentTime = [];
    CurrentTime = this.data.Time;
    if (index == this.data.CurrentStep) {
      wx.showToast({
        icon: 'none',
        title: '当前已是该状态',
      })
      CurrentTime.splice(0, CurrentTime.length);
    } else {
      var State = 0;
      if (index == 0) {
        CurrentTime.push(0);
        console.log("CurrentTime", CurrentTime)
        State = -1;
      } else if (index == 1) {
        CurrentTime.push(Currenttimestamp);
        console.log("CurrentTime", CurrentTime)
        State = 0;
      } else if (index == 2) {
        CurrentTime.push(Currenttimestamp);
        console.log("CurrentTime", CurrentTime)
        State = 2;
      } else {
        CurrentTime.push(Currenttimestamp);
        console.log("CurrentTime", CurrentTime)
        State = 1;
      }
      this.setData({
        CurrentStep: index,
        Time: CurrentTime
      })
      CF.UpdateMatchStatus(this.data.MatchResultId, State, CurrentTime)
      setTimeout(function () {
        wx.showToast({
          title: '修改状态成功',
        })
      }, 300)
    }
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
    var len = ChatInfo.length;
    console.log("ChatInfo,SendTime,Sender,SenderUrl,Status", ChatInfo, SendTime, Sender, SenderUrl, Status)
    for (var i = 0; i < len; i++) {
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
        "isMyself": 0,
        "IsShowTime": IsShowTime,
        "Status": Status[i]
      });
    }
    console.log("ChatRoomInfo", ChatRoomInfo)
    this.setData({
      MainChatRoomInfo: ChatRoomInfo
    })
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
  WithDrawInfo(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要撤回该消息吗',
      success(res) {
        if (res.confirm) {
          console.log(e);
          var NewChatRoom = that.data.MainChatRoomInfo
          NewChatRoom[e.currentTarget.dataset.id].Status = 0
          console.log("NewChatRoom", NewChatRoom)
          that.setData({
            MainChatRoomInfo: NewChatRoom
          })
          var NewStatus = [];
          NewChatRoom.forEach(function (item, index) {
            NewStatus.push(NewChatRoom[index].Status)
          })
          console.log("NewStatus", NewStatus)
          CF.WithDrawInfo(that.data.ChatRoomId, NewStatus)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  calculateScrollViewHeight() {
    var that = this;
    var query = wx.createSelectorQuery().in(this)
    query.select('#selectBar').boundingClientRect();
    query.select('#cuBar').boundingClientRect();
    query.exec((res) => {
      let selectBarHeight = res[0].height;
      let cuBarHeight = res[1].height;
      let statusBarHeight = this.data.statusBarHeight;
      console.log("height:", selectBarHeight, cuBarHeight, statusBarHeight)
      let scrollViewHeight = wx.getSystemInfoSync().screenHeight - selectBarHeight - statusBarHeight - 2.5 * cuBarHeight;
      console.log("scroll height:", scrollViewHeight)
      that.setData({
        scrollViewHeight: scrollViewHeight
      });
    })
  },
  BindScoreChange(e) {
    var index = e.currentTarget.dataset.index
    console.log("index",index)
    var MatchMember = this.data.MatchMember;
    var MatchMemberScore = this.data.MatchMemberScore;
    console.log("MatchMember",MatchMember)
    console.log("MatchMember[index]",MatchMember[index])
    MatchMemberScore[MatchMember[index].Index] = e.detail.value
    MatchMember[index].Score = e.detail.value
    console.log("MatchMemberScore,MatchMember",MatchMemberScore,MatchMember)
    this.setData({
      MatchMemberScore:MatchMemberScore,
      MatchMember:MatchMember
    })
  },
  SubmitScore(e){
    var index = e.currentTarget.dataset.index;
    console.log("index",index)
    var Score = this.data.MatchMember[index].Score;
    console.log("Score",Score)
    var NewScore = this.data.MatchMemberScore;
    console.log("NewScore",NewScore)
    CF.UpdateMemberScore(this.data.MatchResultId,NewScore);

  },
  GetCurrentMemberInfo(){
    var that = this;
    var CurrentMemberId = this.data.CurrentMemberId;
    var MatchMember = this.data.MatchMember;
    MatchMember.forEach(function(item,index){
      console.log("item",item)
      console.log("CurrentMemberId",CurrentMemberId)
      if(item.Info.MemberId == CurrentMemberId){
        that.setData({
          CurrentMember:item.Info
        })
      }
    })
    console.log(this.data.CurrentMember)
  }
})