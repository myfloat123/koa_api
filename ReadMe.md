# 一. 项目的初始化

## 1 npm初始化

```
npm init -y
```

生成`package.json`文件:

- 记录项目的依赖

## 2 git初始化

```
git init
```

生成'.git'隐藏文件夹，git的本地仓库

## 3 创建ReadMe文件

# 二. 搭建项目

## 1 安装Koa框架

```
npm install koa
```

## 2 编写最基础的app

创建`src/main.js`

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})
```

## 3 测试

在终端，使用`node main.js`

![image-20230108172619238](C:\Users\27672\AppData\Roaming\Typora\typora-user-images\image-20230108172619238.png)

# 三. 项目的基本优化

## 1 自动重启服务

安装nodemon工具

```
npm install nodemon -D
```

编写`package.json`脚本

```json
"scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

执行`npm run dev`启动服务

![image-20230108173807792](C:\Users\27672\AppData\Roaming\Typora\typora-user-images\image-20230108173807792.png)

## 2 读取配置文件

安装`dotenv`，读取根目录中的`.env`文件，将配置写到`process.env`中

```
npm install dotenv
```

创建`.env`文件

```
APP_PORT=8000
```

创建`src/config/config.default.js`

```js
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 四. 添加路由

路由：根据不同的URL，调用对应处理函数

## 1 安装koa-router

```
npm install koa-router
```

步骤：

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件

## 2 编写路由

创建`src/router`目录，编写`user.route.js`

```js
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

## 3 改写`main.js`

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 五. 目录结构优化

## 1 将http服务和app业务拆分

创建`src/app/index.js`

```js
const Koa = require('koa')

const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写`main.js`

```js
const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 2 将路由和控制器拆分

路由：解析URL，分发给控制器对应的方法

控制器：处理不同的业务

改写`user.route.js`

```js
const Router = require('koa-router')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

module.exports = router
```

创建`controller/user.controller.js`

```js
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 六. 解析body

## 1 安装koa-body

```
npm install koa-body
```

## 2 注册中间件

改写`app/index.js`

![image-20230108191911996](C:\Users\27672\AppData\Roaming\Typora\typora-user-images\image-20230108191911996.png)

## 3 解析请求数据

改写`user.controller.js`

```js
const { createUser } = require('../service/user.service')
class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    console.log(res)
    // 3. 返回结果
    ctx.body = ctx.request.body
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 4 拆分service层

service层注意是做数据库处理

创建`src/service/user.service.js`

```js
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```

# 七. 数据库操作

sequelize ORM数据库工具

ORM: 对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

## 1 安装sequelize

```
npm i mysql2 sequelize
```

## 2 连接数据库

`src/db/seq.js`

```js
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB
} = require('../config/config.default')
const { Sequelize } = require('sequelize')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql'
})

seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

module.exports = seq
```

## 3 编写配置文件

```
APP_PORT = 8000

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = admin123
MYSQL_DB = zdsc2
```

# 八. 创建 User 模型

## 1 拆分 Model 层

sequelize 主要通过 Model 对应数据表

创建`src/model/user.model.js`

```js
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(Model zd_user -> zd_users)
const User = seq.define('zd_user', {
  // id 会被sequelize自动创建，管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员，0：不是管理员（默认）；1：是管理员'
  }
})

// 强制同步数据库(创建数据表)
// User.sync({ force: true })

module.exports = User
```

# 九. 添加用户入库

所有数据库的操作都在 Service 层完成，Service 调用 Model 完成数据库操作

改写`src/service/user.service.js`

```js
const User = require('../model/use.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // User.create({
    //   // 表的字段
    //   user_name: user_name,
    //   password: password
    // })

    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }
}

module.exports = new UserService()
```

同时，改写`user.controller.js`

```js
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 十. 错误处理

在控制器中，对不同的错误进行处理，返回不同的提示错误信息，提高代码质量

```js
const { createUser, getUserInfo } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body

    // 合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body)
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
      }
      return
    }
    // 合理性
    if (getUserInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: ''
      }
      return
    }
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      results: {
        id: res.id,
        user_name: res.user_name,
      }
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

在 service 中封装函数

```js
const User = require('../model/user.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // await表达式：promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }

  async getUserInfo({ id, user_name, password, is_admin }) {
    const whereOpt = {}

    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt
    })

    return res ? res.dataValues : null
  }
}

module.exports = new UserService()
```

