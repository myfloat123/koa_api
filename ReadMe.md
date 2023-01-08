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

```
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

在终端，使用`cd src`切换到`src`目录下，然后再使用`node main.js`启动服务器

![image-20230108172619238](C:\Users\27672\AppData\Roaming\Typora\typora-user-images\image-20230108172619238.png)

# 三. 项目的基本优化

## 1 自动重启服务

安装nodemon工具

```
npm install nodemon
```

编写`package.json`脚本

```
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

```
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(3000, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

