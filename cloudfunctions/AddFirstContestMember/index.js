
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Contest_Member').add({
      data: {
        ContestId: event.ContestId,
        MemberDescription:event.MemberDescription,
        MemberId:event.MemberId,
        MemberName: event.MemberName,
        MemberTag: event.MemberTag
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}