const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Contest_Member').doc(event.RecordId).update({
      data:{
         MemberName:event.MemberName,
         MemberDescription:event.MemberDescription,
         MemberTag:event.MemberTag,
         MemberId:event.MemberId
      },
      success: function (res) {
        return res
      }
    });

  } catch (e) {
    console.error(e);
  }
}