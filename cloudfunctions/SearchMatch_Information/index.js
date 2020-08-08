const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_Send_Info').where({
      MatchId: event.MatchId
    }).get({
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}