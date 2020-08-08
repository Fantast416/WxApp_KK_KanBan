const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('PreBindMember').add({
      data:{
      ContestId:event.ContestId,
      UserId:event.UserId,
      Name:event.Name,
      StuId:event.StuId
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}