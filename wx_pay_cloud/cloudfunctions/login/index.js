// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取上下文
  const wxContext = cloud.getWXContext()
  // 连接数据库
  const db = cloud.database({
    env: cloud.DYNAMIC_CURRENT_ENV
  })

  // 判断用户是否存在
  const result = await db.collection('users').where({
    openid: wxContext.OPENID
  }).limit(1).get()
  console.log('user：'+ JSON.stringify(result));
  if(result.data.length != 0){
    // 用户存在
    return {
      userId: result.data[0]._id
    }
  }
  // 用户不存在
  let params = {
    ...event.user,
    openid: wxContext.OPENID
  }
  // 添加用户到数据库
  const userData = await db.collection('users').add({
    data: params
  })
  console.log('添加用户成功：',userData);
  // 添加成功返回用户id，返回到前端
  return {
    userId: userData._id
  }
}

