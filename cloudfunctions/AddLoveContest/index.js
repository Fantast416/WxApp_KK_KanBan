
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('User_Contest').add({
      data: {
        ContestId: event.ContestId,
        UserId:event.UserId,
        AuthorityType:"Love"
      },
      success: function (res) {
        console.log("AddLoveContestSuccess");
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}