// miniprogram/pages/HomePage/HomePage.js
const app = getApp()
const CF = require('../../js/CloudFunction.js')
const DC = require('../../js/DistanceCalculate.js')
var bmap = require('../../libs/bmap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //-------赛事数据------------
    Images: [],
    AllContest: [],
    LoveContest: [],
    //----------UI数据------------
    cardCur: 0,
    statusBarHeight: '',
    SearchContestName: null,
    MainBar: '',
    IsReady: 0,
    colorfade: 0,
    naviHeight: '',
    swiperHeight: '',
    searchPos: 0,
    weatherData: null, //获取用户所在城市
    latitude: 0, //获取用户经纬度坐标
    longitude: 0,
    IsFirst:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("In HomePage Onload")
     var value = wx.getStorageSync('key')
     if (value) {
      console.log("后续进入")
     }else{
      wx.setStorage({
        key:"key",
        data:{
          "flag":1
        }
       })
       console.log("第一次进入")
       this.setData({
         IsFirst:1
       })
     }

    var that = this;
    this.IsReady();
    //-----------UI数据设置------------------
    wx.createSelectorQuery().select(".headNavi").boundingClientRect(res => {
      console.log("naviheight", res);
      this.setData({
        naviHeight: res.height
      })
    }).exec()
    wx.createSelectorQuery().select(".swiperCard").boundingClientRect(res => {
      console.log("swiperheight", res);
      this.setData({
        swiperHeight: res.height
      })
    }).exec()
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    console.log("Out HomePage Onload")

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
    var that = this
    console.log("In HomePage OnShow")
    this.selectComponent("#MainBar").setData({
      selected: 0
    })
    this.getUserLocation();
    if (this.data.IsReady == 1) {
      CF.SearchAllContestAndClassify(app.globalData.UserId);
      this.IsSearchAllContestReady()
    }
    console.log("Out HomePage OnShow")

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
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    CF.SearchAllContestAndClassify(app.globalData.UserId);
    this.IsSearchAllContestReady()
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

  onPageScroll: function (e) {
    //console.log(e.scrollTop);
    if (e.scrollTop > this.data.swiperHeight) {
      this.setData({
        searchPos: 1
      })
    } else {
      this.setData({
        searchPos: 0
      })
    }
    if (e.scrollTop <= 100) {
      this.setData({
        colorfade: 1 - e.scrollTop / 100
      })
    } else {
      this.setData({
        colorfade: 0
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*初始化选择 首页上展示图片逻辑*/
  ChooseContestPicture() {
    var ShowPicture = [{
      "FileId": ["cloud://wxice-saksi.7778-wxice-saksi-1302267479/Images/xc3.jpg"]
    }, {
      "FileId": ["cloud://wxice-saksi.7778-wxice-saksi-1302267479/Images/xc.jpg"]
    }, {
      "FileId": ["cloud://wxice-saksi.7778-wxice-saksi-1302267479/Images/xc2.jpg"]
    }];
    this.setData({
      Images: ShowPicture
    })
  },
  GotoLink(e){
    var index = e.currentTarget.dataset.index;
    if(index==0){
      wx.navigateTo({
        url: '../UsingGuide/UsingGuide',
      })
    }else if(index==1){
       wx.showToast({
         icon:'none',
         title: '感谢使用KK看板娘',
       })
    }else if(index==2){
      wx.showToast({
        icon:'none',
        title: '敬请期待',
      })
    }
  },
  /*
    收藏赛事逻辑————————————————————————————————————————————————————————————————————————————————————
       ———————————————————————————————————————————————————————————————————————————————————————————————
  */
  LoveContest(e) {
    var that = this;
    var temp = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var NewAllContest = this.data.AllContest;
    NewAllContest[index].Type = "Love";
    that.setData({
      AllContest: NewAllContest
    })
    CF.AddLoveContest(temp.ContestId, app.globalData.UserId)

  },
  DeleteLoveContest(e) {
    var that = this;
    var temp = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var NewAllContest = this.data.AllContest;
    NewAllContest[index].Type = "NotLove";
    that.setData({
      AllContest: NewAllContest
    })
    CF.DeleteLoveContest(temp.ContestId, app.globalData.UserId)
  },

  /*
    搜索赛事逻辑————————————————————————————————————————————————————————————————————————————————————
    ———————————————————————————————————————————————————————————————————————————————————————————————
  */
  BindSearchContestNameChange(e) {
    this.setData({
      SearchContestName: e.detail.value
    })
    console.log("this.data.SearchName", this.data.SearchContestName)
  },
  SearchContest(e) {
    console.log("In HomePage SearchContest")
    var that = this;
    var Input = that.data.SearchContestName;
    console.log("SearchContest", Input);
    wx.navigateTo({
      url: '../SearchAccurateContest/SearchAccurateContest?SearchName=' + Input,
    })
    console.log("Out HomePage SearchContest")
  },
  /*
    导航逻辑 ——————————————————————————————————————————————————————————————————————————
       ———————————————————————————————————————————————————————————————————————————————————————————————
  */
  GotoContestLevel2(e) {
    console.log(e)
    var temp = e.currentTarget.dataset.id
    if (temp.ContestId != null) {
      console.log(e)
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
  }
},
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //---------------获取地图位置--------------------------------------------------------------
  getUserLocation: function () {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.geo();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.geo();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.geo();
        }
      }
    })
  },
  // 获取用户所在经纬度坐标
  geo: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("res", res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
      }
    })
  },
  getUserCity() {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'YNO12KMv4K2F6EZXvi3XHaumv6OroL38'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      console.log("weatherData", weatherData)
      that.setData({
        weatherData: weatherData
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });
  },
  //距离计算函数----------------------------------------------------------
  CalculateAllContest() {
    var that = this;
    var AllContest = this.data.AllContest;
    var NewAllContest = []
    console.log(AllContest);
    AllContest.forEach(function (item, index) {
      console.log("item", item)
      var Distance = DC.Calculate(that.data.latitude, that.data.longitude, item.Latitude, item.Longitude)
      if (Distance == null) {
        item["Distance"] = '请先打开定位'
      } else if (Distance < 1000) {
        Distance = DC.toDecimal(Distance)
        item["Distance"] = Distance + 'm';
      } else {
        Distance = Distance / 1000;
        Distance = DC.toDecimal(Distance)
        item["Distance"] = Distance + 'km';
      }
      NewAllContest.push(item);
    })
    console.log("NewAllContest", NewAllContest)
    this.setData({
      AllContest: NewAllContest
    })
  },
  //检查数据是否获取完成--------------------------------------------------------
  IsReady() {
    var that = this;
    console.log("IsReady", this.data.IsReady)
    if (app.globalData.IsReady == 0) {
      setTimeout(function () {
        that.IsReady();
      }, 100)
    } else {
      this.setData({
        IsReady: 1,
        colorfade: 1,
        AllContest: app.globalData.AllContest,
        LoveContest: app.globalData.MyLoveContest
      })
      this.CalculateAllContest();
      this.CheckUserInfo();
      that.ChooseContestPicture();
    }
  },
  IsSearchAllContestReady(){
    var that = this;
    console.log("IsSearchAllContestReady", app.globalData.IsSearchAllContestReady)
    if (app.globalData.IsSearchAllContestReady == 0) {
      setTimeout(function () {
        that.IsSearchAllContestReady();
      }, 100)
    } else {
      app.globalData.IsSearchAllContestReady = 0;
      this.setData({
        AllContest: app.globalData.AllContest,
        LoveContest: app.globalData.MyLoveContest
      })
      this.CalculateAllContest()
      this.ChooseContestPicture();
    }
  },
//检查登录信息---------------------------------------------------------------------
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
  GotoGuide(){
    this.setData({
      IsFirst:0
    })
    wx.navigateTo({
      url: '../UsingGuide/UsingGuide',
    })
  },
  HideModal(){
    this.setData({
      IsFirst:0
    })
  }
})