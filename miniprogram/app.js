//app.js
/*globalData说明:
UserId:用户Id识别码
 */
var app = getApp()
const CF = require('js/CloudFunction.js')
App({
  onLaunch: function () {
    /*init wx-cloud*/
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        //env: 'incasoaogk',
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    /*Get User Openid*/
    CF.GetOpenidAndInit();
    /*Login in wx*/

    wx.getSetting({
      success: res => {
        console.log("res.authSetting",res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          console.log("22")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("22")
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  globalData: {
    UserId:"",
    userInfo:"",
    AllContest: [],
    MyAdminContest:[],
    MyRefereeContest:[],
    MyLoveContest:[],
    NeedAuditContest:[],
    ExcelData:{},
    IsProgramAdmin:0,
    IsReady:0,   //显示数据是否加载好,
    IsSearchAllContestReady:0,
    IsContestMatchReady:0,
    IsContestInfoReady:0,
    IsContestMemberReady:0,
    IsContestAuthorityNumReady:0,
    IsAccurateContessReady:0,
    IsCreateReady:0,
    IsAddContestReady:0,
    IsAddMatchReady:0,
    IsAddMemberReady:0,
    IsChatRoomReady:0,
    IsMatchReady:0,
    IsMatchSendInfoReady:0,
    IsAddTeamAMemberReady:0,
    IsAddTeamBMemberReady:0,
    IsExcelDataReady:0,
    QrFilePath:"",
    latitude:0,
    longitude:0,
    //__________________
    IsPreReady:0,
    PreIsFirst:0,
    IsBindReady:0,
    IsBindOk:0,
    IsPreLoadSearchScoreReady:0,
    IsPreLoadSearchMemberReady:0,
    IsPreGetAllScoreReady:0,
    IsAddPreScoreReady:0,
    IsPreGetAllMemberReady:0,
    IsBind:0,
    IsGetOpenidReady:0
  },
  TempData:{
    AuthorityTemp: [],
    AuthorityType:"",
    IsRepeat:false,
    UserContestTemp:[],
    ContestMatch:[],
    RefereeCode:"",
    AdministratorCode:"",
    RefereeNum:0,
    AdministratorNum:0,
    ContestInfo:{},
    IsUserContestRepeatDone:false,   //判断有无完成上一步,
    MatchInfo:{},
    MatchSendInfo:[],
    TempContestMember:[],
    ContestMemberRecordId:"",
    ChatRoom:[],
    AccurateContest:[],
    PreScore:[],
    PreMemberInfo:[],
    PreAllMember:[],
    PreAllScore:[],
    
  }
})