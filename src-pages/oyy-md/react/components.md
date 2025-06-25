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

React 组件使用 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">props</span> 来互相通信。每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它。Props 可能会让你想起 HTML 属性，但你可以通过它们传递任何 JavaScript 值，包括对象、数组和函数 以及 html 元素，这样可以使我们的组件更加灵活。

#### [1].父组件向子组件传递数据

父组件向子组件传递数据，需要使用 props 传递。

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

子组件接受父组件传递的 props

props 是一个对象，会作为函数的第一个参数接受传过来的 props 值

<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">注意：我们需要遵守单向数据流，子组件不能直接修改父组件的 props</span>

在 React 源码中会使用 Object.freeze 冻结 props，限制 props 的修改。

Object.freeze 静态方法可以使一个对象被冻结。冻结对象可以防止扩展，并使现有的属性不可写入和不可配置。被冻结的对象不能再被更改：不能添加新的属性，不能移除现有的属性，不能更改它们的可枚举性、可配置性、可写性或值，对象的原型也不能被重新指定

##### 使用泛型

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

#### [2].子组件向父组件传递数据

React 没有像 Vue 那样的 emit 派发事件，所有我们回调函数模拟 emit 派发事件

父组件传递函数过去，其本质就是使用函数的回调，子组件向父组件传递数据，需要使用回调函数。

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

子组件接受函数，并且在对应的事件调用函数，回调参数回去

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

#### [3].默认值的定义

##### 第一种方式 解构

将属性变为可选的这儿使用 title 举例 title?: string

然后将 props 进行解构，定义默认值 {title = '默认标题'}

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

##### 第二种方式 defaultProps

使用 <span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">defaultProps</span> 进行默认值赋值，最后把 defaultProps 和 props 合并，注意顺序要先写 defaultProps，再写 props 因为 props 会覆盖 defaultProps 的值。

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

#### [4].React.FC

React.FC 是函数式组件，是在 TS 使用的一个范型。FC 是 Function Component 的缩写

React.FC 帮助我们自动推导 Props 的类型。

:::warning

注意：在旧版本的 React.FC 是包含 PropsWithChildren 这个声明新版本已经没有了

:::

#### [5].props.children 特殊值

这个功能类似于 Vue 的插槽，直接在子组件内部插入标签会自动一个参数 props.children

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

子组件使用 children 属性

在之前的版本 children 是不需要手动定义的，在 18 之后改为需要手动定义类型

这样就会把父级的 `${<div>123</div>}` 插入子组件的 `${<div>}` 里面

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

#### [6].兄弟组件通信

定义两个组件放到一起作为兄弟组件，其原理就是发布订阅设计模式，发布订阅已经讲过无数次了这里不在阐述，原生浏览器已经实现了这个模式我们可以直接使用。

如果不想使用原生浏览器，可以使用<span style="background-color: #D9E6FF;border-radius: 4px;padding: 4px;color: #4583ED;">mitt</span>

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

第一个兄弟组件 定义事件模型

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

第二个兄弟组件接受事件

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

#### [1].React 受控组件

受控组件一般是指表单元素，表单的数据由 React 的 State 管理，更新数据时，需要手动调用 setState()方法，更新数据。因为 React 没有类似于 Vue 的 v-model，所以需要自己实现绑定事件。

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

#### [2].React 非受控组件

非受控组件指的是该表单元素不受 React 的 State 管理，表单的数据由 DOM 管理。通过 useRef()来获取表单元素的值。

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

#### [3].特殊的表单 File

对于 file 类型的表单控件，它是一个特殊的组件，因为它的值只能由用户通过文件选择操作来设置，而不能通过程序直接设置。这使得它在 React 中的处理方式与其他表单元素有所不同，它只能是非受控组件。
