// miniprogram/pages/ContestLevel2Admin/ContestLevel2Admin.js
const CF = require('../../../js/CloudFunction.js')
const EF = require('../../../js/ExcelFunction.js');
const md5 = require('../../../js/md5.js');
var QR = require("../../../js/newqrcode.js");
import pinyin from "wl-pinyin"
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ContestId: "",
    MatchId: "",
    FileId: [],
    NewFileId: [],
    ContestName: "",
    ContestType: "",
    ContestStartDate: "",
    ContestEndDate: "",
    ContestPlace: "",
    ContestDescription: "",
    AddLevel2: 0,
    MatchPlace: "",
    MatchName: "",
    TeamAName: "",
    TeamBName: "",
    MatchInfo: [],
    RefereeCode: "",
    AdministratorCode: "",
    RefreeNum: 0,
    AdministratorNum: 0,
    ContestMember: [],
    AddMember: 0,
    MemberName: "",
    MemberTag: "",
    MemberId: "",
    ContestMemberRecordId: "",
    ContestRecordId: "",
    statusBarHeight: '',
    selection: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    listCur: '',
    list: [],
    Index: [],
    SearchName: '',
    MemberHidden: true,
    create: false,
    create2: false,
    temp: '',
    Authority: "Referee",
    RefereePath: '',
    AdminPath: '',
    src: "",
    ContestTag: [],
    NewContestTag: "",
    loadModal:true
  },
  MergeTag() {
    var ConestTag = this.data.ContestTag
    var NewContestTag = "";
    ContestTag.forEach(function (item, index) {
      NewContestTag = NewContestTag + item + ','
    })
    console.log("NewContestTag", NewContestTag);
    this.setData({
      NewContestTag: NewContestTag
    })
  },
  SplitTag() {
    var Tag = this.data.NewContestTag;
    var Len = Tag.length;
    console.log(Tag, Len)
    var flag = 0; //判定用户用的是中文， 还是英文,
    for (var i = 0; i < Len; i++) { //flag==1 用户用的英文逗号
      if (Tag[i] == ',') {
        flag = 1;
        break;
      }
    }
    
    var NewTag = []
    if (Tag!="") {
      if (flag == 1) {
        NewTag = Tag.split(",")
      } else {
        NewTag = Tag.split("，")
      }
      console.log(NewTag, Len, flag)
      this.setData({
        NewContestTag: NewTag
      })
    }
  },
  createQrCode: function (url, canvasId, cavW, cavH, type) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);

    console.log("url, canvasId, cavW, cavH,type", url, canvasId, cavW, cavH, type)
    setTimeout(() => {
      this.canvasToTempImage(canvasId, type);
    }, 300);
  },

  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function (canvas, type) {
    var that = this;
    console.log("canvas,type", canvas, type)
    wx.canvasToTempFilePath({
      canvasId: canvas,
      height: 500,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        if (type == "Referee") {
          that.setData({
            RefereePath: tempFilePath //存入data中
          })
        } else {
          that.setData({
            AdminPath: tempFilePath //存入data中
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  //调用button事件绘制二维码
  nextstep: function (type, canvas, url) {
    //绘制二维码
    console.log("in nextstep")
    this.createQrCode(url, canvas, 150, 150, type); //绘制位置与view绑定
  },
  //=================================上面为测试===================================
  IsReady() {
    var that = this;
    console.log("app.globalData.IsContestMatchReady,app.globalData.IsContestInfoReady,app.globalData.IsContestMemberReady,app.globalData.IsContestAuthorityNumReady", app.globalData.IsContestMatchReady, app.globalData.IsContestInfoReady, app.globalData.IsContestMemberReady, app.globalData.IsContestAuthorityNumReady)
    if (app.globalData.IsContestMatchReady == 0 || app.globalData.IsContestInfoReady == 0 || app.globalData.IsContestMemberReady == 0 || app.globalData.IsContestAuthorityNumReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      app.globalData.IsContestMatchReady = 0;
      app.globalData.IsContestInfoReady = 0;
      app.globalData.IsContestMemberReady = 0;
      app.globalData.IsContestAuthorityNumReady = 0;
      var ContestInfo = app.TempData.ContestInfo
      var AdminContest = app.globalData.MyAdminContest
      var AdminContestLen = AdminContest.length;
      var Authority = "Referee";
      for (var i = 0; i < AdminContestLen; i++) {
        if (this.data.ContestId == AdminContest[i].ContestId) {
          Authority = "Admin";
          break;
        }
      }
      console.log("Authority", Authority)
      console.log("ContestInfo", ContestInfo)
      this.setData({
        loadModal:false,
        Authority: Authority,
        ContestRecordId: ContestInfo._id,
        MatchInfo: app.TempData.ContestMatch,
        RefereeCode: ContestInfo.RefereeId,
        AdministratorCode: ContestInfo.AdministratorId,
        RefereeNum: app.TempData.RefereeNum,
        AdministratorNum: app.TempData.AdministratorNum,
        ContestName: ContestInfo.ContestName,
        ContestPlace: ContestInfo.ContestPlace,
        StartDate: ContestInfo.StartDate,
        EndDate: ContestInfo.EndDate,
        FileId: ContestInfo.FileId,
        NewFileId: [],
        ContestType: ContestInfo.ContestType,
        HoldOrganization: ContestInfo.HoldOrganization,
        ContestDescription: ContestInfo.ContestDescription,
        ContestTag: ContestInfo.ContestTag
      })
      this.SplitTag();
      var src = "cloud://wxice-saksi.7778-wxice-saksi-1302267479/" + this.data.ContestId + "/qrcode.jpg";
      this.setData({
        src: src
      })
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
    this.setData({
      ContestId: options.ContestId
    })
    //********************设置UI数据******************* */
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    CF.SearchContestMatch(this.data.ContestId);
    CF.SearchContestAuthorityNum(this.data.ContestId);
    CF.SearchContestInfo(this.data.ContestId);
    CF.SearchContestMember(this.data.ContestId)
    this.IsReady();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    /*
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    */
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //设置渲染
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
    var that = this;
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
    console.log("onPullDownRefresh Start")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchContestMatch(this.data.ContestId);
    CF.SearchContestAuthorityNum(this.data.ContestId);
    CF.SearchContestInfo(this.data.ContestId);
    CF.SearchContestMember(this.data.ContestId)
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
  //******************************************************比赛管理逻辑*******************************************************/
  //******************************************************比赛管理逻辑*******************************************************/
  //******************************************************比赛管理逻辑*******************************************************/
  //******************************************************比赛管理逻辑*******************************************************/
  //******************************************************比赛管理逻辑*******************************************************/
  //******************************************************比赛管理逻辑*******************************************************/
  showModal(e) {
    this.setData({
      AddLevel2: 1
    })
    console.log(this.data.Str);
  },
  hideModal(e) {
    this.setData({
      AddLevel2: 0
    })
  },
  BindChangeMatchPlace(e) {
    this.setData({
      MatchPlace: e.detail.value
    })
  },
  BindChangeTeamAName(e) {
    this.setData({
      TeamAName: e.detail.value
    })
  },
  BindChangeTeamBName(e) {
    this.setData({
      TeamBName: e.detail.value
    })
  },
  BindChangeMatchName(e) {
    this.setData({
      MatchName: e.detail.value
    })
  },
  CheckMatchName() {
    if (this.data.MatchName == "") {
      wx.showToast({
        title: "你还未填写比赛名称",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  CheckTeamAName() {
    if (this.data.TeamAName == "") {
      wx.showToast({
        title: "你还未填写TeamA",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  CheckTeamBName() {
    if (this.data.TeamBName == "") {
      wx.showToast({
        title: "你还未填写TeamB",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  CheckMatchPlace() {
    if (this.data.MatchPlace == "") {
      wx.showToast({
        title: "你还未填写比赛场地",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  IsAddMatchReady() {
    var that = this;
    console.log("app.globalData.IsAddMatchReady", app.globalData.IsAddMatchReady);
    if (app.globalData.IsAddMatchReady == 0) {
      setTimeout(function () {
        that.IsAddMatchReady();
      }, 100)
    } else {
      app.globalData.IsAddMatchReady = 0;
      CF.SearchContestMatch(that.data.ContestId);
      this.IsSearchMatchReady();
    }
  },
  IsSearchMatchReady() {
    var that = this;
    console.log("app.globalData.IsContestMatchReady", app.globalData.IsContestMatchReady);
    if (app.globalData.IsContestMatchReady == 0) {
      setTimeout(function () {
        that.IsSearchMatchReady();
      }, 100)
    } else {
      app.globalData.IsContestMatchReady = 0;
      that.setData({
        MatchInfo: app.TempData.ContestMatch,
        MatchId: "",
        TeamAName: "",
        TeamBName: "",
        MatchName: "",
        MatchPlace: ""
      })
    }
  },
  ConfirmAdd(e) {
    var that = this;
    if (this.CheckMatchPlace() && this.CheckTeamBName() && this.CheckTeamAName() && this.CheckMatchName()) {
      this.setData({
        AddLevel2: 0
      })
      this.CreateMatchID();
      CF.Add_MatchInfo(this.data.ContestId, this.data.MatchId, this.data.MatchName, this.data.MatchPlace, this.data.TeamAName, this.data.TeamBName)
      this.IsAddMatchReady();
    }
  },
  DeleteMatch(e) {
    var MatchId = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this;
    console.log(e);
    CF.DeleteMatch(this.data.ContestId, MatchId);
    var NewMatchInfo = this.data.MatchInfo;
    NewMatchInfo.splice(index, 1);
    this.setData({
      MatchInfo: NewMatchInfo
    })
  },
  CreateMatchID() { //通过name生成id值
    console.log("this.data.MatchInfo", this.data.MatchInfo)
    var rand;
    if (this.data.MatchInfo == undefined) {
      rand = 0;
    } else {
      rand = this.data.MatchInfo.length
    }
    var str1 = this.data.ContestId + this.data.TeamAName + this.data.TeamBName + this.data.MatchPlace + rand;
    var hex1 = md5.hex_md5(str1);
    this.setData({
      MatchId: hex1
    })
  },
  //******************************************************选手管理逻辑*******************************************************/
  //******************************************************选手管理逻辑*******************************************************/
  //******************************************************选手管理逻辑*******************************************************/
  //******************************************************选手管理逻辑*******************************************************/
  //******************************************************选手管理逻辑*******************************************************/
  //******************************************************选手管理逻辑*******************************************************/
  hideModalMember(e) {
    this.setData({
      AddMember: 0
    })
  },
  showModalMember(e) {
    this.setData({
      AddMember: 1
    })
    console.log(this.data.Str);
  },
  BindChangeMemberName: function (e) {
    console.log("e.detail.value", e.detail.value)
    this.setData({
      MemberName: e.detail.value
    })
  },
  BindChangeMemberTag: function (e) {
    console.log("e.detail.value", e.detail.value)
    this.setData({
      MemberTag: e.detail.value
    })
  },
  CheckMemberName() {
    if (this.data.MemberName == "") {
      wx.showToast({
        title: "你还未填写名字",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },

  CheckMemberTag() {
    if (this.data.MemberTag == "") {
      wx.showToast({
        title: "你还未填写成员标签",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  IsAddMemberReady() {
    var that = this;
    console.log("app.globalData.IsAddMemberReady", app.globalData.IsAddMemberReady);
    if (app.globalData.IsAddMemberReady == 0) {
      setTimeout(function () {
        that.IsAddMemberReady();
      }, 100)
    } else {
      app.globalData.IsAddMemberReady = 0;
      CF.SearchContestMember(this.data.ContestId)
      this.IsContestMemberReady();
    }
  },
  IsContestMemberReady() {
    var that = this;
    console.log("app.globalData.IsContestMemberReady", app.globalData.IsContestMemberReady);
    if (app.globalData.IsContestMemberReady == 0) {
      setTimeout(function () {
        that.IsContestMemberReady();
      }, 100)
    } else {
      app.globalData.IsContestMemberReady = 0;
      that.setData({
        MemberName: "",
        MemberTag: "",
        ContestMember: app.TempData.TempContestMember,
        ContestMemberRecordId: app.TempData.ContestMemberRecordId
      })
      this.SplitContestMember()
      wx.hideLoading()
      wx.showToast({
        title: '添加成功',
      })
    }
  },
  ConfirmAddMember(e) {
    var that = this;
    wx.showLoading({
      title: '添加中',
    })
    that.CreateMemberID(this.data.ContestId, this.data.MemberName, this.data.MemberTag);
    if (that.CheckMemberTag() && that.CheckMemberName()) {
      this.setData({
        AddMember: 0
      })
      console.log("this.data.ContestId, this.data.MemberName, this.data.MemberTag,this.data.MemberId", this.data.ContestId, this.data.MemberName, this.data.MemberTag, this.data.MemberId)
      CF.MainAddContestMember(this.data.ContestId, this.data.MemberName, "none", this.data.MemberTag, this.data.MemberId)
      this.IsAddMemberReady()
    }
  },
  DeleteMember(e) {
    var index = e.currentTarget.dataset.id;
    var Member = this.data.ContestMember;
    var that = this;
    console.log("Member", Member);
    Member.splice(index, 1); //删除下标为i的元素
    console.log("Member", Member);
    this.setData({
      ContestMember: Member
    })
    this.SplitContestMember();
    var MemberId = [];
    var MemberName = [];
    var MemberTag = [];
    for (var i = 0; i < Member.length; i++) {
      MemberId.push(Member[i]["MemberId"]);
      MemberName.push(Member[i]["MemberName"]);
      MemberTag.push(Member[i]["MemberTag"]);
    }
    wx.showToast({
      title: '删除成功',
    })
    console.log("MemberId,MemberName,MemberTag", MemberId, MemberName, MemberTag)
    CF.DeleteContestMember(this.data.ContestMemberRecordId, MemberName, MemberTag, MemberId);
  },
  CreateMemberID(ContestId, MemberName, MemberTag) { //通过name生成id值
    var str1 = ContestId + MemberName + MemberTag;
    var hex1 = md5.hex_md5(str1);
    this.setData({
      MemberId: hex1
    })
    return hex1;
  },
  //******************************************************赛事信息逻辑*******************************************************/
  //******************************************************赛事信息逻辑*******************************************************/
  //******************************************************赛事信息逻辑*******************************************************/
  //******************************************************赛事信息逻辑*******************************************************/
  //******************************************************赛事信息逻辑*******************************************************/
  //******************************************************赛事信息逻辑*******************************************************/
  BindStartDateChange: function (e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  BindContestTagChange: function (e) {
    this.setData({
      NewContestTag: e.detail.value
    })
  },
  BindEndDateChange: function (e) {
    this.setData({
      EndDate: e.detail.value
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
  UpdateContestInfo(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '更新信息后赛事会重新进入待审核队列？请问确定要修改吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '更新信息中',
          })
          console.log("this.data.NewFileId", that.data.NewFileId)
          console.log(that.data.ContestRecordId, that.data.ContestId)
          that.SplitTag();
          CF.UpdateContestInfo(that.data.ContestRecordId, that.data.ContestName, that.data.ContestPlace, that.data.StartDate, that.data.EndDate, that.data.ContestDescription, that.data.HoldOrganization, that.data.NewContestTag)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    //CF.DeleteImage(this.data.FileId);
    //this.uplodeimage()
  },
  //——————————————————————上传图片—————————————————————————————————————————————
  //UpdateContestPic(RecordId, FileId)

  //uploadContest

  /*uplodeimage: function (e) {
    var that = this;
    var UploadFileId = []
    if (this.data.NewFileId.length != 0) {
      that.data.NewFileId.forEach(function (value, index) {
        const filePath = value;
        const cloudPath = that.data.ContestId + '/image' + index + filePath.match(/\.[^.]+?$/);
        console.log("cloudPath", cloudPath)
        console.log("filePath", filePath)
        // 上传图片
        wx.cloud.uploadFile({
          imagecloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            UploadFileId.push(res.fileID);
            console.log("UploadFileId", UploadFileId)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '照片上传失败',
            })
          },
          complete: () => {
            console.log("FileID", that.data.NewFileId);
            console.log("111", 111);
            if (UploadFileId.length == that.data.NewFileId.length) {
              console.log("222", 222);
              CF.UpdateContestPic(that.data.ContestRecordId, UploadFileId)
            }
          }
        })
      })

    } else {
      CF.UpdateContestPic(that.data.ContestRecordId, UploadFileId)
    }
    this.onReady();
  },*/

  uploadImage(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '更新信息后赛事会重新进入待审核队列？请问确定要修改吗？',
      success(res) {
        if (res.confirm) {
          var UploadFileId = [];
          if (that.data.NewFileId.length != 0) {
            CF.UploadImageFiles(that.data.NewFileId, that.data.ContestRecordId);
          } else {
            CF.UpdateContestPic(that.data.ContestRecordId, [])
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //******************************************************权限管理逻辑*******************************************************/
  //******************************************************权限管理逻辑*******************************************************/
  //******************************************************权限管理逻辑*******************************************************/
  //******************************************************权限管理逻辑*******************************************************/
  //******************************************************权限管理逻辑*******************************************************/
  //******************************************************权限管理逻辑*******************************************************/
  CopyContestId() {
    this.CopyInformation("Contest");
  },
  CopyAdministratorId() {
    this.CopyInformation("Administrator");
  },
  CopyRefereeId() {
    this.CopyInformation("Referee");
  },
  CopyInformation(Type) {
    var that = this;
    var type = ""
    var tempdata;
    if (Type == "Contest") {
      tempdata = this.data.ContestId
      type = "比赛Id:"
    } else if (Type == "Administrator") {
      tempdata = this.data.AdministratorCode
      type = "管理员认证码:"
    } else {
      tempdata = this.data.RefereeCode
      type = "裁判认证码:"
    }
    wx.setClipboardData({
      data: type + tempdata + '_复制此段消息至小程序我的页面即可自动认证',
      success: function (res) {
        wx.showToast({
          title: '已复制到剪贴板',
        })
      }
    });
  },
  downloadAdministratorQrCode() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要保存该图片吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.canvasToTempFilePath({
            canvasId: 'canvasPoster2',
            x: 0,
            y: 0,
            width: that.width,
            height: that.height,
            destWidth: that.width,
            destHeight: that.height,
            success: res => {
              let path = res.tempFilePath //获取到了临时地址
              //保存图片
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: () => {
                  wx.showToast({
                    title: '保存成功'
                  })
                }
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  downloadRefereeQrCode() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要保存该图片吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.canvasToTempFilePath({
            canvasId: 'canvasPoster',
            x: 0,
            y: 0,
            width: that.width,
            height: that.height,
            destWidth: that.width,
            destHeight: that.height,
            success: res => {
              let path = res.tempFilePath //获取到了临时地址
              //保存图片
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                }
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  CreateAdminHaiBao() {
    var that = this
    wx.showLoading({
      title: '生成中',
    })
    this.nextstep("Admin", "canvasPoster2", this.data.AdministratorCode)
    setTimeout(function () {
      var ContestName = that.data.ContestName
      if (ContestName.length > 8) {
        ContestName = ContestName.slice(0, 8) + '...'
      }
      var ctx = wx.createCanvasContext('canvasPoster2');
      ctx.drawImage("../../../images/bg2.png", 0, 0, 144, 192); //宽高和画布一
      ctx.drawImage(that.data.AdminPath, 20, 40, 110, 140)
      ctx.textAlign = "center";
      ctx.font = 'normal bold 14px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(ContestName, 72, 26);
      ctx.font = 'normal bold 16px sans-serif';
      ctx.fillStyle = '#0081ff';
      ctx.fillText("管 理 员 验 证 码", 72, 184);
      //插入内容完了上屏
      ctx.draw();
      that.setData({
        create2: true
      })
      wx.hideLoading()
    }, 1000)
  },
  CreateRefereeHaiBao() {
    var that = this
    wx.showLoading({
      title: '生成中',
    })
    console.log("this.data.RefereeCode", this.data.RefereeCode)
    this.nextstep("Referee", "canvasPoster", this.data.RefereeCode)
    setTimeout(function () {
      var ContestName = that.data.ContestName
      if (ContestName.length > 8) {
        ContestName = ContestName.slice(0, 8) + '...'
      }
      var ctx = wx.createCanvasContext('canvasPoster');
      ctx.drawImage("../../../images/bg2.png", 0, 0, 144, 192); //宽高和画布一
      ctx.drawImage(that.data.RefereePath, 20, 40, 110, 140)
      ctx.textAlign = "center";
      ctx.font = 'normal bold 14px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(ContestName, 72, 26);
      ctx.font = 'normal bold 16px sans-serif';
      ctx.fillStyle = '#0081ff';
      ctx.fillText("裁 判 验 证 码", 72, 184);
      //插入内容完了上屏
      ctx.draw();
      that.setData({
        create: true
      })
      wx.hideLoading()
    }, 1000)
  },
  //******************************************************UI相关逻辑*******************************************************/
  //******************************************************UI相关逻辑*******************************************************/
  //******************************************************UI相关逻辑*******************************************************/
  //******************************************************UI相关逻辑*******************************************************/
  //******************************************************UI相关逻辑*******************************************************/
  //******************************************************UI相关逻辑*******************************************************/
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
    var ContestMember = this.data.ContestMember;
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
  //******************************************************页面跳转逻辑*******************************************************/
  //******************************************************页面跳转逻辑*******************************************************/
  //******************************************************页面跳转逻辑*******************************************************/
  //******************************************************页面跳转逻辑*******************************************************/
  //******************************************************页面跳转逻辑*******************************************************/
  //******************************************************页面跳转逻辑*******************************************************/
  GotoContestLevel3Admin(e) {
    console.log(e)
    var that = this;
    console.log(e.currentTarget.dataset.id)
    if (this.data.Authority == "Referee") {
      var MatchRefereeId = e.currentTarget.dataset.id.RefereeId;
      var MatchRefereeName = e.currentTarget.dataset.id.RefereeName;
      var MatchRefereeLen = MatchRefereeId.length;
      var RecordId = e.currentTarget.dataset.id._id
      var flag = 0;
      for (var i = 0; i < MatchRefereeLen; i++) {
        if (MatchRefereeId[i] == app.globalData.UserId) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        wx.showModal({
          title: '提示',
          content: '确定进入管理该场比赛吗?（进入管理该场比赛将会绑定您的微信账号，如非该场比赛裁判请勿进入管理页面）',
          success(res) {
            if (res.confirm) {
              MatchRefereeId.push(app.globalData.UserId);
              MatchRefereeName.push(app.globalData.userInfo.nickName);
              CF.UpdateMatchReferee(RecordId, MatchRefereeId, MatchRefereeName)
              wx.navigateTo({
                url: '../ContestLevel3Admin/ContestLevel3Admin?MatchId=' + e.currentTarget.dataset.id.MatchId
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../ContestLevel3Admin/ContestLevel3Admin?MatchId=' + e.currentTarget.dataset.id.MatchId
        })
      }
    } else {
      wx.navigateTo({
        url: '../ContestLevel3Admin/ContestLevel3Admin?MatchId=' + e.currentTarget.dataset.id.MatchId
      })
    }
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    if (data.index == '1') {
      this.setData({
        MemberHidden: false,
        selection: data.index
      })
    } else {
      this.setData({
        MemberHidden: true,
        selection: data.index
      })
    }
  },
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
  returnHome() {
    wx.navigateBack();
  },
  //==================================批量添加成员=========================================== 
  /******
   * 注意：成员excel表的导入需符合以下规定，否则即视为导入失败
   * Excel中成员数据记录在第一张表中，无需行列的信息，直接记录成员信息即可：例如：
   *        A         B      
   * 1   成员名1     成员标签
   * 2   成员名2     成员标签
   * 3     ……          ……  
   **************/
  AddMemberExcel() {
    wx.showLoading({
      title: '添加中',
    })
    EF.GetMemberExcelInfo(this.data.ContestId);
    this.IsExcelDataReady();
  },
  IsExcelDataReady() {
    var that = this;
    console.log("app.globalData.IsExcelDataReady", app.globalData.IsExcelDataReady)
    if (app.globalData.IsExcelDataReady == 0) {
      setTimeout(function () {
        that.IsExcelDataReady();
      }, 300)
    } else {
      this.HandelMemberExcel();
    }
  },
  HandelMemberExcel() {
    var that = this
    var ExcelData = app.globalData.ExcelData.result[0].data;
    console.log("ExcelData", ExcelData);
    var NewMemberName = []
    var NewMemberId = [];
    var NewMemberTag = [];
    var ContestMember = this.data.ContestMember;
    ContestMember.forEach(function (item, index) {
      NewMemberName.push(item.MemberName);
      NewMemberId.push(item.MemberId);
      NewMemberTag.push(item.MemberTag);
    })
    console.log("NewMemberName,NewMemberId,NewMemberTag", NewMemberName, NewMemberId, NewMemberTag)
    ExcelData.forEach(function (item, index) {
      console.log("item", item);
      var temp = that.CreateMemberID(that.data.ContestId, item[0], item[1]);
      NewMemberId.push(temp);
      NewMemberName.push(item[0]);
      NewMemberTag.push(item[1]);
    })
    console.log("NewMemberId,NewMemberName,NewMemberTag", NewMemberId, NewMemberName, NewMemberTag);
    var NewMember = []
    NewMemberId.forEach(function (item, index) {
      NewMember.push({
        "MemberId": item,
        "MemberName": NewMemberName[index],
        "MemberTag": NewMemberTag[index]
      });
    })
    this.setData({
      ContestMember: NewMember
    })
    this.SplitContestMember()
    wx.hideLoading({
      complete: (res) => {},
    })
    wx.showToast({
      title: '添加成功',
    })
    EF.UpdateContestMember(this.data.ContestMemberRecordId, NewMemberName, [], NewMemberTag, NewMemberId)

  },
  DownloadCode() {
    console.log("ee");
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要保存该图片吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //保存图片
          wx.getImageInfo({
            src: that.data.src, //这里放你要下载图片的数组(多张) 或 字符串(一张)          下面代码不用改动
            success: function (ret) {
              var path = ret.path;
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                }
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})