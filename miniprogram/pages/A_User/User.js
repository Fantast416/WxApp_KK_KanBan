//获取应用实例
const CF = require('../../js/CloudFunction.js')
const DC = require('../../js/DistanceCalculate.js')
const app = getApp()
Page({
  data: {
    _choice1: true,
    _choice2: false,
    _choice3: false,
    _style1: "2px solid #0081ff",
    _style2: null,
    _style3: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalStatus: false,
    InputIdentifyCode: "",
    StrIdentify: 0,
    Str: "", //输入的认证码,
    TempContestId: "",
    TempContestName: "",
    TempAuthorityType: "",
    MyAdminContest: [],
    MyRefereeContest: [],
    MyLoveContest: [],
    statusBarHeight: '',
    MainBar: '',
    IsProgramAdmin: 0,
    ClipBoard: "",
    NeedAuditLen: 0
  },
  IsSearchAllContestReady() {
    var that = this;
    console.log("IsSearchAllContestReady", app.globalData.IsSearchAllContestReady)
    if (app.globalData.IsSearchAllContestReady == 0) {
      setTimeout(function () {
        that.IsSearchAllContestReady();
      }, 100)
    } else {
      app.globalData.IsSearchAllContestReady = 0;
      this.setData({
        MyAdminContest: app.globalData.MyAdminContest,
        MyRefereeContest: app.globalData.MyRefereeContest,
        MyLoveContest: app.globalData.MyLoveContest,
        NeedAuditLen: app.globalData.NeedAuditContest.length
      })
      this.CalculateContest();
    }
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    //----------UI数据获取-----------------
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
      IsProgramAdmin: app.globalData.IsProgramAdmin
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    this.CheckUserInfo();
    //----------赛事数据获取（从app中）-----------------
    this.setData({
      MyAdminContest: app.globalData.MyAdminContest,
      MyRefereeContest: app.globalData.MyRefereeContest,
      MyLoveContest: app.globalData.MyLoveContest,
      NeedAuditLen: app.globalData.NeedAuditContest.length
    })
  },
  onShow: function () {
    var that = this
    this.setData({
      MyAdminContest: app.globalData.MyAdminContest,
      MyRefereeContest: app.globalData.MyRefereeContest,
      MyLoveContest: app.globalData.MyLoveContest,
      NeedAuditLen: app.globalData.NeedAuditContest.length
    })
    this.CalculateContest();
    console.log("SetMainBar 2")
    this.selectComponent("#MainBar").setData({
      selected: 2
    })
    wx.getClipboardData({
      success: function (res) {
        var text = res.data
        if (text != that.data.ClipBoard) {
          that.setData({
            ClipBoard: text
          })
          if (text.substring(0, 7) == '管理员认证码:') {
            wx.showModal({
              title: '提示',
              content: text + '*()_^%#^%确定要认证该权限吗？',
              success(res) {
                if (res.confirm) {
                  var Str = text.substring(7, 39)
                  that.setData({
                    Str: Str
                  })
                  console.log("Str", that.data.Str);
                  that.IdentifyStr();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (text.substring(0, 6) == '裁判认证码:') {
            wx.showModal({
              title: '提示',
              content: text + '\n确定要认证该权限吗？',
              success(res) {
                if (res.confirm) {
                  var Str = text.substring(6, 38)
                  that.setData({
                    Str: Str
                  })
                  console.log("Str", that.data.Str);
                  that.IdentifyStr();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          console.log(text.substring(0, 7))
        }
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchAllContestAndClassify(app.globalData.UserId);
    CF.SearchNeedAuditContest();
    this.IsSearchAllContestReady()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  //-----------------------------用户信息检测逻辑---------------------------------------
  CheckUserInfo: function () {
    /*获取wx登录信息*/
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //console.log(app.globalData.userInfo);
  },
  //-----------------------------赛事认证逻辑----------------------------------------
  IdentifyQrcode: function () {
    var that = this;
    this.hideModal1();
    wx.scanCode({
      success: (res) => {
        var show = "结果:" + res.result
        var result;
        wx.showLoading({
          title: '认证中',
        })
        CF.Identify_Authority(res.result)
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {}
    })
  },
  IdentifyStr: function () {
    var that = this;
    wx.showLoading({
      title: '认证中',
    })
    var str = this.data.Str;
    CF.Identify_Authority(str)
    this.setData({
      Str: ""
    })
    setTimeout(function () {
      that.setData({
        MyAdminContest: app.globalData.MyAdminContest,
        MyRefereeContest: app.globalData.MyRefereeContest,
        MyLoveContest: app.globalData.MyLoveContest
      })
    }, 1000)
  },
  DeleteLoveContest(e) {
    var that = this;
    var temp = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var NewLove = this.data.MyLoveContest
    NewLove.splice(index, 1);
    this.setData({
      MyLoveContest: NewLove
    })
    CF.DeleteLoveContest(temp.ContestId, app.globalData.UserId)
  },
  //-----------------------------导航逻辑-----------------------------------------------------
  GotoAdminContest(e) {
    var item = e.currentTarget.dataset.id;
    if (item.ApprovalStatus == 1) {
      console.log(item.ContestId);
      if (item.ContestType == 'BigBall') {
        wx.navigateTo({
          url: '../Z_BigBall/ContestLevel2Admin/ContestLevel2Admin?ContestId=' + item.ContestId
        })
      } else if (item.ContestType == 'SmallBall') {
        wx.navigateTo({
          url: '../Z_SmallBall/ContestLevel2Admin/ContestLevel2Admin?ContestId=' + item.ContestId
        })
      } else if (item.ContestType == 'Singing') {
        wx.navigateTo({
          url: '../Z_SingleRanking/ContestLevel2Admin/ContestLevel2Admin?ContestId=' + item.ContestId,
        })
      }else if (item.ContestType == 'Defence') {
        wx.navigateTo({
          url: '../Z_Presentation/ContestLevel2Admin/ContestLevel2Admin?ContestId=' + item.ContestId,
        })
    }
    } else if (item.ApprovalStatus == 0) {
      wx.navigateTo({
        url: '../Y_AuditPage/AuditPage?Status=' + 0
      })
    } else {
      console.log("item.ApprovalReason", item.ApprovalReason)
      wx.navigateTo({
        url: '../Y_AuditPage/AuditPage?Status=' + 1 + '&ContestId=' + item.ContestId
      })
    }
  },
  GotoContestLevel2(e) {
    var temp = e.currentTarget.dataset.id
    console.log(temp)
    if (temp.ContestType == 'BigBall') {
      wx.navigateTo({
        url: '../Z_BigBall/ContestLevel2/ContestLevel2?ContestId=' + temp.ContestId,
      })
    } else if (temp.ContestType == 'SmallBall') {
      wx.navigateTo({
        url: '../Z_SmallBall/ContestLevel2/ContestLevel2?ContestId=' + temp.ContestId,
      })
    } else if (temp.ContestType == 'Singing') {
      wx.navigateTo({
        url: '../Z_SingleRanking/ContestLevel2/ContestLevel2?ContestId=' + temp.ContestId,
      })
    }else if (temp.ContestType == 'Defence') {
      wx.navigateTo({
        url: '../Z_Presentation/ContestLevel2/ContestLevel2?ContestId=' + temp.ContestId,
      })
  }
  },
  GotoProgramAdmin(e) {
    wx.navigateTo({
      url: '../Y_ProgramAdmin/ProgramAdmin'
    })
  },
  changeChoice1: function () {
    this.setData({
      _choice1: true,
      _choice2: false,
      _choice3: false,
      _style1: "2px solid #0081ff",
      _style2: null,
      _style3: null
    })
    console.log("_choice1,_choice2,_choice3", this.data._choice1, this.data._choice2, this.data._choice3)
  },
  changeChoice2: function () {
    this.setData({
      _choice2: true,
      _choice1: false,
      _choice3: false,
      _style2: "2px solid #0081ff",
      _style1: null,
      _style3: null
    })
    console.log("_choice1,_choice2,_choice3", this.data._choice1, this.data._choice2, this.data._choice3)
  },

  changeChoice3: function () {
    this.setData({
      _choice3: true,
      _choice1: false,
      _choice2: false,
      _style3: "2px solid #0081ff",
      _style1: null,
      _style2: null
    })
    console.log("_choice1,_choice2,_choice3", this.data._choice1, this.data._choice2, this.data._choice3)
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showModal2(e) {
    this.hideModal1();
    this.setData({
      StrIdentify: 1
    })
    console.log(this.data.Str);
  },
  hideModal1(e) {
    this.setData({
      modalName: null
    })
  },
  hideModal2(e) {
    this.setData({
      StrIdentify: 0
    })
  },
  ConfirmModal2(e) {
    console.log(e)
    this.setData({
      StrIdentify: 0,
      Str: e.detail.value.Str
    })
    console.log("Str", this.data.Str);
    this.IdentifyStr();
  },
  //-----------------------------UI数据逻辑-----------------------------------------------------
  BindChangeIndentifyStr(e) {
    this.setData({
      Str: e.detail.value
    })
    console.log("Str", this.data.Str);
  },
  CalculateContest() {
    var that = this;
    var LoveContest = this.data.LoveContest;
    var NewLoveContest = [];
    console.log(LoveContest);
    if (LoveContest != undefined) {
      LoveContest.forEach(function (item, index) {
        console.log("item", item)
        var Distance = DC.Calculate(app.globalData.latitude, app.globalData.longitude, item.Latitude, item.Longitude)
        if (Distance < 1000) {
          Distance = DC.toDecimal(Distance)
          item["Distance"] = Distance + 'm';
        } else {
          Distance = Distance / 1000;
          Distance = DC.toDecimal(Distance)
          item["Distance"] = Distance + 'km';
        }
        NewLoveContest.push(item);
      })
      console.log("NewLoveContest", NewLoveContest)
      this.setData({
        LoveContest: NewLoveContest
      })
    }
  }
})