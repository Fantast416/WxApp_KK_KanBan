const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('User_Contest').add({
      data: {
        UserId: event.UserId,
        ContestId: event.ContestId,
        AuthorityType: event.AuthorityType
      }
    });
  } catch (e) {
    console.error(e);
  }
}