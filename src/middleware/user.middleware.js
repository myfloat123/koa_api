const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/user.service')
const { userFormatError, userAlreadyExited, userRegisterError, userDoesNoExist, userLoginError, invalidPassword } = require('../constant/err.type')

// 验证输入用户名和密码格式的中间件
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormatError, ctx)
    return
  }

  await next()
}

// 验证用户是否存在的中间件
const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  // 合理性
  // if (await getUserInfo({ user_name })) {
  //   ctx.app.emit('error', userAlreadyExited, ctx)
  //   return
  // }
  try {
    const res = await getUserInfo({ user_name })

    if (res) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}

// 验证用户输入密码是否匹配的中间件
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}

// 验证用户登录的中间件
const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在：报错)
  const { user_name, password } = ctx.request.body

  try {
    const res = await getUserInfo({ user_name })

    if (!res) {
      console.error('用户名不存在', { user_name })
      ctx.app.emit('error', userDoesNoExist, ctx)
      return
    }

    // 2. 密码是否匹配(不匹配：报错)
    if (!bcrypt.compareSync(password, res.password)) {
      return ctx.app.emit('error', invalidPassword, ctx)
    }
  } catch (err) {
    console.error(err)
    ctx.app.emit('error', userLoginError, ctx)
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
}