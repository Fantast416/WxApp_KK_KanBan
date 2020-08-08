// miniprogram/pages/CreateContest/CreateContest.js
const md5 = require('../../js/md5.js')
const util = require('../../utils/util.js')
const CF = require('../../js/CloudFunction.js')
var bmap = require('../../libs/bmap-wx.js'); 
var QQMapWX = require('../../js/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StartDate: "",
    EndDate: "",
    ContestName: "",
    ContestType: "",
    ContestPlace: "",
    HoldOrganization: "",
    ContestTag:"",
    Images: "",
    FileId: [],
    ContestId: "", //赛事ID
    RefereeId: "",
    AdministratorId: "",
    showLayerBox: false,
    ContestDescription: "",
    statusBarHeight: '',
    IsFormSubmiting:0,
    IsPositionRight:0,
    latitude:0,
    longitude:0
  },
  IsAddReady(){
    var that = this
    console.log("app.globalData.IsAddContestReady",app.globalData.IsAddContestReady)
    if(app.globalData.IsAddContestReady == 0){
      setTimeout(function(){
        that.IsAddReady();
      },100)
    }else{
      app.globalData.IsAddContestReady = 0;
      CF.SearchAllContestAndClassify(app.globalData.UserId);
      that.IsSearchReady();
    }
  },
  IsSearchReady(){
    var that = this
    console.log("app.globalData.IsSearchAllContestReady",app.globalData.IsSearchAllContestReady)
    if(app.globalData.IsSearchAllContestReady==0){
      setTimeout(function(){
        that.IsSearchReady();
      },100)
    }else{
      app.globalData.IsSearchAllContestReady==0;
      wx.switchTab({
          url: '../A_User/User',
      })
      wx.hideLoading();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.SetInitialTime();
    qqmapsdk = new QQMapWX({
      key: 'VNUBZ-K252F-2U4JO-NSF35-SKNJO-UEB37'
    });
    console.log(",app.globalData.usereInfo",app.globalData.userInfo.avatarUrl)
    this.setData({
      IsQrCodeReady:0,
      ContestType: options.ContestType,
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
    this.SetInitialTime();
    app.globalData.IsSearchAllContestReady = 0;
    this.setData({
      IsQrCodeReady:0,
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
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
  BindStartDateChange: function(e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  BindEndDateChange: function(e) {
    this.setData({
      EndDate: e.detail.value
    })
  },
  BindContestNameChange: function(e) {
    this.setData({
      ContestName: e.detail.value
    })
  },
  BindContestPlaceChange: function(e) {
    this.setData({
      ContestPlace: e.detail.value
    })
  },
  BindOrganizationChange: function(e) {
    this.setData({
      HoldOrganization: e.detail.value
    })
  },
  BindContestTagChange: function(e) {
    this.setData({
      ContestTag: e.detail.value
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
    }else if(this.data.ContestName.length>15){
      wx.showToast({
        title: "赛事名字过长，请在15字以内",
        icon: 'none',
        duration: 1500
      })
      return false
    } 
    else {
      return true
    }
  },
  CheckContestPlace() {
    var that = this;
    if (this.data.ContestPlace == "") {
      wx.showToast({
        title: "你还未填写赛事地点",
        icon: 'none',
        duration: 1500
      })
      return false
    }else{
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
  SetInitialTime() {
    var time = util.formatTime(new Date());
    this.setData({
      StartDate: time[0],
      EndDate: time[0]
    })
  },
  chooseImage: function() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log("res", res)
        var images = []
        res.tempFilePaths.forEach(function(item, index) {
          console.log("item", item);
          images.push(item);
        })
        console.log("image", images)
        that.setData({
          Images: images
        })
        console.log("image2", that.data.images)
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  RemoveImage(e) {
    var index = e.target.dataset.index;
    this.data.Images.splice(index, 1);
    this.setData({
      Images: this.data.Images
    })
  },
  HandleImagePreview(e) {
    const index = e.target.dataset.index
    const images = this.data.Images
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  SplitTag(){
    var Tag = this.data.ContestTag;
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
      ContestTag:NewTag
    })
  },
  FormSubmit(e) {
    if(this.data.IsFormSubmiting==1){
      wx.showToast({
        icon:'none',
        title: '比赛正在注册中请稍后',
      })
      return;
    }
    wx.showLoading({
      title: '正在创建中',
    })
    this.getPosition(e);  //其中包含了增加的函数
  },
  CreateID() { //通过name生成id值
    var str1 = this.data.StartDate + this.data.EndDate + this.data.ContestName + this.data.HoldOrganization;
    var hex1 = md5.hex_md5(str1);
    var hex2 = md5.hex_md5(hex1);
    var hex3 = md5.hex_md5(hex2);
    this.setData({
      ContestId: hex1,
      RefereeId: hex2,
      AdministratorId: hex3
    })
  },
  //——————————————————————上传图片—————————————————————————————————————————————
  uplodeimage: function(e,longitude,latitude) {
    var that = this;
      that.data.Images.forEach(function(value, index) {
        const filePath = value;
        const cloudPath = that.data.ContestId + '/image' + index + filePath.match(/\.[^.]+?$/);
        console.log("cloudPath", cloudPath)
        console.log("filePath", filePath)
        // 上传图片
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            that.data.FileId.push(res.fileID);
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '照片上传失败',
            })
          },
          complete: () => {
            console.log("FileID", that.data.FileId);
            console.log(that.data.FileId.length, that.data.Images.length);
            if (that.data.FileId.length == that.data.Images.length) {
              console.log("进入判断")
              console.log("that.data.ContestId", that.data.ContestId)
              console.log("that.data.FileId.slice(0, 4)", that.data.FileId.slice(0, 4))
              console.log("e",e)
              var temp = that.data.FileId.slice(0, 4);
              CF.Add_Contest(that.data.ContestId, that.data.ContestName, 
                that.data.ContestType, e.detail.value.date1, e.detail.value.date2,
                 temp, that.data.ContestPlace, that.data.HoldOrganization, 
                 e.detail.value.ContestDescription, that.data.RefereeId, 
                 that.data.AdministratorId,that.data.ContestTag,longitude,latitude,app.globalData.userInfo.avatarUrl);
              that.IsAddReady();
            }
          }
        })
      })
  },
  returnType() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },  
  getPosition(e){
    var that = this; 
    // 新建百度地图对象 
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: that.data.ContestPlace, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        if (that.CheckContestName() && that.CheckHoldOrganization() && that.CheckContestPlace()) {
          that.setData({
            IsFormSubmiting : 1
          })
          that.CreateID();
          that.SplitTag();
          CF.GetContestQrCode(that.data.ContestId,that.data.ContestType); //等待正式时开放此代码
          console.log("this.data.RefereeId,this.data.AdministratorId,this.data.ContestId",that.data.RefereeId,that.data.AdministratorId,that.data.ContestId)
          if (that.data.Images.length != 0) {
            console.log("firstway!")
            CF.AddEmptyContestMember(that.data.ContestId);
            CF.Add_UserContestForCreate(app.globalData.UserId, that.data.ContestId, "Administrator")
            that.uplodeimage(e,longitude,latitude);
          } else {
            console.log("secondway!")
            CF.GetContestQrCode(that.data.ContestId,that.data.ContestType); //等待正式时开放此代码
            CF.AddEmptyContestMember(that.data.ContestId);
            CF.Add_UserContestForCreate(app.globalData.UserId, that.data.ContestId, "Administrator")
            CF.Add_Contest(that.data.ContestId, that.data.ContestName, that.data.ContestType, e.detail.value.date1, e.detail.value.date2, ["cloud://wxice-saksi.7778-wxice-saksi-1302267479/Images/none.jpg"], 
            that.data.ContestPlace, that.data.HoldOrganization, e.detail.value.ContestDescription, 
            that.data.RefereeId, that.data.AdministratorId,that.data.ContestTag,longitude,latitude,app.globalData.userInfo.avatarUrl);
            that.IsAddReady();
          }
        }
      },
      fail: function(error) {
        console.error(error);
        wx.showToast({
          icon:'none',
          title: '请输入正确的地址',
        })
      },
      complete: function(res) {
        console.log(res);
      }
    })
  }
})