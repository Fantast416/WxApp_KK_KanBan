/* 
未完成，仅为测试数据
*/
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Contest_Info').add({
      data: {
        ContestId: event.ContestId,
        ContestName:event.ContestName,
        ContestPlace:event.ContestPlace,
        ContestType:event.ContestType,
        StartDate:event.StartDate,
        EndDate:event.EndDate,
        FileId: event.FileId,
        ContestDescription:event.ContestDescription,
        HoldOrganization:event.HoldOrganization,
        RefereeId: event.RefereeId,
        AdministratorId: event.AdministratorId,
        ApprovalStatus:0,  //-1为审核不通过，0为待审核，1为审核通过,
        ApprovalReason:"",
        ContestTag:event.ContestTag,
        ScanNum:0,
        Longitude:event.Longitude,
        Latitude:event.Latitude,
        avatarUrl:event.avatarUrl,
        Pre_ScoreItem:[{"ScoreContext":"","ScoreBound":""}],
        Pre_IdentifyCode:event.Pre_IdentifyCode
      }
    });
  } catch (e) {
    console.error(e);
  }
}