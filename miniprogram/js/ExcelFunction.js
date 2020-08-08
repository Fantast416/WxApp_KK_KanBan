var app = getApp()
function AnalyseExcel(fileId){
  console.log("fileId",fileId)
  wx.cloud.callFunction({
    name:'AnalyseExcel',
    data:{
      fileId:fileId
    },
    success(res){
      console.log("AnalyseExcel_Success",res)
      app.globalData.ExcelData = res;
      app.globalData.IsExcelDataReady = 1;
    },
    fail(res){
      console.log("解析失败",res)
      wx.showToast({
        icon:'none',
        title:'解析失败'
      })
    }
  })
}
function GetMemberExcelInfo(ContestId){
  var that = this;
  wx.chooseMessageFile({
    count:1,
    type:'file',
    success(res){
      var path = res.tempFiles[0].path;
      console.log('选择excel成功',path);
      wx.cloud.uploadFile({
        cloudPath: 'MemberExcel/' + ContestId + new Date().getTime() + '.xls',
        filePath:path,
        success:res=>{
          console.log('上传成功',res.fileID);
          that.AnalyseExcel(res.fileID);
        },
        fail:err=>{
          console.log('s上传失败',err);
        }
      })
  }
})
}


function UpdateContestMember(RecordId, MemberName, MemberDescription,MemberTag, MemberId) {
  console.log("Run Function EF UpdateContestMember")
  console.log("RecordId,MemberName, MemberDescription,MemberTag, MemberId", RecordId, MemberName,MemberDescription, MemberTag, MemberId)
  var result;
  var app = getApp()
  var that = this;
  wx.cloud.callFunction({
    name: 'UpdateContestMember',
    data: {
      RecordId: RecordId,
      MemberId: MemberId,
      MemberDescription:MemberDescription,
      MemberName: MemberName,
      MemberTag: MemberTag
    },
    success: res => {
      console.log(" EF UpdateContestMember", res);
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

module.exports = {
  AnalyseExcel:AnalyseExcel,
  GetMemberExcelInfo:GetMemberExcelInfo,
  UpdateContestMember:UpdateContestMember
}