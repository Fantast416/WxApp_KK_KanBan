const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_ChatRoom').doc(event.RecordId).update({
      data: {
        Status:event.Status
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}