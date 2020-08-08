/*
本js文件
函数调用接口说明：
2020/04/27 Add_Authority(ContestID,IdentifyCode,AuthorityType);  //调用云函数AddAuthority，增加比赛认证码信息

*/
var app = getApp()

function Add_Authority(ContestId, IdentifyCode, AuthorityType) {
  console.log("Run Function Add_Authority")
  console.log("ContestId, IdentifyCode, AuthorityType", ContestId, IdentifyCode, AuthorityType)
  wx.cloud.callFunction({
    name: 'AddAuthority',
    data: {
      ContestId: ContestId,
      IdentifyCode: IdentifyCode,
      AuthorityType: AuthorityType
    },
    success: res => {
      console.log("AddAuthority_Suceess", res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Add_UserContest(UserId, ContestId, AuthorityType) {
  console.log("Run Function Add_UserContest")
  console.log("UserId, ContestId, AuthorityType", UserId, ContestId, AuthorityType)
  var app = getApp();
  var that = this;
  wx.cloud.callFunction({
    name: 'AddUserContest',
    data: {
      UserId: UserId,
      ContestId: ContestId,
      AuthorityType: AuthorityType
    },
    success: res => {
      console.log("AddUserContest_Suceess", res);
      wx.showToast({
        title: '认证成功'
      })
      that.SearchAllContestAndClassify(app.globalData.UserId)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function Add_UserContestForCreate(UserId, ContestId, AuthorityType) {
  console.log("Run Function Add_UserContestForCreat")
  console.log("UserId, ContestId, AuthorityType", UserId, ContestId, AuthorityType)
  wx.cloud.callFunction({
    name: 'AddUserContest',
    data: {
      UserId: UserId,
      ContestId: ContestId,
      AuthorityType: AuthorityType
    },
    success: res => {
      console.log("Add_UserContestForCreat_Suceess", res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Add_UserInfo(UserId) {
  console.log("Run Function Add_UserInfo")
  console.log("UserId", UserId)
  wx.cloud.callFunction({
    name: 'AddUserInfo',
    data: {
      UserId: UserId
    },
    success: res => {
      console.log("AddUserInfo_Suceess", res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function GetOpenidAndInit() {
  console.log("Run Function GetOpenid")
  var that = this;
  wx.cloud.callFunction({
    name: 'GetOpenid',
    data: {},
    success: res => {
      var app = getApp();
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.UserId = res.result.openid
      that.IsProgramAdministrator(res.result.openid)
      that.SearchAllContestAndClassify(res.result.openid);
      that.SearchNeedAuditContest();
      app.globalData.IsGetOpenidReady =1;
      return;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateContestApprovalStatus(RecordId,Status,Reason){
  console.log("Run Function UpdateContestApprovalStatus")
  console.log("RecordId,Status,Reason",RecordId,Status,Reason)
  var that = this
  var app= getApp()
  wx.cloud.callFunction({
    name: 'UpdateContestApprovalStatus',
    data: {
      RecordId:RecordId,
      Status:Status,
      Reason:Reason
    },
    success: res => {
      var app = getApp();
      console.log("UpdateContestApprovalStatus_Success", res);
      wx.showToast({
        title: '审核成功',
      })
      that.SearchAllContestAndClassify(app.globalData.UserId);
      setTimeout(function(){
        wx.navigateTo({
          url: '../Y_ProgramAdmin/ProgramAdmin',
        })
      },500)
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function IsUserContestRepeat(UserId, ContestId, AuthorityType) {
  console.log("Run Function IsUserContestRepeat")
  console.log("UserId, ContestId, AuthorityType", UserId, ContestId, AuthorityType)
  var that = this
  wx.cloud.callFunction({
    name: 'IsUserContestRepeat',
    data: {
      UserId: UserId,
      ContestId: ContestId,
      AuthorityType: AuthorityType
    },
    success: res => {
      var app = getApp();
      console.log("IsUserContestRepeat_Success", res);
      if (res.result.data.length == 0) { //没有重复
        wx.hideLoading();
        that.Add_UserContest(UserId, ContestId, AuthorityType)
      } else {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '请不要重复认证',
        })
      }
      return;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Add_Contest(ContestId, ContestName, ContestType, StartDate, EndDate, 
  FileId, ContestPlace, HoldOrganization, ContestDescription, RefereeId,
   AdministratorId,ContestTag,Longitude,Latitude,avatarUrl) {
  console.log("Run Function  Add_Contest")
  console.log("ContestId, ContestName, ContestType, StartDate,EndDate, FileId, ContestPlace, HoldOrganization, ContestDescription, RefereeId, AdministratorId,ContestTag,Longitude,Latitude,avatarUrl", ContestId, ContestName, ContestType, StartDate, EndDate, FileId, ContestPlace, HoldOrganization, ContestDescription, RefereeId, AdministratorId,ContestTag,Longitude,Latitude,avatarUrl)
  var IdentifyCode = ContestId.substr(0,6);
  console.log("IdentifyCode",IdentifyCode)
  wx.cloud.callFunction({
    name: 'AddContest',
    data: {
      ContestId: ContestId,
      ContestName: ContestName,
      ContestPlace: ContestPlace,
      ContestType: ContestType,
      StartDate: StartDate,
      EndDate: EndDate,
      FileId: FileId,
      ContestDescription: ContestDescription,
      HoldOrganization: HoldOrganization,
      RefereeId: RefereeId,
      AdministratorId: AdministratorId,
      ContestTag:ContestTag,
      Longitude:Longitude,
      Latitude:Latitude,
      avatarUrl:avatarUrl,
      Pre_IdentifyCode:IdentifyCode
    },
    success: res => {
      var app=getApp()
      console.log("AddContest_Suceess", res);
      app.globalData.IsAddContestReady = 1;
      wx.showToast({
        icon:'none',
        title: '注册成功,请耐心等待审核'
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Identify_Authority(IdentifyCode) {
  console.log("Run Function  Identify_Authority")
  console.log("IdentifyCode", IdentifyCode)
  var temp;
  var app = getApp();
  var that = this;
  wx.cloud.callFunction({
    name: 'IdentifyAuthority',
    success: res => {
      console.log("Identify_Authority Success", res);
      var len = res.result.data.length;
      var i;
      var AuthorityTemp = null
      var AuthorityType = "none";
      var flag = 0;
      for (i = 0; i < len; i++) {
        temp = res.result.data[i];
        if (temp.RefereeId == IdentifyCode) {
          console.log("temp", temp)
          AuthorityTemp = temp;
          AuthorityType = "Referee"
          flag = 1;
          break;

        }
        if (temp.AdministratorId == IdentifyCode) {
          console.log("temp", temp)
          AuthorityTemp = temp;
          AuthorityType = "Administrator"
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '请重试，无此活动',
        })
      } else {
        that.IsUserContestRepeat(app.globalData.UserId, AuthorityTemp.ContestId, AuthorityType);
      }


    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '认证失败请重试'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchUserContest(UserId) {
  console.log("Run Function SearchUserContest")
  console.log("UserId", UserId)
  wx.cloud.callFunction({
    name: 'SearchUserContest',
    data: {
      UserId: UserId
    },
    success: res => {
      var app = getApp();
      console.log("SearchUserContestSuccess", res);
      if(res.result!=null){
         app.TempData.UserContestTemp = res.result.data.reverse();
      }else{
        app.TempData.UserContestTemp = []
      }
      var i, j;
      var UserContest = app.TempData.UserContestTemp;
      var AllContest = app.globalData.AllContest;
      var alllen = AllContest.length;
      var len = UserContest.length;
      var AdminTemp = [];
      var RefereeTemp = [];
      var LoveTemp = [];
      for (i = 0; i < alllen; i++) {
        var Id = AllContest[i].ContestId
        AllContest[i]['Type'] = "NotLove";
        for (j = 0; j < len; j++) {
          if (UserContest[j].AuthorityType == "Administrator" && UserContest[j].ContestId == Id) {
            AdminTemp.push(AllContest[i]);
          } else if (UserContest[j].AuthorityType == "Referee" && UserContest[j].ContestId == Id) {
            RefereeTemp.push(AllContest[i]);
          } else if (UserContest[j].AuthorityType == "Love" && UserContest[j].ContestId == Id) {
            LoveTemp.push(AllContest[i]);
            AllContest[i]['Type'] = "Love";
          }
        }
      }
      console.log("AdminTemp, RefereeTemp, LoveTemp", AdminTemp, RefereeTemp, LoveTemp)
      app.globalData.AllContest.data = AllContest;
      app.globalData.MyAdminContest = AdminTemp,
        app.globalData.MyRefereeContest = RefereeTemp,
        app.globalData.MyLoveContest = LoveTemp
        app.globalData.IsReady = 1;
        app.globalData.IsSearchAllContestReady = 1;

    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })

}

function SearchAllContestAndClassify(UserId) { //搜索所有比赛并调用SearchuserContest进行分类
  console.log("Run Function SearchAllContestAndClassify")
  var result;
  var that = this;
  var app = getApp();
  wx.cloud.callFunction({
    name: 'SearchAllContest',
    success: res => {
      console.log("SearchAllContestAndClassify_Success", res);
      app.globalData.AllContest = res.result.data.reverse();
      that.SearchUserContest(UserId);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function SearchNeedAuditContest() { //搜索所有比赛并调用SearchuserContest进行分类
  console.log("Run Function SearchNeedAuditContest")
  var result;
  var that = this;
  var app = getApp();
  wx.cloud.callFunction({
    name: 'SearchNeedAuditContest',
    success: res => {
      console.log("SearchNeedAuditContest_Success", res);
      app.globalData.NeedAuditContest = res.result.data.reverse();
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Add_MatchInfo(ContestId, MatchId, MatchName,MatchPlace, TeamAName, TeamBName) {
  console.log("Run Function Add_MatchInfo")
  console.log("ContestId, MatchId,  MatchName,MatchPlace, TeamAName, TeamBName", ContestId, MatchId, MatchName, MatchPlace, TeamAName, TeamBName)
  var that = this;
  wx.cloud.callFunction({
    name: 'AddMatch',
    data: {
      ContestId: ContestId,
      MatchId: MatchId,
      MatchName:MatchName,
      MatchPlace: MatchPlace,
      TeamAName: TeamAName,
      TeamBName: TeamBName
    },
    success: res => {
      var app=getApp()
      console.log("Add_MatchInfo_Suceess", res);
      that.Add_MatchChatRoom(MatchId);
      app.globalData.IsAddMatchReady = 1
      wx.showToast({
        title: '添加比赛成功'
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function Add_MatchChatRoom(MatchId) {
  console.log("Run Function Add_MatchChatRoom")
  console.log("MatchId", MatchId)
  wx.cloud.callFunction({
    name: 'AddNewMatchChatRoom',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("Add_MatchChatRoom_Suceess", res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchContestMatch(ContestId) {
  console.log("Run Function SearchContestMatch")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  wx.cloud.callFunction({
    name: 'SearchContest_Match',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("SearchContest_Match_Success", res);
      app.TempData.ContestMatch = res.result.data.reverse();
      app.globalData.IsContestMatchReady = 1
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchContestAuthorityCode(ContestId) {
  console.log("Run Function SearchContestAuthorityCode")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  wx.cloud.callFunction({
    name: 'SearchContestAuthorityCode',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("SearchContestAuthorityCode Success", res);
      var i = 0;
      for (i = 0; i < 2; i++) {
        if (res.result.data[i].AuthorityType == "Referee") {
          app.TempData.RefereeCode = res.result.data[i].IdentifyCode
        } else {
          app.TempData.AdministratorCode = res.result.data[i].IdentifyCode
        }
      }
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchContestAuthorityNum(ContestId) {
  console.log("Run Function SearchContestAuthorityNum")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  wx.cloud.callFunction({
    name: 'SearchContestAuthorityNum',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("SearchContestAuthorityNum_Success", res);
      var RefereeNum = 0
      var AdministratorNum = 0
      var len = res.result.data.length
      var i = 0;
      for (i = 0; i < len; i++) {
        if (res.result.data[i].AuthorityType == "Referee") {
          RefereeNum++;
        } else {
          AdministratorNum++;
        }
      }
      app.TempData.RefereeNum = RefereeNum;
      app.TempData.AdministratorNum = AdministratorNum;
      app.globalData.IsContestAuthorityNumReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchContestInfo(ContestId) {
  console.log("Run Function SearchContestInfo")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  wx.cloud.callFunction({
    name: 'SearchContestInfo',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("SearchContestInfo", res);
      app.TempData.ContestInfo = res.result.data[0];
      app.globalData.IsContestInfoReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function AddLoveContest(ContestId, UserId) {
  console.log("Run Function AddLoveContest")
  console.log("ContestId, UserId", ContestId, UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'AddLoveContest',
    data: {
      ContestId: ContestId,
      UserId: UserId
    },
    success: res => {
      console.log("AddLoveContestSuccess", res);
      wx.showToast({
        title: '收藏成功',
      })
      that.SearchAllContestAndClassify(app.globalData.UserId);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.showToast({
        icon:'none',
        title: '失败请检查网络',
      })
    }
  })
}

function DeleteLoveContest(ContestId, UserId) {
  console.log("Run Function DeleteLoveContest")
  console.log("ContestId, UserId", ContestId, UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'DeleteLoveContest',
    data: {
      ContestId: ContestId,
      UserId: UserId
    },
    success: res => {
      console.log("DeleteLoveContestSuccess", res);
      that.SearchAllContestAndClassify(app.globalData.UserId);
      wx.showToast({
        title: '取消收藏成功',
      })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.showToast({
        icon:'none',
        title: '失败请检查网络',
      })
    }
  })
}

function DeleteMatch(ContestId, MatchId) {
  console.log("Run Function DeleteMatch")
  console.log("ContestId, MatchId", ContestId, MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'DeleteMatch',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("DeleteMatchSuccess", res);
      wx.showToast({
        title: '删除比赛成功',
      })
      that.SearchContestMatch(ContestId);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchMatch(MatchId) {
  console.log("Run Function SearchMatch")
  console.log("MatchId", MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchMatch',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("SearchMatchSuccess", res);
      app.TempData.MatchInfo = res.result.data;
      app.globalData.IsMatchReady=1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function AddNewInformation(MatchId, NewInformation, SendTime) {
  console.log("Run Function AddNewInformation")
  console.log("MatchId, NewInformation, SendTime", MatchId, NewInformation, SendTime)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'AddNewInformation',
    data: {
      MatchId: MatchId,
      NewInformation: NewInformation,
      SendTime: SendTime
    },
    success: res => {
      console.log("AddNewInformationSuccess", res);
      wx.showToast({
        title: '消息发送成功',
      })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchMatch_Information(MatchId) {
  console.log("Run Function SearchMatch_Information")
  console.log("MatchId", MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchMatch_Information',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("SearchMatchInformationSuccess", res);
      if(res.result.data.length !=0){
        app.TempData.MatchSendInfo = res.result.data.reverse()
      }else{
        app.TempData.MatchSendInfo = [];
      }
      app.globalData.IsMatchSendInfoReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function MainAddContestMember(ContestId, MemberName,MemberDescription, MemberTag, MemberId) {
  console.log("Run Function MainAddContestMember")
  console.log("ContestId, MemberName, MemberDescription,MemberTag, MemberId", ContestId, MemberName,MemberDescription, MemberTag, MemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchContestMember',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("MainAddContestMember_Step1_Success", res);
      if (res.result.data.length == 0) { //如果是本场比赛的添加的第一个参赛选手 
        that.AddFirstContestMember(ContestId, MemberName, MemberDescription,MemberTag, MemberId);
      } else {
        that.UpdateContestMember(res.result.data[0], res.result.data[0]._id, MemberName, MemberDescription,MemberTag, MemberId);
      }
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchContestMember(ContestId, MemberName, MemberTag) {
  console.log("Run Function SearchContestMember")
  console.log("ContestId, MemberName, MemberTag", ContestId, MemberName, MemberTag)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchContestMember',
    data: {
      ContestId: ContestId
    },
    success: res => {
      console.log("SearchContestMemberSuccess", res);
      if (res.result.data.length != 0) {
        var len = res.result.data[0].MemberId.length
        var AllMemberId = res.result.data[0].MemberId
        var AllMemberName = res.result.data[0].MemberName
        var AllMemberTag = res.result.data[0].MemberTag
        var AllMemberDes = res.result.data[0].MemberDescription
        var MemberInfo = []
        for (var i = 0; i < len; i++) {
          MemberInfo.push({
            "MemberId": AllMemberId[i],
            "MemberName": AllMemberName[i],
            "MemberTag": AllMemberTag[i],
            "MemberDescription":AllMemberDes[i]
          });
        }
        app.TempData.ContestMemberRecordId = res.result.data[0]._id
      }
      app.TempData.TempContestMember = MemberInfo
      app.globalData.IsContestMemberReady=1;
      
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function AddFirstContestMember(ContestId, MemberName, MemberDescription,MemberTag, MemberId) {
  console.log("Run Function AddFirstContestMember")
  console.log("ContestId, MemberName, MemberTag,MemberId", ContestId, MemberName,MemberDescription, MemberTag, MemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'AddFirstContestMember',
    data: {
      ContestId: ContestId,
      MemberDescription:[MemberDescription],
      MemberName: [MemberName],
      MemberTag: [MemberTag],
      MemberId: [MemberId]
    },
    success: res => {
      console.log("AddFirstContestMemberSuccess", res);
      var app=getApp();
      app.globalData.IsAddMemberReady =1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateContestMember(SearchRes, RecordId, MemberName, MemberDescription,MemberTag, MemberId) {
  console.log("Run Function UpdateContestMember")
  console.log("SearchRes, RecordId, MemberName, MemberTag, MemberId", SearchRes, RecordId, MemberName,MemberDescription, MemberTag, MemberId)
  var result;
  var app = getApp()
  var that = this;
  console.log("SearchRes", SearchRes)
  var SearchResName = SearchRes.MemberName;
  var SearchResTag = SearchRes.MemberTag;
  var SearchResId = SearchRes.MemberId;
  var SearchResDes = SearchRes.MemberDescription;
  SearchResName.push(MemberName);
  SearchResTag.push(MemberTag);
  SearchResId.push(MemberId);
  SearchResDes.push(MemberDescription)
  wx.cloud.callFunction({
    name: 'UpdateContestMember',
    data: {
      RecordId: RecordId,
      MemberId: SearchResId,
      MemberName: SearchResName,
      MemberDescription:SearchResDes,
      MemberTag: SearchResTag
    },
    success: res => {
      console.log("UpdateContestMemberSuccess", res);
      var app=getApp();
      app.globalData.IsAddMemberReady =1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function DeleteContestMember(RecordId, MemberName, MemberTag, MemberId) {
  console.log("Run Function DeleteContestMember")
  console.log("RecordId,MemberName, MemberTag, MemberId", RecordId, MemberName, MemberTag, MemberId)
  var result;
  var app = getApp()
  var that = this;
  console.log("RecordId,MemberName, MemberTag, MemberId", RecordId, MemberName, MemberTag, MemberId)
  wx.cloud.callFunction({
    name: 'UpdateContestMember',
    data: {
      RecordId: RecordId,
      MemberId: MemberId,
      MemberName: MemberName,
      MemberTag: MemberTag
    },
    success: res => {
      console.log("DeleteContestMemberSuccess", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateCurrentMemberId(RecordId, CurrentMemberId){
  console.log("Run Function UpdateCurrentMemberId")
  console.log("RecordId, MemberId", RecordId, CurrentMemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateCurrentMemberId',
    data: {
      RecordId: RecordId,
      CurrentMemberId: CurrentMemberId,
    },
    success: res => {
      console.log(" UpdateCurrentMemberIdSuccess", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateMemberScore(RecordId, NewScore){
  console.log("Run Function UpdateMemberScore")
  console.log("RecordId, NewScore", RecordId, NewScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMemberScore',
    data: {
      RecordId: RecordId,
      MemberScore: NewScore
    },
    success: res => {
      console.log(" UpdateMatchMemberSuccess", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateMatchMember(RecordId, MemberId,MemberScore){
  console.log("Run Function UpdateMatchMember")
  console.log("RecordId, MemberId", RecordId, MemberId,MemberScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMatchMember',
    data: {
      RecordId: RecordId,
      MemberId: MemberId,
      MemberScore:MemberScore
    },
    success: res => {
      console.log(" UpdateMatchMemberSuccess", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateTeamAMember(RecordId, TeamAMemberId) {
  console.log("Run Function UpdateTeamAMember")
  console.log("RecordId, TeamAMemberId", RecordId, TeamAMemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMatchInfoTeamA',
    data: {
      RecordId: RecordId,
      TeamAMemberId: TeamAMemberId
    },
    success: res => {
      console.log("UpdateTeamAMemberSuccess", res);
      app.globalData.IsAddTeamAMemberReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateTeamBMember(RecordId, TeamBMemberId) {
  console.log("Run Function UpdateTeamBMember")
  console.log("RecordId, TeamBMemberId", RecordId, TeamBMemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMatchInfoTeamB',
    data: {
      RecordId: RecordId,
      TeamBMemberId: TeamBMemberId
    },
    success: res => {
      console.log("UpdateTeamBMember Success", res);
      app.globalData.IsAddTeambBMemberReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateTeamBScore(RecordId, TeamBScore,TeamBSmallScore) {
  console.log("Run Function UpdateTeamBScore")
  console.log("RecordId, TeamBScore,TeamBSmallScore", RecordId, TeamBScore,TeamBSmallScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateTeamBScore',
    data: {
      RecordId: RecordId,
      TeamBScore: TeamBScore,
      TeamBSmallScore:TeamBSmallScore
    },
    success: res => {
      console.log("UpdateTeamBScore Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateSmallBallTeamACurrentScore(RecordId,TeamACurrentSmallScore) {
  console.log("Run Function UpdateSmallBallTeamaCurrentScore")
  console.log("RecordId, TeamaCurrentSmallScore", RecordId, TeamACurrentSmallScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateSmallBallTeamACurrentScore',
    data: {
      RecordId: RecordId,
      TeamACurrentSmallScore:TeamACurrentSmallScore
    },
    success: res => {
      console.log("UpdateSmallBallTeamACurrentScore Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateSmallBallTeamBCurrentScore(RecordId,TeamBCurrentSmallScore) {
  console.log("Run Function updateSmallBallTeamBCurrentScore")
  console.log("RecordId, TeamBCurrentSmallScore", RecordId, TeamBCurrentSmallScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateSmallBallTeamBCurrentScore',
    data: {
      RecordId: RecordId,
      TeamBCurrentSmallScore:TeamBCurrentSmallScore
    },
    success: res => {
      console.log("UpdateSmallBallTeamBCurrentScore Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateTeamAScore(RecordId, TeamAScore,TeamASmallScore) {
  console.log("Run Function UpdateTeamAScore")
  console.log("RecordId, TeamAScore", RecordId, TeamAScore,TeamASmallScore)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateTeamAScore',
    data: {
      RecordId: RecordId,
      TeamAScore: TeamAScore,
      TeamASmallScore:TeamASmallScore
    },
    success: res => {
      console.log("UpdateTeamAScore Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateTeamASupport(RecordId, TeamASupport) {
  console.log("Run Function UpdateTeamASupport")
  console.log("RecordId, TeamASupport", RecordId, TeamASupport)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateTeamASupport',
    data: {
      RecordId: RecordId,
      TeamASupport: TeamASupport
    },
    success: res => {
      console.log("UpdateTeamASupport_Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateMatchStatus(RecordId, Status,CurrentTime) {
  console.log("Run Function UpdateMatchStatus")
  console.log("RecordId, Status,CurrentTime", RecordId, Status,CurrentTime)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMatchStatus',
    data: {
      RecordId: RecordId,
      Status:Status,
      Time:CurrentTime
    },
    success: res => {
      console.log("UpdateMatchStatus", res);
      app.globalData.IsUpdateMatchStatusReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchChatRoom(MatchId) {
  console.log("Run Function SearchChatRoom")
  console.log("MatchId", MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchChatRoom',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("SearchChatRoom_Success", res);
      app.TempData.ChatRoom = res.result.data;
      app.globalData.IsChatRoomReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SendChatRoomInfo(ResultId, MatchId, SendName, SendPicture, SendTime, SendInfo) {
  console.log("Run Function SendChatRoomInfo")
  console.log("ResultId,MatchId,SendName,SendPicture,SendTime,SendInfo", ResultId, MatchId, SendName, SendPicture, SendTime, SendInfo)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchChatRoom',
    data: {
      MatchId: MatchId
    },
    success: res => {
      console.log("SearchChatRoom_Success", res);
      that.UpdateChatRoom(res, ResultId, SendName, SendPicture, SendTime, SendInfo, MatchId)

    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateChatRoom(Res, RecordId, SendName, SendPicture, SendTime, SendInfo, MatchId) {
  console.log("Run Function UpdateChatRoom")
  console.log("Res, RecordId, SendName, SendPicture, SendTime, SendInfo", Res, RecordId, SendName, SendPicture, SendTime, SendInfo)
  var result;
  var app = getApp()
  var that = this;
  var ChatRoom = Res.result.data[0];
  var ChatInfo = ChatRoom.ChatInfo;
  var SenderTime = ChatRoom.SendTime;
  var Sender = ChatRoom.Sender;
  var SenderUrl = ChatRoom.SenderUrl;
  var Status = ChatRoom.Status
  ChatInfo.push(SendInfo);
  SenderTime.push(SendTime);
  Sender.push(SendName);
  SenderUrl.push(SendPicture);
  Status.push(1);
  wx.cloud.callFunction({
    name: 'UpdateChatRoom',
    data: {
      RecordId: RecordId,
      ChatInfo: ChatInfo, //发送消息
      Sender: Sender, //发送人Name
      SendTime: SenderTime, //发送时间
      SenderUrl: SenderUrl, //发送人头像
      Status:Status //消息是否被撤回
    },
    success: res => {
      console.log("UpdateChatRoom_Success", res);
      that.SearchChatRoom(MatchId);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateTeamBSupport(RecordId, TeamBSupport) {
  console.log("Run Function UpdateTeamBSupport")
  console.log("RecordId, TeamBSupport", RecordId, TeamBSupport)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateTeamBSupport',
    data: {
      RecordId: RecordId,
      TeamBSupport: TeamBSupport
    },
    success: res => {
      console.log("UpdateTeamBSupport_Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchAccurateContest(ContestName) {
  console.log("Run Function SearchAccurateContest")
  console.log("ContestName", ContestName)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchAccurateContest',
    data: {
      ContestName: ContestName
    },
    success: res => {
      console.log("SearchAccurateContest", res);
      app.TempData.AccurateContest = res.result.data.reverse()
      app.globalData.IsAccurateContessReady = 1
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function DeleteImage(FileId) {
  console.log("Run Function DeleteImage")
  console.log("FileId", FileId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'DeleteFileDirectory',
    data: {
      FileId: FileId
    },
    success: res => {
      console.log("DeleteImage_Succcess", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateContestPic(RecordId, FileId) {
  console.log("Run Function UpdateContestPic")
  console.log("FileId", FileId)
  var result;
  wx.showLoading({
    title: '上传中...',
  })
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateContestPic',
    data: {
      RecordId: RecordId,
      FileId: FileId,
    },
    success: res => {
      console.log("UpdateContestPic_Success", res);
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
      })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UploadImageFiles(FilePaths, ContestId) {
  console.log("Run Function UploadImageFiles")
  var UploadFileId = [];
  for(var i = 0; i < FilePaths.length; i++){
    UploadFileId.push("");
  }
  wx.showLoading({
    title: '上传中...',
  })
  var count = 0;
  var that = this;
  FilePaths.forEach(function (value, index) {
    var filePath = value;
    var cloudPath = ContestId + '/image' + index + filePath.match(/\.[^.]+?$/);
    console.log("cloudPath", cloudPath)
    console.log("filePath", filePath)
    wx.getFileSystemManager().readFile({
      filePath: filePath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        wx.cloud.callFunction({
          name: 'UploadImageFiles',
          data: {
            cloudPath: cloudPath,
            filePath: res.data
          },
          success: res => {
            console.log("UploadImageFiles_Success", res);
            console.log(res.result.fileID)
            UploadFileId[index] = res.result.fileID;
            count++;
            console.log(count, FilePaths.length)
            if(count == FilePaths.length){
              wx.hideLoading();
              wx.showToast({
                title: '更新成功',
              })
              console.log("UploadFileId: ", UploadFileId);
              UpdateContestPic(ContestId, UploadFileId);
            }
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    })
  })
}

function UpdateContestInfo(RecordId, ContestName, ContestPlace, StartDate, EndDate, ContestDescription, HoldOrganization,ContestTag) {
  console.log("Run Function UpdateContestInfo")
  console.log("RecordId, ContestName,ContestPlace,StartDate,EndDate,ContestDescription,HoldOrganization", RecordId, ContestName, ContestPlace, StartDate, EndDate, ContestDescription, HoldOrganization,ContestTag)
  var result;
  wx.showLoading({
    title: '上传中...',
  })
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateContestInfo',
    data: {
      RecordId: RecordId,
      ContestName: ContestName,
      ContestPlace: ContestPlace,
      StartDate: StartDate,
      EndDate: EndDate,
      ContestDescription: ContestDescription,
      HoldOrganization: HoldOrganization,
      ContestTag:ContestTag
    },
    success: res => {
      console.log("UpdateContestInfo", res); 
      that.SearchAllContestAndClassify(app.globalData.UserId)
      setTimeout(function(){
        wx.hideLoading();
        wx.showToast({
          icon:'none',
          title: '更新成功,请耐心等待审核',
        })       
        wx.switchTab({
          url: '../../User/User',
        })
      },1000)
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function MainAddScanNumber(RecordId){
  console.log("Run Function MainAddScanNumber")
  console.log("RecordId", RecordId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'SearchScanNumber',
    data: {
      RecordId: RecordId
    },
    success: res => {
      console.log("MainAddScanNumber_Success", res);
      var Num = res.result.data.ScanNum;
      Num++;
      that.UpdateScanNumber(RecordId,Num);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function UpdateScanNumber(RecordId,Num){
  console.log("Run Function UpdateScanNumber")
  console.log("RecordId", RecordId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateScanNum',
    data: {
      RecordId: RecordId,
      ScanNum:Num
    },
    success: res => {
      console.log("UpdateScanNumber_Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function IsProgramAdministrator(OpenId){
  console.log("Run Function IsProgramAdministrator")
  console.log("OpenId", OpenId)
  var AdminId = ["oEsQO5DS_YCV2qZk2_NQyoXfLStM"]; //沈吕 入需新增修改此数组即可
  var len = AdminId.length;
  var app= getApp();
  for(var i=0;i<len;i++){
    if(OpenId == AdminId[i]){
      app.globalData.IsProgramAdmin = 1;
      break;
    }
  }
}

function WithDrawInfo(RecordId, Status) {
  console.log("Run Function WithDrawInfo")
  console.log("RecordId, Status", RecordId, Status)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'WithDrawInfo',
    data: {
      RecordId: RecordId,
      Status:Status //消息是否被撤回
    },
    success: res => {
      console.log("WithDrawInfo_Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateMatchReferee(RecordId, RefereeId,RefereeName) {
  console.log("Run Function UpdateMatchReferee")
  console.log("RecordId, RefereeId, RefereeName", RecordId, RefereeId, RefereeName)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateMatchReferee',
    data: {
      RecordId:RecordId,
      RefereeId:RefereeId, 
      RefereeName:RefereeName
    },
    success: res => {
      console.log("UpdateMatchReferee_Success", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function GetContestQrCode(ContestId,ContestType) {
  console.log("Run Function GetContestQrCode")
  console.log("ContestId", ContestId,ContestType)
  var result;
  var app = getApp()
  var that = this;
  var Type = ""
  if(ContestType=='BigBall'){
    Type = 'Z_BigBall';
  }else if(ContestType=='SmallBall'){
    Type = 'Z_SmallBall';
  }else if(ContestType=='Singing'){
    Type = 'Z_SingleRanking';
  }else if(ContestType=='Defence'){
    Type = 'Z_Presentation';
  }
  wx.cloud.callFunction({
    name: 'GetContestQrCode',
    data: {
      ContestId:ContestId,
      type:Type
    },
    success: res => {
      console.log("GetContestQrCode_Success", res);
      app.globalData.QrFilePath = res.result.fileID
      
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function AddEmptyContestMember(ContestId) {
  console.log("Run Function AddEmptyContestMember")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'AddEmptyContestMember',
    data: {
      ContestId:ContestId
    },
    success: res => {
      console.log("AddEmptyContestMember_Success", res); 
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
module.exports = {
  Add_Authority: Add_Authority,
  Add_UserContestForCreate:Add_UserContestForCreate,
  GetOpenidAndInit:GetOpenidAndInit,
  Add_UserContest: Add_UserContest,
  Add_UserInfo: Add_UserInfo,
  Add_Contest: Add_Contest,
  Identify_Authority: Identify_Authority,
  IsUserContestRepeat: IsUserContestRepeat,
  SearchUserContest: SearchUserContest,
  SearchAllContestAndClassify: SearchAllContestAndClassify,
  Add_MatchInfo: Add_MatchInfo,
  SearchContestMatch: SearchContestMatch,
  SearchContestAuthorityCode: SearchContestAuthorityCode,
  SearchContestAuthorityNum: SearchContestAuthorityNum,
  SearchContestInfo: SearchContestInfo,
  AddLoveContest: AddLoveContest,
  DeleteLoveContest: DeleteLoveContest,
  DeleteMatch: DeleteMatch,
  SearchMatch: SearchMatch,
  AddNewInformation: AddNewInformation,
  SearchMatch_Information: SearchMatch_Information,
  SearchContestMember: SearchContestMember,
  MainAddContestMember: MainAddContestMember,
  UpdateContestMember: UpdateContestMember,
  AddFirstContestMember: AddFirstContestMember,
  DeleteContestMember: DeleteContestMember,
  UpdateTeamAMember: UpdateTeamAMember,
  UpdateTeamBMember: UpdateTeamBMember,
  UpdateTeamAScore: UpdateTeamAScore,
  UpdateTeamBScore: UpdateTeamBScore,
  UpdateTeamBSupport: UpdateTeamBSupport,
  UpdateTeamASupport: UpdateTeamASupport,
  Add_MatchChatRoom: Add_MatchChatRoom,
  SearchChatRoom: SearchChatRoom,
  UpdateChatRoom: UpdateChatRoom,
  SendChatRoomInfo: SendChatRoomInfo,
  SearchAccurateContest: SearchAccurateContest,
  DeleteImage: DeleteImage,
  UpdateContestInfo: UpdateContestInfo,
  IsProgramAdministrator: IsProgramAdministrator,
  UpdateMatchStatus:UpdateMatchStatus,
  WithDrawInfo: WithDrawInfo,
  UpdateMatchReferee:UpdateMatchReferee,
  UpdateContestPic: UpdateContestPic,
  UploadImageFiles: UploadImageFiles,
  GetContestQrCode:GetContestQrCode,
  SearchNeedAuditContest:SearchNeedAuditContest,
  UpdateContestApprovalStatus:UpdateContestApprovalStatus,
  UpdateSmallBallTeamACurrentScore:UpdateSmallBallTeamACurrentScore,
  UpdateSmallBallTeamBCurrentScore:UpdateSmallBallTeamBCurrentScore,
  UpdateMatchMember:UpdateMatchMember,
  UpdateCurrentMemberId:UpdateCurrentMemberId,
  UpdateMemberScore: UpdateMemberScore,
  AddEmptyContestMember:AddEmptyContestMember,
  MainAddScanNumber:MainAddScanNumber,
  UpdateScanNumber:UpdateScanNumber
}