const path = require('path')

const Koa = require('koa')
const { koaBody } = require('koa-body')
const KoaStatic = require('koa-static')
const parameter = require('koa-parameter')

const errHandler = require('./errHandler')

// const userRouter = require('../router/user.route')
// const goodsRouter = require('../router/goods.route')
const router = require('../router')

const app = new Koa()

// console.log(process.cwd()) // D:\Code\Node.js\koa_api
app.use(koaBody({
  multipart: true,
  formidable: {
    // 在配置选项option里，不推荐使用相对路径
    // 在option里的相对路径，不是相对的当前文件，相对process.cwd()  也就是D:\Code\Node.js\koa_api
    // uploadDir: './src/uploads',
    uploadDir: path.join(__dirname, '../uploads'),
    keepExtensions: true,
  },
  parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use(KoaStatic(path.join(__dirname, '../uploads')))
app.use(parameter(app))

// app.use(userRouter.routes())
// app.use(goodsRouter.routes())
app.use(router.routes()).use(router.allowedMethods())

// 统一的错误处理
app.on('error', errHandler)

module.exports = app