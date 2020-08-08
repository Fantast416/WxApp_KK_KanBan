function BindPreMember(ContestId,Name,StuId,UserId) {
  console.log("Run Function BindPreMember")
  console.log("ContestId,Name,StuId,UserId", ContestId,Name,StuId,UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_SearchMember',
    data: {
      ContestId:ContestId,
      Name:Name,
      StuId:StuId
    },
    success: res => {
      console.log("SearchPreMember", res); 
      if(res.result.data.length==0){
        this.AddPreMember(ContestId,Name,StuId,UserId);
        app.globalData.IsBindOk = 1;
      }else{
        wx.showToast({
          icon:'none',
          title: '该信息已经有人使用',
        })
        app.globalData.IsBindOk = 0;
      }
      app.globalData.IsBindReady = 1;
      
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function SearchIsPreMember(ContestId,UserId){
  console.log("Run Function SearchIsPreMember")
  console.log("ContestId,UserId", ContestId,UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_SearchIsMember',
    data: {
      ContestId:ContestId,
      UserId:UserId
    },
    success: res => {
      console.log("SearchPreMember", res); 
      if(res.result.data.length==0){
        app.globalData.PreIsFirst = 1;
      }else{
        app.globalData.PreIsFirst = 0;
        if(res.result.data[0].Name=='观众'){
          app.globalData.IsBind = 0
        }else{
          app.globalData.IsBind = 1
        }
      }
      
      app.globalData.IsPreReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}


function AddPreMember(ContestId,Name,StuId,UserId) {
  console.log("Run Function AddPreMember")
  console.log("ContestId,Name,StuId,UserId", ContestId,Name,StuId,UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_AddMember',
    data: {
      ContestId:ContestId,
      Name:Name,
      StuId:StuId,
      UserId:UserId
    },
    success: res => {
      console.log("AddPreMember Success", res); 
    },
    fail: err => {uccess
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function MainAddPreScore(ContestId,MatchId,UserId) {
  console.log("Run Function MainAddPreScore")
  console.log("ContestId,MatchId,UserId", ContestId,MatchId,UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_AddScore',
    data: {
      ContestId:ContestId,
      MatchId:MatchId,
      UserId:UserId
    },
    success: res => {
      console.log("MainAddPreScore Success", res); 
      app.globalData.IsAddPreScoreReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function AddPreScore(ContestId,MatchId,UserId) {
  console.log("Run Function AddPreScore")
  console.log("ContestId,MatchId,UserId", ContestId,MatchId,UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_SearchScore',
    data: {
      ContestId:ContestId,
      MatchId:MatchId,
      UserId:UserId
    },
    success: res => {
      console.log("SearchPreScore Success", res);
      if(res.result.data.length==0){
        this.MainAddPreScore(ContestId,MatchId,UserId)
      }else{
        app.globalData.IsAddPreScoreReady = 1;
      }
    },
    fail: err => {uccess
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}


function SearchPreScore(UserId,MatchId){
  console.log("Run Function SearchPreScore")
  console.log("UserId,MatchId",UserId,MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_LoadSearchScore',
    data: {
      UserId:UserId,
      MatchId:MatchId
    },
    success: res => {
      console.log("Pre_LoadSearchScore Success", res);
      app.TempData.PreScore = res.result.data[0];
      app.globalData.IsPreLoadSearchScoreReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}
function SearchPreMemberInfo(UserId,ContestId){
 console.log("Run Function SearchPreMemberInfo")
  console.log("UserId", UserId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_LoadSearchMember',
    data: {
      UserId:UserId,
      ContestId:ContestId
    },
    success: res => {
      console.log("Pre_LoadSearchMemberInfo Success", res); 
      app.TempData.PreMemberInfo = res.result.data[0];
      app.globalData.IsPreLoadSearchMemberReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

function UpdateMemberScore(RecordId,PreScore){
  console.log("Run Function UpdateMemberScore")
   console.log("RecordId,PreScore", RecordId,PreScore)
   var result;
   var app = getApp()
   var that = this;
   wx.cloud.callFunction({
     name: 'Pre_UpdateMemberScore',
     data: {
       RecordId:RecordId,
       PreScore:PreScore
     },
     success: res => {
       console.log("Pre_UpdateMemberScore Success", res); 
       wx.hideLoading()
      wx.showToast({
        icon:'none',
        title: '更新该组成绩成功',
      })
     },
     fail: err => {
       console.error('[云函数] [login] 调用失败', err)
     }
   })
 }

 function GetAllMember(ContestId){
  console.log("Run Function Pre_GetAllMember")
  console.log("ContestId", ContestId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_GetAllMember',
    data: {
     ContestId:ContestId
    },
    success: res => {
      console.log("Pre_GetAllMember Success", res); 
      app.TempData.PreAllMember = res.result.data
      app.globalData.IsPreGetAllMemberReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败 GetALLmember', err)
    }
  })
 }

 function GetAllScore(MatchId){
  console.log("Run Function Pre_GetAllScore")
  console.log("MatchId",MatchId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_GetAllScore',
    data: {
      MatchId:MatchId
    },
    success: res => {
      console.log("Pre_GetAllScore Success", res); 
      app.TempData.PreAllScore = res.result.data
      app.globalData.IsPreGetAllScoreReady = 1;
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
 }


 //-------------------------------------------------------
 //导出excel
function exportFile(TableHead,TableList){
  console.log("Run Function exportFile")
  wx.showLoading({
    title: '正在导出',
  });
  console.log("TableHead,TableList",TableHead,TableList);
  wx.cloud.callFunction({
    name:'Pre_ExportExcel',
    data:{
      TableHead:TableHead,
      TableList:TableList
    }
  }).then(res=>{
    console.log("exportFile Success",res)
    const fileID = res.result.fileID;
    //下载文件
    wx.cloud.downloadFile({
      fileID: fileID
    }).then(res1 => {
      console.log("res1",res1)

      wx.openDocument({
        showMenu:true,
        filePath: res1.tempFilePath,
        success: function (res) {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log('打开文档成功')
        }
      })
    }).catch(error => {
      console.log("err",error)
      // handle error
    })
  }).catch(err1=>{
    console.log("err1",err1)
  });
}

function UpdateScoreItems(ContestRecordId,ScoreItems){
  console.log("Run Function UpdateScoreItems")
  console.log("ContestRecordId,ScoreItems",ContestRecordId,ScoreItems)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'Pre_UpdateScoreItems',
    data: {
      ContestRecordId:ContestRecordId,
      ScoreItems:ScoreItems
    },
    success: res => {
      console.log("Pre_UpdateScoreItems Success", res); 
      wx.showToast({
        title: '修改成功',
      })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

module.exports = {
  AddPreMember:AddPreMember,
  BindPreMember:BindPreMember,
  SearchIsPreMember:SearchIsPreMember,
  AddPreScore:AddPreScore,
  MainAddPreScore:MainAddPreScore,
  SearchPreScore:SearchPreScore,
  SearchPreMemberInfo:SearchPreMemberInfo,
  UpdateMemberScore:UpdateMemberScore,
  GetAllScore:GetAllScore,
  GetAllMember:GetAllMember,
//------------------------------------
  exportFile:exportFile,
  UpdateScoreItems:UpdateScoreItems
}