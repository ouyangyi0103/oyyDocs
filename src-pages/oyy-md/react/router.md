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

### 1. 基本使用

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

在 React RouterV7 中，是拥有不同的路由模式，路由模式的选择将直接影响你的整个项目。React Router 提供了四种核心路由创建函数：<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createBrowserRouter</span>、<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createHashRouter</span>、<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createMemoryRouter</span> 和 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">createStaticRouter</span>

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

location / {
try_files $uri $uri/ /index.html;
}

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

React-Router V7 的路由种类是非常多的，有嵌套路由、布局路由、索引路由、前缀路由、动态路由

### 1. 嵌套路由

嵌套路由就是父路由中嵌套子路由 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">children</span>，子路由可以继承父路由的布局，也可以有自己的布局。

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "about", element: <About /> }]
  }
]);
```

:::tip

- 父路由的 path 是 index 开始，所以访问子路由的时候需要加上父路由的 path 例如 /index/home /index/about
- 子路由不需要增加 / 了直接写子路由的 path 即可
- 子路由默认是不显示的，需要父路由通过 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">Outlet</span> 组件来显示子路由， <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">Outlet</span> 就是类似于 Vue 的 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">router-view</span> 展示子路由的一个容器
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

索引路由在其父级的 URL 处呈现到其父级的 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">Outlet</span> 中，也就是访问 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">/</span> 的时候，会默认展示 Home 组件。

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

动态路由通过 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">:参数名——比如 :id</span> 语法来定义动态段：

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

QueryString 的方式就是使用 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">?</span> 来传递参数，例如：

多个参数用&连接 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">/user?name=小满&age=18</span>

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

Params 的方式就是使用 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">:id</span> 来传递参数，例如：

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
navigate("/user", { state: { name: "小满zs", age: 18 } });
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

懒加载是一种优化技术，用于延迟加载组件，直到需要时才加载。这样可以减少初始加载时间，提高页面性能。

通过在路由对象中使用 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">lazy</span> 属性来实现懒加载。

使用懒加载打包后，会把懒加载的组件打包成一个独立的文件，从而减小主包的大小。

```tsx
import { createBrowserRouter } from 'react-router';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // 模拟异步请求

const router = createBrowserRouter([
    {
        Component: Layout,{
          path: 'about',
          lazy: async () => {
            await sleep(2000); // 模拟异步请求
            const Component = await import('../pages/About'); // 异步导入组件
            console.log(Component);
            return {
              Component: Component.default,
            }
          }
        },
    },
]);
```

### 1.体验优化

例如 about 是一个懒加载的组件，在切换到 about 路由时，展示的还是上一个路由的组件，直到懒加载的组件加载完成，才会展示新的组件，这样用户会感觉页面卡顿，用户体验不好。

#### [1].使用状态优化 useNavigation

```tsx
import { Outlet, useNavigation } from "react-router";
import { Alert, Spin } from "antd";
export default function Content() {
  const navigation = useNavigation();
  console.log(navigation.state);

  const isLoading = navigation.state === "loading";

  return (
    <div>
      {isLoading ? (
        <Spin size="large" tip="loading...">
          <Alert description="小满zs小满zs小满zs小满zs小满zs小满zs小满zs小满zsv" message="加载中" type="info" />
        </Spin>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
```

## 六、路由操作

路由的操作是由两个部分组成的:

- loader: 用于获取数据，在路由切换时，会自动调用 loader 函数，获取数据，并返回给组件。
- action: 用于提交数据，在路由切换时，会自动调用 action 函数，提交数据，并返回给组件。

### 1.loader

:::tip
只有 GET 请求才会触发 loader，所以适合用来获取数据
:::

在之前的话我们是 RenderComponent 渲染组件 -> Fetch 获取数据 -> RenderView 渲染视图

有了 loader 之后是 loader 通过 fetch 获取数据 -> useLoaderData 获取数据 -> RenderComponent 渲染组件

```tsx
//router/index.tsx
import { createBrowserRouter } from "react-router";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    loader: async () => {
      const data = await response.json();
      const response = await getUser(data);
      // 获取数据;
      return {
        data: response.list,
        message: "success"
      };
    }
  }
]);

//App.tsx
import { useLoaderData } from "react-router";
const App = () => {
  const { data, message } = useLoaderData();
  // 获取数据;
  return <div>{data}</div>;
};
```

### 2.action

一般用于表单提交，删除，修改等操作。

:::tip
只有 POST DELETE PATCH PUT 等请求才会触发 action，所以适合用来提交表单
:::

```tsx
//router/index.tsx
import { createBrowserRouter } from "react-router";
const router = createBrowserRouter([
  {
    // path: '/index',
    Component: Layout,
    children: [
      {
        path: "about",
        Component: About,
        action: async ({ request }) => {
          const formData = await request.formData();
          await createUser(formData);
          return {
            data: table,
            success: true
          };
        }
      }
    ]
  }
]);

//App.tsx
import { useSubmit } from "react-router";
import { Card, Form, Input, Button } from "antd";
export default function About() {
  const submit = useSubmit();
  return (
    <Card>
      <Form
        onFinish={values => {
          submit(values, { method: "post" }); // 提交表单
        }}
      >
        <Form.Item name="name" label="姓名">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="年龄">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    </Card>
  );
}
```

### 3.状态变更

我们可以配合 useNavigation 来管理表单提交的状态

1. GET 提交会经过以下状态:

```tsx
idle -> loading -> idle
```

2. POST 提交会经过以下状态:

```tsx
idle -> submitting ->loading -> idle
```

所以我们可以根据这些状态来控制 disabled loading 等行为

```tsx
import { useNavigation, useSubmit } from "react-router";
const submit = useSubmit();
const navigation = useNavigation();

return (
  <div>
    {navigation.state === "loading" && <div>loading...</div>}
    <button disabled={navigation.state === "submitting"}>提交</button>
  </div>
);
```

## 七、路由导航

### 1.Link

Link 组件是一个用于导航到其他页面的组件，他会被渲染成一个特殊的 `<a>` 标签，跟传统 a 标签不同的是，他不会刷新页面，而是会通过 router 管理路由。

#### [1].使用方法

```tsx
import { Link } from "react-router";

export default function App() {
  return <Link to="/about">About</Link>;
}
```

##### (1).参数

- to：要导航到的路径
- replace：是否替换当前路径
- state：要传递给目标页面的状态
- relative：相对于当前路径的导航方式
- reloadDocument：是否重新加载页面
- preventScrollReset：是否阻止滚动位置重置
- viewTransition：是否启用视图过渡

##### (2).案例

- to

to 属性是一个字符串，表示要导航到的路径。

```tsx
<Link to="/about">About</Link>
```

- replace

replace 属性是一个布尔值，表示是否替换当前路径，如果为 true，则导航不会在浏览器历史记录中创建新的条目，而是替换当前条目。

```tsx
<Link replace to="/about">
  About
</Link>
```

- state

state 属性是一个对象，可以把参数传递给目标页面。

```tsx
<Link state={{ from: "home" }} to="/about">
  About
</Link>;

// 在目标页面获取状态
import { useLocation } from "react-router";

export default function App() {
  const location = useLocation();
  console.log(location.state);
  return <div>Location: {location.state.from}</div>;
}
```

- relative

relative 属性是一个字符串，表示相对于当前路径的导航方式，默认的方式是绝对路径，如果想要使用相对路径，可以设置为 path。

```tsx
//默认是绝对路径
<Link relative="route" to="/about">About</Link>

//使用相对路径
<Link relative="path" to="../about">About</Link>

//例如当前的路由是/index/home，那么使用绝对路径导航到/about，会变成/about
<Link to="/about">About</Link>
//可以使用相对路径导航到/index/about
<Link relative="path" to="../about">About</Link>
```

- reloadDocument

reloadDocument 属性是一个布尔值，表示是否重新加载页面。

```tsx
<Link reloadDocument to="/about">
  About
</Link>
```

- preventScrollReset

preventScrollReset 属性是一个布尔值，表示是否阻止滚动位置重置。

```tsx
<Link preventScrollReset to="/about">
  About
</Link>
```

- viewTransition

viewTransition 属性是一个布尔值，表示是否启用视图过渡，自动增加页面跳转的动画效果。

```tsx
<Link viewTransition to="/about">
  About
</Link>
```

### 2.NavLink

NavLink 的使用方式和 Link 组件类似，但是 NavLink 组件可以实现路由的激活状态。

#### [1].基本使用

```tsx
import { NavLink } from "react-router";

export default function App() {
  return <NavLink to="/about">About</NavLink>;
}
```

#### [2].参数和 Link 参数一样

#### [3].区别

Navlink 会经过以下三个状态的转换，而 Link 不会，所以 Navlink 就是一个 link 的增强版。

- active：激活状态(当前路由和 to 属性匹配)
- pending：等待状态(loader 有数据需要加载)
- transitioning：过渡状态(通过 viewTransition 属性触发)

Navlink 会根据当前路由和 to 属性是否匹配，自动激活。

react-router 会为其自动添加样式

```tsx
a.active {
  color: red;
}

a.pending {
  animate: pulse 1s infinite;
}

a.transitioning {
  /* css transition is running */
}
```

如果不喜欢写样式也可以直接用 style 属性来设置

```tsx
<NavLink
  viewTransition
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      marginRight: "10px",
      color: isActive ? "red" : "blue",
      backgroundColor: isPending ? "yellow" : "transparent"
    };
  }}
  to="/index/about"
>
  About
</NavLink>
```

### 3.编程式导航 useNavigate

```tsx
import { useNavigate } from "react-router";

const navigate = useNavigate();
setTimeout(() => {
  navigate("/home");
}, 1000);
```

#### [1].参数和 Link 组件一样

- 第一个参数: to 跳转的路由 navigate(to)
- 第二个参数: options 配置对象 navigate(to,options)

  - replace: 是否替换当前路由
  - state: 传递的数据
  - relative: 相对路径
  - preventScrollReset: 是否阻止滚动重置

- to

```tsx
import { useNavigate } from "react-router"; // 导入useNavigate
const navigate = useNavigate(); // 获取navigate函数
navigate("/home"); // 跳转路由
```

- options-replace
  跳转页面的时候，是否替换当前路由

```tsx
navigate("/home", { replace: true });
```

- options-state
  传递数据，在跳转的页面中使用通过 useLocation 的 state 属性获取

```tsx
navigate("/home", { state: { name: "张三" } });
```

- options-relative
  跳转的方式，默认是绝对路径，如果想要使用相对路径，需要设置为 relative:'path'

```tsx
navigate("/home", { relative: "path" });
```

- options-preventScrollReset
  跳转页面的时候，是否阻止滚动重置

```tsx
navigate("/home", { preventScrollReset: true });
```

- options-viewTransition
  跳转页面的时候，是否启用视图过渡,自动增加页面跳转的动画效果。

```tsx
navigate("/home", { viewTransition: true });
```

### 4.重定向 redirect

redirect 是用于重定向，通常用于 loader 中，当 loader 返回 redirect 的时候，会自动重定向到 redirect 指定的路由。

权限验证，例如这个路由需要登录才能访问，如果未登录则重定向到登录页。

```tsx
import { redirect } from "react-router";
{
  path: "/home",
  loader: async ({request}) => {
    const isLogin = await checkLogin();
    if(!isLogin) return redirect('/login');
    return {
        data: 'home'
    }
  }
}
```

## 八、边界处理

边界处理包含了错误处理，ErrorBoundary 404 页面等错误处理.

### [1]. 404 页面处理

404 页面指的是当 React-router 路由匹配不到时，显示的页面，例如我们的路由是/home,/about,当你去跳转到一个不存在的路由比如/aaa 时，就会显示 404 页面。 不过 react-router 自带的 404 页面太丑了，更多的时候我们需要自定义 404 页面。

- 使用\*作为通配符，当路由匹配不到时，显示 404 页面
- 使用 Component: NotFound 作为 404 页面组件

```tsx
const router = createBrowserRouter([
  {
    path: "/index",
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
  },
  {
    path: "*", // 通配符，当路由匹配不到时，显示404页面
    Component: NotFound // 404页面组件
  }
]);
```

```tsx
//404.tsx

import { Link } from "react-router";
export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5"
      }}
    >
      <h1 style={{ fontSize: 96, color: "#1890ff", margin: 0 }}>404</h1>
      <p style={{ fontSize: 24, color: "#888", margin: "16px 0 0 0" }}>抱歉，您访问的页面不存在</p>
      <Link
        to="/"
        style={{
          marginTop: 32,
          color: "#1890ff",
          fontSize: 18,
          textDecoration: "underline"
        }}
      >
        返回首页
      </Link>
    </div>
  );
}
```

### [2].ErrorBoundary

ErrorBoundary 是用于捕获路由 loader 或 action 的错误，并进行处理。

如果 loader 或 action 抛出错误，会调用 ErrorBoundary 组件。

```tsx
import NotFound from "../layout/404"; // 404页面组件
import Error from "../layout/error"; // 错误处理组件
const router = createBrowserRouter([
  {
    path: "/index",
    Component: Layout,
    children: [
      {
        path: "home",
        Component: Home,
        ErrorBoundary: Error //如果组件抛出错误，会调用ErrorBoundary组件
      },
      {
        path: "about",
        loader: async () => {
          //throw new Response('Not Found', { status: 404, statusText: 'Not Found' }); 可以返回Response对象
          //也可以返回json等等
          throw {
            message: "Not Found",
            status: 404,
            statusText: "Not Found",
            data: "132131"
          };
        },
        Component: About,
        ErrorBoundary: Error //如果loader或action抛出错误，会调用ErrorBoundary组件
      }
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);
```

```tsx
//error.tsx
import { useRouteError } from "react-router";

export default function Error() {
  const error = useRouteError();
  return <div>{error.message}</div>;
}
```
