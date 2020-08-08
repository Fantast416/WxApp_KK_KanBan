// miniprogram/pages/SearchAccurateContest/SearchAccurateContest.js
const app = getApp()
const CF = require('../../js/CloudFunction.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SearchName:"",
    ContestInfo:[],
    statusBarHeight: '',
    flag:1 //无查询结果时flag=0，显示暂无结果
  },
  IsReady(){
    var that = this;
    if(app.globalData.IsAccurateContessReady==0){
      setTimeout(function(){
        that.IsReady();
      },100)
    }else{
      app.globalData.IsAccurateContessReady=0;
      this.setData({
        ContestInfo:app.TempData.AccurateContest
      })
      if(app.TempData.AccurateContest.length==0){
        this.setData({
          flag:0
        })
      }
      wx.hideLoading();
      console.log("app.TempData.AccurateContest", app.TempData.AccurateContest)
      console.log("that.data.ContestInfo", that.data.ContestInfo)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      SearchName: options.SearchName,
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff9700',
    })
    wx.showLoading({
      title: '搜索中',
    })
    CF.SearchAccurateContest(this.data.SearchName);
    this.IsReady()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      SearchName:"",
      flag:1
    })
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
  returnHome(){
    wx.switchTab({
      url: '../A_HomePage/A_HomePage',
    })
  },
  BindSearchContestNameChange(e) {
    this.setData({
      SearchName: e.detail.value
    })
  },
  SearchContest(e) {
    if(this.data.SearchName==""){
      wx.showToast({
        icon:'none',
        title: '请先输入搜索名字',
      })
      return;
    }
    wx.showLoading({
      title: '搜索中',
    })
    this.setData({
      flag: 1
    })
    var Input = this.data.SearchName;
    var that = this;
    console.log("SearchContest", Input);
    CF.SearchAccurateContest(Input);
    this.IsReady()
  },
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
})