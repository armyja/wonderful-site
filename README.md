# Express 实践
## 功能
- 用户系统
  - 注册、登录
  - 登录验证
  - cookies
- Todo List
  - 创建、删除、归档

## 安装 & 配置
1. 安装 mongodb 并开启 mongod 服务
2. `git clone https://github.com/samwang1027/wonderful-site.git`
3. `cd ./wonderful-site`
3. 修改 `wonderful-site/db.js` 的 `mongoose.connect('mongodb://127.0.0.1:27017/wonderful');` 为自己的地址
4. `npm install && node ./bin/www` 运行它吧~ （Windows 系统下，路径使用反斜杠）

## Demo
http://todo.armyja.cn