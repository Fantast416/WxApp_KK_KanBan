// components/MainBar/MainBar.js
var app = getApp();
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "../../pages/A_HomePage/HomePage",
      text: "首页"
    }, {
      pagePath: "../../pages/A_ChooseContestType/ChooseContestType",
      text: "发布赛事"
    }, {
      pagePath: "../../pages/A_User/User",
      text: "我的"
    }]
  },
  attached() {
  },
  pageLifetimes: {
    show: function() {
      this.updateData();
    }
  },
  methods: {
    updateData() {
      this.setData({
        selected: app.globalData.BarSelected
      });
    },

    switchTab(e) {
      const that = this
      const data = e.currentTarget.dataset
      console.log(that.data.list[data.index].pagePath)
      wx.switchTab({
        url: that.data.list[data.index].pagePath
      })
      app.globalData.BarSelected = data.index
    }
  }
})