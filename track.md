---
outline: deep
head:
  - - meta
    - name: title
      content: 自我学习
  - - meta
    - name: description
      content: 自我学习，努力上进
---

# 埋点与监控

```md
两个指标：
  pageView(pv)：用户每次对网站访问的记录，也就是页面访问量
  userView(uv)：指的是独立用户的访问量，一个ip算一次

作用：
  1.行为数据：收集用户的页面的浏览量
  2.用户性能评估：收集页面的加载时间，API调用延迟的时间，错误的日志
  3.设备和环境：收集用户操作设备，操作系统，浏览器版本
  4.属性数据： 用户的ID，地理位置，用户的角色
  总的来讲，就是收集用户的隐私信息
```

::: tip
npm run dev底层原理:
  在运行nom run dev(vite构建)的时候，会去node_moduls的.bin文件夹下面去找vite命令文件(sh文件是给mac运行的，cmd文件和ps1是给windows运行的)

npx vite底层原理:
   会先在本地的.bin里面去寻找，没有vite会去进行安装，再启动，用完之后就删掉了。
   如果发现本地没有，就会去全局的node_moduls去找，全局的还找不到，就会去环境变量里面找，还找不到就去对应的git仓库下载安装，运行完再删掉
:::

## 一、index.html
```html
<body>
  <h1>埋点</h1>
  <script type="module" src="./main.ts"></script>
  /* 增加自定义属性 */
  <button data-tracker="埋点">点击统计</button>
  <button>点击不统计</button>
</body>

如果要使用原生esm，需要在这里加一个type="module"，并且要配合src使用
type="module"的作用：
  1.让vite能够进行拦截
  2.可以使用import语法

在script里面加type="module"是给浏览器用的，在package.json里面加type="module"是给node用的
```

## 二、main.ts
```ts
import { Tracker } from './lib'

new Tracker();
```

## 三、lib/index.ts
```ts
import { getUserInfo } from './user/index'
import button from './button'

export class Tracker{
  constrctor(){
    events: Record<string,Function>
    this.events = {button}
    this.init()
  }

  publick sendRequst(){
    const userInfo = getUserInfo()
    // 这里都不能使用axios,ajsx,fetch,为什么不能使用呢？
    let blob = new Blob([JSON.stringify(userInfo)],{type: "application/json"})
    navigator.sendBeacon('https://www.baidu.com',blob)
  }

  private init(){
    Object.keys(this.events).forEach(key=>{
      this.events[key](this.sendRequst) 
    })
  }
}
```
:::tip navigator.sendBeacon()
在进行埋点的时候不能使用axios,ajsx,fetch去发送请求，因为有可能在点击的时候，接口正在发送，但是页面被关闭了，那么请求就会终止

但是navigator.sendBeacon发送请求，在页面关闭的时候，接口还是在继续发送

注意点：
  1.默认发送的是post请求，并且是一个ping请求，速度快，不能发送很长的数据，返回的数据要很小
  2.不能传送json，可以使用blob去传递json，设置type为application/json
  3.使用json会跨域
  4.会默认携带cookies
::: 

## 四、lib/user/index.ts
```ts
export const getUserInfo = (user = {}) => {
  return {
    userId:1,
    name: 'oyy',
    data: new Date().getTime(),
    userAgent: navigator.userAgent
  }
}
```

## 五、lib/button/index.ts
```ts
export default function button(send){
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLELement;
    // 读取自定义属性
    const token = target.getAttribute('data-tracker');
    if(token){
      // 上报按钮点击
      send()
    }
  })
}
```

## 六、lib\index.ts
```ts
```

## 七、lib\index.ts
```ts
```

## 八、跨域
请求分为 普通请求 和 复杂请求
:::tip 普通请求
默认支持的请求头部
  1.Content-Type: application/x-www-form-urlencoded
  2.Content-Type: multipart/form-data
  3.Content-Type: text/plain

默认支持的请求类型
  get post head options

默认支持请求头的字段
  Accept
  Accept-Language
  Content-Language
  Content-Type
  Origin
  Referer
  User-Agent
:::

:::tip 复杂请求
  Content-type: application/json
:::

:::tip 跨域解决
  浏览器报错 
  Responese to preflight request dosen't pass access control check:No'Access-Control-Allow-Origin'head is present on the requested resource;

  后台设置
  // 设置 * 或者指定 IP
  res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')

  设置完之后，又报错
  // 后台没有设置允许上传cookie
  The value of the 'Access-Control-Allow-Credentials' head in the response is '' which must be 'true' when the request's credentials mode is 'include';

  后台设置
  // 设置 * 或者指定 IP
  res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')
  // 允许携带cookie
  res.setHeader('Access-Control-Allow-Credentials','true')

  又报错
  // application/json不包含在普通请求的Content-Type中
  Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response;

   后台设置
  // 设置 * 或者指定 IP
  res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')
  // 允许携带cookie
  res.setHeader('Access-Control-Allow-Credentials','true')
  // 允许application/json
  res.setHeader('Access-Control-Allow-Headers','Content-Type')
:::

:::tip 发送两次请求(预检请求)
触发条件
  1.排除普通请求
  2.自定义请求头
  3.必须是post并且为application/json
触发条件达到，就会发送预检请求(options请求)，浏览器自己发送的
:::