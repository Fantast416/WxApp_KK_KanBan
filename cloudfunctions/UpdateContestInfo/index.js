const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Contest_Info').doc(event.RecordId).update({
      data: {
        ContestName: event.ContestName,
        ContestPlace: event.ContestPlace,
        StartDate: event.StartDate,
        EndDate: event.EndDate,
        ContestDescription: event.ContestDescription,
        HoldOrganization: event.HoldOrganization,
        ApprovalStatus:0,
        ContestTag:event.ContestTag
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}