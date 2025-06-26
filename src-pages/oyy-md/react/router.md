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

## 一、安装

react-router 在最新版本 V7 中，设计了三种模式

- 框架模式

框架模式就是使用，React-router 提供的脚手架模板去安装，安装完成后会自带路由功能。

```tsx
npx create-react-router@latest my-react-router-app # 创建项目
cd my-react-router-app # 进入项目
npm i # 安装依赖
npm run dev # 启动项目
```

- 数据模式

数据模式就是，我们可以使用自己的模板去创建 React 项目，比如使用 vite webpack 等，然后自己安装 React-router。

```tsx
npm i react-router #V7版本不在需要下载 react-router-dom，这个库已经合并到 react-router 中
```

```tsx
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/about",
    Component: About
  }
]);
```

- 声明模式

声明模式，也可以用自己的模板创建 React 项目，然后自己安装 React-router。

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app";
import About from "../about";
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
```

:::tip
数据模式和声明模式的区别，数据模式可以享用 React-router 所有的功能，包括数据处理。而声明模式只能享用 React-router 的一部分功能，比如路由跳转。

如果做一个小项目可以使用声明模式，如果要做企业级项目可以使用数据模式。
:::

### [1]. 基本使用

- src/router/index.ts

```tsx
import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import About from "../pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/about",
    Component: About
  }
]);

export default router;
```

- src/App.tsx

```tsx
import React from "react";
import { RouterProvider } from "react-router";
import router from "./router";
const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
```

## 二、路由模式

在 React RouterV7 中，是拥有不同的路由模式，路由模式的选择将直接影响你的整个项目。React Router 提供了四种核心路由创建函数：
<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createBrowserRouter</span>、<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createHashRouter</span>、<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createMemoryRouter</span> 和 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createStaticRouter</span>

### 1. createBrowserRouter(推荐)

createBrowserRouter 是 React Router 提供的一种路由模式，它使用 HTML5 的 History API 来管理路由。

```tsx
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([{ path: "/", element: <App /> }]);
```

#### [1]. 特点

- 使用 HTML5 的 history API (pushState, replaceState, popState)
- 浏览器 URL 比较纯净 (/search, /about, /user/123)
- 需要服务器端支持(nginx, apache,等)否则会刷新 404

#### [2]. 应用场景

- 大多数现代浏览器环境
- 需要服务器端支持
- 需要 URL 美观

### 2. createHashRouter

createHashRouter 是 React Router 提供的一种路由模式，它使用 URL 的 hash 来管理路由。

```tsx
import { createHashRouter } from "react-router";

const router = createHashRouter([{ path: "/", element: <App /> }]);
```

#### [1]. 特点

- 使用 URL 的 hash 部分(#/search, #/about, #/user/123)
- 不需要服务器端支持
- 刷新页面不会丢失

#### [2]. 应用场景

- 静态站点托管例如(github pages, netlify, vercel)
- 不需要服务器端支持

### 3. createMemoryRouter

createMemoryRouter 是 React Router 提供的一种路由模式，它使用内存来管理路由。

```tsx
import { createMemoryRouter } from "react-router";

const router = createMemoryRouter([{ path: "/", element: <App /> }]);
```

#### [1]. 特点

- 使用内存中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示 URL

#### [2]. 应用场景

- 非浏览器环境例如(React Native, Electron)
- 单元测试或者组件测试(Jest, Vitest)

### 4. createStaticRouter

createStaticRouter 是 React Router 提供的一种路由模式，它使用静态路由来管理路由。

```tsx
import { createStaticRouter } from "react-router";

const router = createStaticRouter([{ path: "/", element: <App /> }]);
```

#### [1]. 特点

- 专为服务端渲染（SSR）设计
- 在服务器端匹配请求路径，生成静态 HTML
- 需与客户端路由器（如 createBrowserRouter）配合使用

#### [2]. 应用场景

- 服务端渲染应用（如 Next.js 的兼容方案）
- 需要 SEO 优化的页面

### 5. 解决刷新 404 问题

当使用 createBrowserRouter 时，如果刷新页面会丢失状态，这是因为浏览器默认会去请求服务器上的资源，如果服务器上没有资源，就会返回 404。 要解决这个问题就需要在服务器配置一个回退路由，当请求的资源不存在时，返回 index.html。

- Nginx 配置

```tsx
location / {
  try_files $uri $uri/ /index.html;
}
```

- Apache 配置

```ts
<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

- Node.js 配置

```tsx
const http = require("http");
const fs = require("fs");
const httpPort = 80;

http
  .createServer((req, res) => {
    fs.readFile("index.html", "utf-8", (err, content) => {
      if (err) {
        console.log('We cannot open "index.html" file.');
      }

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });

      res.end(content);
    });
  })
  .listen(httpPort, () => {
    console.log("Server listening on: http://localhost:%s", httpPort);
  });
```

## 三、路由种类

React-Router V7 的路由种类是非常多的，有<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">嵌套路由</span> <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">布局路由</span> <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">索引路由</span> <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">前缀路由</span> <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">动态路由</span>

### 1. 嵌套路由

嵌套路由就是父路由中嵌套子路由<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">children</span>，子路由可以继承父路由的布局，也可以有自己的布局。

```tsx
const router = createBrowserRouter([{ path: "/", element: <App />, children: [{ path: "about", element: <About /> }] }]);
```

:::tip

- 父路由的 path 是 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">index</span> 开始，所以访问子路由的时候需要加上父路由的 path 例如 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">/index/home</span> <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">/index/about</span>
- 子路由不需要增加<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">/</span> 了直接写子路由的 path 即可
- 子路由默认是不显示的，需要父路由通过<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">Outlet</span> 组件来显示子路由 outlet 就是类似于 Vue 的<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">router-view</span> 展示子路由的一个容器
- 子路由的层级可以无限嵌套，但是要注意的是，一般实际工作中就是 2-3 层
  :::

```tsx
const router = createBrowserRouter([
  {
    path: "/index",
    Component: Layout, // 父路由
    children: [
      {
        path: "home",
        Component: Home // 子路由
      },
      {
        path: "about",
        Component: About // 子路由
      }
    ]
  }
]);

import { Outlet } from "react-router";
function Content() {
  return <Outlet />;
}
```

### 2. 布局路由

布局路由是一种特殊的嵌套路由，父路由可以省略 path，这样不会向 URL 添加额外的路径段：

```tsx
const router = createBrowserRouter([
  {
    // path: '/index', //省略
    Component: Layout,
    children: [
      {
        path: "home",
        Component: Home
      },
      {
        path: "about",
        Component: About
      }
    ]
  }
]);
```

### 3. 索引路由

索引路由使用 index: true 来定义，作为父路由的默认子路由：

索引路由在其父级的 URL 处呈现到其父级的 Outlet 中，也就是访问/ 的时候，会默认展示 Home 组件。

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        // path: 'home',
        Component: Home
      },
      {
        path: "about",
        Component: About
      }
    ]
  }
]);
```

### 4. 前缀路由

前缀路由只设置 path 而不设置 Component，用于给一组路由添加统一的路径前缀：

```tsx
const router = createBrowserRouter([
  {
    path: "/project",
    //Component: Layout, //省略
    children: [
      {
        path: "home",
        Component: Home
      },
      {
        path: "about",
        Component: About
      }
    ]
  }
]);
```

### 5. 动态路由

动态路由通过 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">:参数名</span> 语法来定义动态段：

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "home/:id",
        Component: Home
      },
      {
        path: "about",
        Component: About
      }
    ]
  }
]);

//在组件中获取参数
import { useParams } from "react-router";

function Card() {
  let params = useParams();
  console.log(params.id);
}
```

## 四、路由传参

### 1. QueryString 方式

QueryString 的方式就是使用 ? 来传递参数，例如：

```tsx
#多个参数用 & 连接
/user?name=小满zs&age=18
```

#### [1]. 跳转方式

```tsx
// 声明式导航
<NavLink  to="/about?id=123">About</NavLink> //1. NavLink 跳转
<Link to="/about?id=123">About</Link> //2. Link 跳转

// 编程式导航
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/about?id=123') //3. useNavigate 跳转
```

#### [2]. 获取参数 useSearchParams

```tsx
//1. 获取参数
import { useSearchParams } from "react-router";
const [searchParams, setSearchParams] = useSearchParams();
console.log(searchParams.get("id")); //获取id参数

//2. 获取参数
import { useLocation } from "react-router";
const { search } = useLocation();
console.log(search); //获取search参数 ?id=123
```

### 2. Params 方式

Params 的方式就是使用 :[name] 来传递参数，例如：

```tsx
/user/:id
```

#### [1]. 跳转方式

```tsx
<NavLink to="/user/123">User</NavLink> //1. NavLink 跳转
<Link to="/user/123">User</Link> //2. Link 跳转

import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/user/123') //3. useNavigate 跳转
```

#### [2]. 获取参数 useParams

```tsx
import { useParams } from "react-router";
const { id } = useParams();
console.log(id); //获取id参数
```

### 3. State 方式

state 在 URL 中不显示，但是可以传递参数，例如：

```tsx
/user
```

#### [1]. 跳转方式

```tsx
<Link to="/user" state={{ name: '小满zs', age: 18 }}>User</Link> //1. Link 跳转
<NavLink to="/user" state={{ name: '小满zs', age: 18 }}>User</NavLink> //2. NavLink 跳转

import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/user', { state: { name: '小满zs', age: 18 } }) //3. useNavigate 跳转
```

#### [2]. 获取参数 useLocation

```tsx
import { useLocation } from "react-router";
const { state } = useLocation();

console.log(state); //获取state参数
console.log(state.name); //获取name参数
console.log(state.age); //获取age参数
```

### 4.总结

1. Params 方式 (/user/:id)

- 适用于：传递必要的路径参数（如 ID）
- 特点：符合 RESTful 规范，刷新不丢失
- 限制：只能传字符串，参数显示在 URL 中

2. Query 方式 (/user?name=xiaoman)

- 适用于：传递可选的查询参数
- 特点：灵活多变，支持多参数
- 限制：URL 可能较长，参数公开可见

3. State 方式

- 适用于：传递复杂数据结构
- 特点：支持任意类型数据，参数不显示在 URL
- 限制：刷新可能丢失，不利于分享

选择建议：必要参数用 Params，筛选条件用 Query，临时数据用 State。

## 五、路由懒加载
