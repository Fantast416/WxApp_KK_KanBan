
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_Send_Info').add({
      data: {
        MatchId: event.MatchId,
        Information: event.NewInformation,
        SendTime:event.SendTime
      },
      success: function (res) {
        console.log("success");
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}