// todo 需要使用微信云开发 后续都改用微信云开发吧

// const cloud = require('wx-server-sdk');
// cloud.init();

// exports.sendMemberRecordNotice = async (touser, thing1, thing2, date3) => {
//   try {
//     const result = await cloud.openapi.subscribeMessage.send({
//         touser: touser,
//         page: '/pages/member/index',
//         lang: 'zh_CN',
//         data: {
//           thing1: {
//             value: thing1
//           },
//           thing2: {
//             value: thing2
//           },
//           date3: {
//             value: date3
//           }
//         },
//         templateId: 'gcm5blboAoAEBicRiojCPlLqnHCxOB1SD0ALKB9No1M',
//         miniprogramState: 'developer'
//       })
//     return result
//   } catch (err) {
//     return err
//   }
// }