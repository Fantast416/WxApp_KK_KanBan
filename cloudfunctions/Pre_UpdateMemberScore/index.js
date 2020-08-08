const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('PreScore').doc(event.RecordId).update({
      data: {
        Score:event.PreScore
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}