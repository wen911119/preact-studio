### 快速开始
```
yarn
yarn start
```
之后访问http://{本机ip}:3000就可以看到页面

### 快速创建页面
```
yarn add-page
```
会依次提示你输入页面名（英文页面名）和页面标题（会显示在标题栏），之后会帮你创建好h5页面和小程序页面。
同时会在package.json中增加pages属性记下页面名和标题的对应关系。

### 构建目标全局变量
`javascript
console.log($BUILD_TARGET$)
// 本地开发(yarn start) ==> local
// 测试环境(yarn build:dev) ==> dev
// 生产环境(yarn build:pro) ==> production
`
可以根据不同值来走不同api的endpoint

### 修改响应式基础
默认是按照移动端750px的设计的，如果要修改，可以在package.json里加一个属性p2rBase，值改为设计稿尺寸，比如1080。

### 修改默认页面模版
可以在项目根目录下放一个自定义的template.html

### 提取公文js库进common.js
package.json中有一个commonChunks属性，里面记录了要进common.js的包名。