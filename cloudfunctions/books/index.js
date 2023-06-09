// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({
    event
  })
  const db = cloud.database()
  const collection = db.collection('booklist')
  const wxContext = cloud.getWXContext()
  const command = db.command


  app.router('booklist', async (ctx, _) => {
    const {
      classify
    } = event
    ctx.body = await collection.where({
        classify
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  app.router('allsale', async (ctx, _) => {
    ctx.body = await collection.where({
        isSaled: 'false'
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })
  app.router('mysale', async (ctx, _) => {
    const openid = wxContext.OPENID

    ctx.body = await collection.where({
        openid
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })
  app.router('cate-sale', async (ctx, _) => {
    ctx.body = await collection.where({
        bookCateGoryInfo: {
          bookCateGoryID: event.bookCateGoryId
        },
        isSaled: 'false'
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })
  app.router('add', (ctx, _) => {
    const openid = wxContext.OPENID

    const {
      bookinfo
    } = event
    collection.add({
      data: {
        ...bookinfo,
        createTime: db.serverDate(),
        isSaled: 'false',
        openid
      }
    }).then(res => {
      ctx.body = {
        code: 200,
        data: res
      }
    }).catch(console.error)
  })

  // search逻辑
  app.router('book-search', async (ctx, next) => {
    const keywords = event.keywords || ''
    let w = {}
    if (keywords.trim() !== '') {
      w = {
        name: db.RegExp({
          regexp: keywords,
          options: 'i'
        })
      }
    }
    const searchList = await collection.where({
        ...w
      }).skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
    console.log('>>', searchList);
    ctx.body = {
      code: 200,
      data: searchList
    }
  })

  return app.serve()
}
