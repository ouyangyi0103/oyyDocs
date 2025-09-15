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

## 一、组件

### 1.组件通讯

React 组件使用`props`来互相通信。每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它。Props 可能会让你想起 HTML 属性，但你可以通过它们传递任何 JavaScript 值，包括对象、数组和函数 以及 html 元素，这样可以使我们的组件更加灵活。

#### 1.1 父组件向子组件传递数据

`父组件`向`子组件`传递数据，需要使用 `props` 传递。

```tsx
// 父组件
export default function App() {
  return <Card title="标题1" content="内容"></Card>;
}

// 子组件
function Card(props) {
  // 通过props接收父组件传递的数据
  return <div>{props.title}</div>;
}
```

子组件接受父组件传递的 props，props 是一个对象，会作为函数的第一个参数接受传过来的 props 值，<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">注意：我们需要遵守单向数据流，子组件不能直接修改父组件的 props</span>

在 React 源码中会使用`Object.freeze` 冻结 props，限制 props 的修改。

`Object.freeze` 静态方法可以使一个对象被冻结。冻结对象可以防止扩展，并使现有的属性不可写入和不可配置。被冻结的对象不能再被更改：不能添加新的属性，不能移除现有的属性，不能更改它们的可枚举性、可配置性、可写性或值，对象的原型也不能被重新指定

##### 1.2 使用泛型

```tsx
import React from "react";
interface Props {
  title: string;
  id: number;
  obj: {
    a: number;
    b: number;
  };
  arr: number[];
  cb: (a: number, b: number) => number;
  empty: null;
  element: JSX.Element;
}

// 第一种写法
const Test = (props: Props) => {
  console.log(props);
  return <div>Test</div>;
};

// 第二种写法
// React.FC 是 React.FunctionComponent 的缩写，表示一个函数组件
const Test: React.FC<Props> = props => {
  console.log(props);
  return <div>Test</div>;
};

export default Test;
```

#### 1.3 子组件向父组件传递数据

React 没有像 Vue 那样的 emit 派发事件，但我们可以使用回调函数模拟 emit 派发事件

- 父组件传递函数过去，其本质就是使用函数的回调，子组件向父组件传递数据，需要使用回调函数。

```tsx
// 父组件
import Test from "./components/Test";
function App() {
  const fn = (params: string) => {
    console.log("子组件触发了 父组件的事件", params);
  };
  return (
    <>
      <Test callback={fn}></Test>
    </>
  );
}
```

- 子组件接受函数，并且在对应的事件调用函数，回调参数回去

```tsx
// 子组件
import React from "react";
interface Props {
  callback: (params: string) => void;
  children?: React.ReactNode;
}

const Test: React.FC<Props> = props => {
  return (
    <div>
      <button onClick={() => props.callback("我见过龙")}>派发事件</button>
    </div>
  );
};

export default Test;
```

#### 1.4 默认值的定义

##### 1.4.1 第一种方式 解构

将属性变为可选的 `title?: string`

然后将 props 进行解构，定义默认值 `{title = '默认标题'}`

```tsx
import React from "react";
interface Props {
  title?: string;
  id: number;
  obj: {
    a: number;
    b: number;
  };
  arr: number[];
  cb: (a: number, b: number) => number;
  empty: null;
  element: JSX.Element;
}

const Test: React.FC<Props> = ({ title = "默认标题" }) => {
  return <div>Test</div>;
};

export default Test;
```

##### 1.4.2 第二种方式 defaultProps

使用`defaultProps`进行默认值赋值，最后把 defaultProps 和 props 合并，注意顺序要先写 defaultProps，再写 props， 因为 props 会覆盖 defaultProps 的值。

```tsx
import React from "react";
interface Props {
  title?: string;
  id: number;
  obj: {
    a: number;
    b: number;
  };
  arr: number[];
  cb: (a: number, b: number) => number;
  empty: null;
  element: JSX.Element;
}

const defaultProps: Partial<Props> = {
  title: "默认标题"
};

const Test: React.FC<Props> = props => {
  const { title } = { ...defaultProps, ...props };
  return <div>{title}</div>;
};

export default Test;
```

#### 1.5 React.FC

`React.FC` 是函数式组件，是在 TS 使用的一个范型。FC 是 Function Component 的缩写，React.FC 帮助我们自动推导 Props 的类型。

:::warning

注意：在旧版本的 React.FC 是包含 PropsWithChildren 这个声明新版本已经没有了

:::

#### 1.6 props.children 特殊值

这个功能类似于 Vue 的插槽，直接在子组件内部插入内容

```tsx
function App() {
  return (
    <>
      <Test>
        <div>123</div>
      </Test>
    </>
  );
}
```

子组件使用 children 属性，在之前的版本 children 是不需要手动定义的，在 18 之后改为需要手动定义类型，这样就会把父级的 `<div>123</div>` 插入子组件的里面

```tsx
import React from "react";
interface Props {
  children: React.ReactNode; //手动声明children
}

const Test: React.FC<Props> = props => {
  return <div>{props.children}</div>;
};

export default Test;
```

#### 1.7 兄弟组件通信

定义两个组件放到一起作为兄弟组件，其原理就是发布订阅设计模式，原生浏览器已经实现了这个模式我们可以直接使用。如果不想使用原生浏览器，可以使用`mitt`。

```tsx
import Card from "./components/Card";
import Test from "./components/Test";
function App() {
  return (
    <>
      <Test></Test>
      <Card></Card>
    </>
  );
}

export default App;
```

- 第一个兄弟组件 定义事件模型

```tsx
import React from "react";
const Test: React.FC = props => {
  const event = new Event("on-card"); //添加到事件中心
  const clickTap = () => {
    console.log(event);
    event.params = { name: "我见过龙" };
    window.dispatchEvent(event); //派发事件
  };
  return (
    <div>
      <button onClick={clickTap}>派发事件</button>
    </div>
  );
};
//扩充event类型
declare global {
  interface Event {
    params: any;
  }
}

export default Test;
```

- 第二个兄弟组件接受事件

```tsx
import "./index.css";
export default function Test2() {
  //接受参数
  window.addEventListener("on-card", e => {
    console.log(e.params, "触发了");
  });

  return <div className="card"></div>;
}
```

### 2.受控组件与非受控组件

#### 2.1 React 受控组件

受控组件一般是指`表单元素`，表单的数据由`React的State管理`，更新数据时，需要手动调用 setState()方法，更新数据。因为 React 没有类似于 Vue 的 v-model，所以需要自己实现绑定事件。

##### 那为什么需要使用受控组件呢？

使用受控组件可以确保表单数据与组件状态同步、便于集中管理和验证数据，同时提供灵活的事件处理机制以实现数据格式化和 UI 联动效果。

```tsx
import React, { useState } from "react";

const App: React.FC = () => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <>
      <input type="text" value={value} onChange={handleChange} />
      <div>{value}</div>
    </>
  );
};

export default App;
```

其实就是实现了一个类似 Vue 的 v-model 的机制，通过 onChange 事件来更新 value，这样就实现了受控组件。

:::danger

受控组件适用于所有表单元素，包括 input、textarea、select 等。但是除了 input type="file" 外，其他表单元素都推荐使用受控组件。

:::

#### 2.2 React 非受控组件

`非受控组件`指的是该表单元素不受 React 的 State 管理，表单的`数据由DOM管理`。通过 useRef()来获取表单元素的值。

我们使用 defaultValue 来设置表单的默认值，但是你要想实时获取值，就需要使用 useRef()来获取表单元素的值。跟操作 DOM 一样。

```tsx
import React, { useState, useRef } from "react";
const App: React.FC = () => {
  const value = "小满";
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <>
      <input type="text" onChange={handleChange} defaultValue={value} ref={inputRef} />
    </>
  );
};

export default App;
```

#### 2.3 特殊的表单 File

对于 file 类型的表单控件，它是一个特殊的组件，因为它的值只能由用户通过文件选择操作来设置，而不能通过程序直接设置。这使得它在 React 中的处理方式与其他表单元素有所不同，它只能是非受控组件。

### 3.异步组件 Suspense

`Suspense` 是一种异步渲染机制，其核心理念是在组件加载或数据获取过程中，先展示一个占位符（loading state），从而实现更自然流畅的用户界面更新体验。

#### 3.1 Suspense 的基本使用

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>
```

#### 3.2 应用场景

- 异步组件加载：通过代码分包实现组件的按需加载，有效减少首屏加载时的资源体积，提升应用性能。
- 异步数据加载：在数据请求过程中展示优雅的过渡状态（如 loading 动画、骨架屏等），为用户提供更流畅的交互体验。
- 异步图片资源加载：智能管理图片资源的加载状态，在图片完全加载前显示占位内容，确保页面布局稳定，提升用户体验。

#### 3.3 案例

创建一个异步组件

- src/components/Async/index.tsx

```tsx
export const AsyncComponent = () => {
  return <div>Async</div>;
};

export default AsyncComponent;
```

- src/App.tsx
  使用`lazy`进行异步加载组件，使用`Suspense`包裹异步组件，`fallback`指定加载过程中的占位组件

```tsx
import React, { useRef, useState, Suspense, lazy } from "react";
const AsyncComponent = lazy(() => import("./components/Async"));
const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div>loading</div>}>
        <AsyncComponent />
      </Suspense>
    </>
  );
};

export default App;
```

##### 3.3.1 异步数据加载

我们实现卡片详情，在数据加载过程中展示骨架屏，数据加载完成后展示卡片详情。

- public/data.json.

```json
{
  "data": {
    "id": 1,
    "address": "北京市房山区住岗子村10086",
    "name": "小满",
    "age": 26,
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=小满"
  }
}
```

创建一个骨架屏组件，用于在数据加载过程中展示，提升用户体验,当然你封装 loading 组件也是可以的。

- src/components/skeleton/index.tsx

```tsx
import "./index.css";
export const Skeleton = () => {
  return (
    <div className="skeleton">
      <header className="skeleton-header">
        <div className="skeleton-name"></div>
        <div className="skeleton-age"></div>
      </header>
      <section className="skeleton-content">
        <div className="skeleton-address"></div>
        <div className="skeleton-avatar"></div>
      </section>
    </div>
  );
};
```

:::tip
建议升级到 React19, 因为我们会用到一个 use 的 API, 这个 API 在 React18 中是实验性特性，在 React19 纳入正式特性
:::

创建一个卡片组件，用于展示数据，这里面介绍一个新的 API `use`，它用于获取组件内部的 Promise，或者 Context 的内容，该案例使用了 use 获取 Promise 返回的数据并且故意延迟 2 秒返回，模拟网络请求。

- src/components/Card/index.tsx

```tsx
import { use } from "react";
import "./index.css";
interface Data {
  name: string;
  age: number;
  address: string;
  avatar: string;
}

const getData = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return (await fetch("http://localhost:5173/data.json").then(res => res.json())) as { data: Data };
};

const dataPromise = getData();

const Card: React.FC = () => {
  const { data } = use(dataPromise);
  return (
    <div className="card">
      <header className="card-header">
        <div className="card-name">{data.name}</div>
        <div className="card-age">{data.age}</div>
      </header>
      <section className="card-content">
        <div className="card-address">{data.address}</div>
        <div className="card-avatar">
          <img width={50} height={50} src={data.avatar} alt="" />
        </div>
      </section>
    </div>
  );
};

export default Card;
```

使用方式如下: 通过 Suspense 包裹 Card 组件，fallback 指定骨架屏组件

- src/App.tsx

```tsx
import React, { useRef, useState, Suspense, lazy } from "react";
import Card from "./components/Card";
import { Skeleton } from "./components/Skeleton";
const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <Card />
      </Suspense>
    </>
  );
};

export default App;
```

### 4.传送 API createPortal

注意这是一个 API，不是组件，他的作用是：将一个组件渲染到 DOM 的任意位置，跟 Vue 的`Teleport`组件类似。

#### 4.1 基本使用

```tsx
// 注意：createPortal 是 react-dom 中的 API，不是 react 中的 API
import { createPortal } from "react-dom";

const App = () => {
  return createPortal(<div>小满zs</div>, document.body);
};

export default App;
```

#### 4.2 应用场景

- 弹窗
- 下拉框
- 全局提示
- 全局遮罩
- 全局 Loading

#### 4.3 案例

封装弹框组件

- src/components/Modal/index.tsx

```tsx
import "./index.css";
export const Modal = () => {
  return (
    <div className="modal">
      <div className="modal-header">
        <div className="modal-title">标题</div>
      </div>
      <div className="modal-content">
        <h1>Modal</h1>
      </div>
      <div className="modal-footer">
        <button className="modal-close-button">关闭</button>
        <button className="modal-confirm-button">确定</button>
      </div>
    </div>
  );
};
```

如果外层有 position: relative 的样式，那么弹框会相对于外层进行定位，如果外层没有 position: relative 的样式，那么弹框会相对于 body 进行定位,故此这个 Modal 不稳定，所以需要使用 createPortal 来将 Modal 挂载到 body 上，或者直接将定位改成 position: fixed,两种方案。

- 方案一：使用 createPortal

```tsx
import "./index.css";
import { createPortal } from "react-dom";
export const Modal = () => {
  return createPortal(
    <div className="modal">
      <div className="modal-header">
        <div className="modal-title">标题</div>
      </div>
      <div className="modal-content">
        <h1>Modal</h1>
      </div>
      <div className="modal-footer">
        <button className="modal-close-button">关闭</button>
        <button className="modal-confirm-button">确定</button>
      </div>
    </div>,
    document.body
  );
};
```

- 方案二：使用 position: fixed

#### 注意事项

推荐使用 createPortal 因为他更灵活，可以挂载到任意位置，而 position: fixed,会有很多问题，在默认的情况下他是根据浏览器视口进行定位的，但是如果父级设置了 transform、perspective、filter 或 backdrop-filter 属性非 none 时，他就会相对于父级进行定位，这样就会导致 Modal 组件定位不准确(他不是一定按照浏览器视口进行定位)，所以不推荐使用。

### 5.HOC 高阶组件

#### 5.1 什么是高阶组件？

高阶组件就是一个组件，它接受另一个组件作为参数，并返回一个新的组件

#### 5.2 使用方法

:::tip

- HOC 不会修改传入的组件，而是使用组合的方式，通过将原组件包裹在一个容器组件中来实现功能扩展
- 注意避免多层嵌套，一般 HOC 的嵌套层级不要超过 3 层
- HOC 的命名规范：with 开头，如 withLoading、withAuth 等
  :::

#### 5.3 案例

- 案例一

```tsx
enum Role {
  ADMIN = "admin",
  USER = "user"
}
const withAuthorization = (role: Role) => (Component: React.FC) => {
  // 判断是否具有权限的函数
  const isAuthorized = (role: Role) => {
    return role === Role.ADMIN;
  };
  return (props: any) => {
    // 判断是否具有权限
    if (isAuthorized(role)) {
      //把props透传给组件
      return <Component {...props} />;
    } else {
      // 没有权限则返回一个提示
      return <div>抱歉，您没有权限访问该页面</div>;
    }
  };
};

const AdminPage = withAuthorization(Role.ADMIN)(() => {
  return <div>管理员页面</div>; //有权限输出
});

const UserPage = withAuthorization(Role.USER)(() => {
  return <div>用户页面</div>; //没有权限不输出
});
```

- 案例二
  封装一个通用的 HOC，实现埋点统计，比如点击事件，页面挂载，页面卸载等。

封装一个埋点服务可以根据自己的业务自行扩展

- trackType 表示发送埋点的组件类型
- data 表示发送的数据
- eventData 表示需要统计的用户行为数据
- navigator.sendBeacon 是浏览器提供的一种安全可靠的异步数据传输方式，适合发送少量数据，比如埋点数据，并且浏览器关闭时，数据也会发送，不会阻塞页面加载

```tsx
const trackService = {
  sendEvent: <T,>(trackType: string, data: T = null as T) => {
    const eventData = {
      timestamp: Date.now(), // 时间戳
      trackType, // 事件类型
      data, // 事件数据
      userAgent: navigator.userAgent, // 用户代理
      url: window.location.href // 当前URL
    };
    //发送数据
    navigator.sendBeacon("http://localhost:5173", JSON.stringify(eventData));
  }
};
```

实现 HOC 高阶组件,通过 useEffect 统计组件挂载和卸载，并且封装一个 trackEvent 方法，传递给子组件，子组件可以自行调用，统计用户行为。

```tsx
const withTrack = (Component: React.ComponentType<any>, trackType: string) => {
  return (props: any) => {
    useEffect(() => {
      //发送数据 组件挂载
      trackService.sendEvent(`${trackType}-MOUNT`);
      return () => {
        //发送数据 组件卸载
        trackService.sendEvent(`${trackType}-UNMOUNT`);
      };
    }, []);

    //处理事件
    const trackEvent = (eventType: string, data: any) => {
      trackService.sendEvent(`${trackType}-${eventType}`, data);
    };

    return <Component {...props} trackEvent={trackEvent} />;
  };
};
```

使用 HOC 高阶组件,注册了一个 button 按钮，并传递了 trackEvent 方法，子组件可以自行调用，统计用户行为。

```tsx
const Button = ({ trackEvent }) => {
  // 点击事件
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackEvent(e.type, {
      name: e.type,
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY
    });
  };

  return <button onClick={handleClick}>我是按钮</button>;
};
// 使用HOC高阶组件
const TrackButton = withTrack(Button, "button");
// 使用组件
const App = () => {
  return (
    <div>
      <TrackButton />
    </div>
  );
};

export default App;
```
