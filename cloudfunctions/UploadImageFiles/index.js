const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await cloud.uploadFile({
      cloudPath: event.cloudPath,
      fileContent: new Buffer(event.filePath, 'base64'),
      success: function (res) {
        console.log('[上传文件] 成功：', res)
        return res
      }
    });
  }catch(e){
    console.error('[上传文件] 失败：', e)
    wx.showToast({
      icon: 'none',
      title: '照片上传失败',
    })
  }
}
