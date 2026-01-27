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

## 一、数据驱动

### 1.useState

`useState` 是一个 React Hook，允许函数组件在内部管理状态。

组件通常需要根据交互更改屏幕上显示的内容，例如点击某个按钮更改值，或者输入文本框中的内容，这些值被称为状态值也就是(state)。

#### 1.1 使用方法

`useState` 接收一个参数，即状态的初始值，然后返回一个数组，其中包含两个元素：当前的状态值和一个更新该状态的函数

```tsx
const [state, setState] = useState(initialState);
```

#### 1.2 注意事项

::: danger 注意
useState 是一个 Hook，因此你只能在 组件的顶层 或自己的 Hook 中调用它。你不能在循环或条件语句中调用它。

在严格模式中，React 将 两次调用初始化函数，以 帮你找到意外的不纯性。这只是开发时的行为，不影响生产
:::

#### 1.3 用法

```tsx
const Card = () => {
  let [index, setIndex] = useState(0);
  let [name, setName] = useState("小满");
  let [arr, setArr] = useState([1, 2, 3]);
};
```

按照惯例使用 数组解构 来命名状态变量，例如 [index, setIndex]。

useState 返回一个只包含两个项的数组：

1. 该状态变量 当前的 state，最初设置为你提供的 初始化 state。
2. set 函数，它允许你在响应交互时将 state 更改为任何其他值。

要更新屏幕上的内容，请使用新状态调用 set 函数：

::: tip 提示
调用 set 函数更新 state 将会重新渲染组件。
:::

```tsx
function changeName() {
  setName("大满");
}
```

React 会存储新状态，使用新值`重新渲染组件`，并更新 UI。

#### 1.4 完整版案例(基本数据类型)

```tsx
import { useState } from "react";
function App() {
  let [name, setName] = useState("小满"); //数字 布尔值 null undefined 都可以直接赋值 一样的
  const heandleClick = () => {
    setName("大满");
  };
  return (
    <>
      <button onClick={heandleClick}>更改名称</button>
      <div>{name}</div>
    </>
  );
}
export default App;
```

#### 1.5 完整版案例(复杂数据类型)

##### 1.5.1 数组

在 React 中你需要将`数组视为只读的`，`不可以直接修改原数组`，例如：不可以调用 `arr.push()` `arr.pop()` 等方法。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

| 避免使用 (会改变原始数组)          |    推荐使用 (会返回一个新数组)    |
| :--------------------------------- | :-------------------------------: |
| 添加元素 push，unshift             | concat，[...arr] 展开语法（例子） |
| 删除元素 pop，shift，splice        |       filter，slice（例子）       |
| 替换元素 splice，arr[i] = ... 赋值 |            map（例子）            |
| 排序 reverse，sort                 |     先将数组复制一份（例子）      |

###### 1.5.1-1 数组新增数据

创建一个新数组，包含了原始数组的所有元素，然后在末尾添加新元素，如果想在头部添加新元素，返过来即可。

```tsx
import { useState } from "react";
function App() {
  let [arr, setArr] = useState([1, 2, 3]);
  const heandleClick = () => {
    setArr([...arr, 4]); //末尾新增 扩展运算符
    //setArr([0,...arr]) 头部新增 扩展运算符
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div id="aaa">{arr}</div>
    </>
  );
}
export default App;
```

###### 1.5.1-2 数组删除数据

使用 filter 过滤掉不需要的元素即可。

```tsx
import { useState } from "react";
function App() {
  let [arr, setArr] = useState([1, 2, 3]);
  const heandleClick = () => {
    setArr(arr.filter(item => item !== 1)); //删除指定元素
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div id="aaa">{arr}</div>
    </>
  );
}
export default App;
```

###### 1.5.1-3 数组替换数据

使用 map 筛选出需要替换的元素，然后替换为新的元素，其他元素保持不变。

```tsx
import { useState } from "react";
function App() {
  let [arr, setArr] = useState([1, 2, 3]);
  const heandleClick = () => {
    setArr(
      arr.map(item => {
        return item == 2 ? 666 : item;
      })
    );
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div id="aaa">{arr}</div>
    </>
  );
}
export default App;
```

###### 1.5.1-4 指定位置插入元素

案例在 2 后面插入 2.5，通过 slice，截取前面的元素，因为 slice 返回一个新的数组，然后在中间插入我们需要插入的元素，然后把末尾的元素也通过 slice 截取出来，拼接到后面。

```tsx
import { useState } from "react";
function App() {
  let [arr, setArr] = useState([1, 2, 3]);
  const heandleClick = () => {
    let startIndex = 0;
    let endIndex = 2;
    setArr([...arr.slice(startIndex, endIndex), 2.5, ...arr.slice(endIndex)]);
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div id="aaa">{arr}</div>
    </>
  );
}
export default App;
```

###### 1.5.1-5 排序旋转等

案例，创建一个新数组，然后通过 sort 排序。

```tsx
import { useState } from "react";
function App() {
  let [arr, setArr] = useState([1, 2, 3]);
  const heandleClick = () => {
    let newList = [...arr].map(v => v + 1); //拷贝到新数组
    newList.sort((a, b) => b - a);
    //newList.reverse()旋转
    setArr(newList);
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div id="aaa">{arr}</div>
    </>
  );
}
export default App;
```

##### 1.5.2 对象

useState 可以接受一个函数，可以在函数里面编写逻辑，初始化值，注意这个只会执行一次，更新的时候就不会执行了。

在使用 setObject 的时候，可以使用 `Object.assign` 合并对象 或者 `...` 合并对象，不能单独赋值，不然会覆盖原始对象。

```tsx
import { useState } from "react";
function App() {
  let [obj, setObject] = useState(() => {
    const date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
    return {
      date,
      name: "小满",
      age: 25
    };
  });
  const heandleClick = () => {
    setObject({
      ...obj,
      name: "大满"
    });
    //setObject(Object.assign({}, obj, { age: 26 })) 第二种写法
  };
  return (
    <>
      <button onClick={heandleClick}>更改值</button>
      <div>日期：{obj.date}</div>
      <div>姓名：{obj.name}</div>
      <div>年龄：{obj.age}</div>
    </>
  );
}
export default App;
```

#### 1.6 useState 更新机制

##### 1.6.1 异步机制

useState 的`set`函数是异步更新的，来看下面的案例：

```tsx
import { useState } from "react";
function App() {
  let [index, setIndex] = useState(0);
  const heandleClick = () => {
    setIndex(index + 1);
    console.log(index, "index"); //0
  };
  return (
    <>
      <h1>Index:{index}</h1>
      <button onClick={heandleClick}>更改值</button>
    </>
  );
}
export default App;
```

此时 console.log(index, "index"); 应该打印 1，但是还是 0，因为我们正常编写的代码是同步的，所以会先执行，而 set 函数是异步的所以后执行，这么做是为了性能优化，因为我们要的是结果而不是过程。

##### 1.6.2 内部机制

当我们多次以相同的操作更新状态时，React 会进行比较，如果值相同，则会屏蔽后续的更新行为。自带防抖的功能，防止频繁的更新。
也就是说异步的设计就是为了性能优化，因为调用 set 函数会触发组件的重新渲染，作为异步，只在最后一次调用进行状态的更改，不去频繁的去进行页面的重新渲染。

案例：

```tsx
import { useState } from "react";
function App() {
  let [index, setIndex] = useState(0);
  const heandleClick = () => {
    setIndex(index + 1); //1
    setIndex(index + 1); //1
    setIndex(index + 1); //1
    console.log(index, "index");
  };
  return (
    <>
      <h1>Index:{index}</h1>
      <button onClick={heandleClick}>更改值</button>
    </>
  );
}
export default App;
```

**点击一次时：**

页面上显示的 Index 结果是 1 并不是 3，因为 setIndex(index + 1)的值是一样的，后续操作被屏蔽掉了，阻止了更新。

为了解决这个问题，你可以向 setIndex 传递一个`更新函数`，而不是一个`状态`。

```tsx
import { useState } from "react";
function App() {
  let [index, setIndex] = useState(0);
  const heandleClick = () => {
    setIndex(index => index + 1); //1
    setIndex(index => index + 1); //2
    setIndex(index => index + 1); //3
  };
  return (
    <>
      <h1>Index:{index}</h1>
      <button onClick={heandleClick}>更改值</button>
    </>
  );
}
export default App;
```

**点击一次时：**

1. index => index + 1 将接收 0 作为待定状态，并返回 1 作为下一个状态。
2. index => index + 1 将接收 1 作为待定状态，并返回 2 作为下一个状态。
3. index => index + 1 将接收 2 作为待定状态，并返回 3 作为下一个状态。

现在没有其他排队的更新，因此 React 最终将存储 3 作为当前状态，页面显示为 Index:3。

按照惯例，通常将待定状态参数命名为状态变量名称的第一个字母，例如 prevIndex 或者其他你觉得更清楚的名称。

### 2.useReducer

`useReducer` 是 React 提供的一个高级 Hook,没有它我们也可以正常开发，但是 `useReducer` 可以使我们的代码具有更好的可读性，可维护性。

`useReducer` 跟 `useState` 一样的都是帮我们管理组件的状态的，但 `useReducer` 是`集中式的管理状态的`。

#### 2.1 使用方法

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

#### 2.2 参数

- **reducer:** 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 state，第二个参数是 action。reducer 会返回一个新的 state。

- **initialArg:** 是 state 的初始值。

- **init:** 是一个可选的函数，用于初始化 state，如果编写了 init 函数，则默认值使用 init 函数的返回值，否则使用 initialArg。

#### 2.3 返回值

useReducer 返回一个由两个值组成的数组：

当前的 state。初次渲染时，它是 init(initialArg) 或 initialArg （如果没有 init 函数）。 dispatch 函数。用于更新 state 并触发组件的重新渲染。

```tsx
import { useReducer } from "react";
//根据旧状态进行处理 oldState，处理完成之后返回新状态 newState
//reducer 只有被dispatch的时候才会被调用 刚进入页面的时候是不会执行的
//oldState 任然是只读的
function reducer(oldState, action) {
  if (action.type === "ADD_AGE") {
    return { ...oldState, age: oldState.age + 1 };
  } else if (action.type === "ADD_NAME") {
    return { ...oldState, name: oldState.name + "大满" };
  }
  return oldState;
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42, name: "小满" });
  return (
    <>
      <div>年龄：{state.age}</div>
      <div>姓名：{state.name}</div>
      <button onClick={() => dispatch({ type: "ADD_AGE" })}>增加年龄</button>
      <button onClick={() => dispatch({ type: "ADD_NAME" })}>增加姓名</button>
    </>
  );
}
export default MyComponent;
```

#### 2.4 案例

- 初始数据 (initData):

```tsx
const initData = [
  { name: "小满(只)", price: 100, count: 1, id: 1, isEdit: false },
  { name: "中满(只)", price: 200, count: 1, id: 2, isEdit: false },
  { name: "大满(只)", price: 300, count: 1, id: 3, isEdit: false }
];
```

- 类型定义 (List 和 Action):

```tsx
type List = typeof initData;
interface Action {
  type: "ADD" | "SUB" | "DELETE" | "EDIT" | "UPDATE_NAME";
  id: number;
  newName?: string;
}
```

- Reducer 函数 (reducer):

```tsx
function reducer(state: List, action: Action) {
  const item = state.find(item => item.id === action.id)!;
  switch (action.type) {
    case "ADD":
      item.count++;
      return [...state];
    case "SUB":
      item.count--;
      return [...state];
    case "DELETE":
      return state.filter(item => item.id !== action.id);
    case "EDIT":
      item.isEdit = !item.isEdit;
      return [...state];
    case "UPDATE_NAME":
      item.name = action.newName!;
      return [...state];
    default:
      return state;
  }
}
```

- App 组件:

```tsx
function App() {
  let [data, dispatch] = useReducer(reducer, initData);
  return (
    <>
      <table cellPadding={0} cellSpacing={0} width={600} border={1}>
        <thead>
          <tr>
            <th>物品</th>
            <th>价格</th>
            <th>数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            return (
              <tr key={item.id}>
                <td align="center">
                  {item.isEdit ? (
                    <input
                      onBlur={e => dispatch({ type: "EDIT", id: item.id })}
                      onChange={e => dispatch({ type: "UPDATE_NAME", id: item.id, newName: e.target.value })}
                      value={item.name}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </td>
                <td align="center">{item.price * item.count}</td>
                <td align="center">
                  <button onClick={() => dispatch({ type: "SUB", id: item.id })}>-</button>
                  <span>{item.count}</span>
                  <button onClick={() => dispatch({ type: "ADD", id: item.id })}>+</button>
                </td>
                <td align="center">
                  <button onClick={() => dispatch({ type: "EDIT", id: item.id })}>编辑</button>
                  <button onClick={() => dispatch({ type: "DELETE", id: item.id })}>删除</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}></td>
            <td align="center">总价:{data.reduce((prev, next) => prev + next.price * next.count, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
```

### 3.useSyncExternalStore

`useSyncExternalStore` 是 React 18 引入的一个 Hook，用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。`这对于需要跟踪外部状态的应用非常有用。

#### 3.1 场景

1. 订阅外部 store 例如(redux,Zustand 德语)
2. 订阅浏览器 API 例如(online,storage,location)等
3. 抽离逻辑，编写自定义 hooks
4. 服务端渲染支持

#### 3.2 使用方法

```tsx
const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- **subscribe:** 用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。

- **getSnapshot:** 获取当前数据源的快照（当前状态）。

- **getServerSnapshot?:** 在服务器端渲染时用来获取数据源的快照。

#### 3.3 案例

##### 3.3.1 订阅浏览器 Api 实现自定义 hook(useStorage)

我们实现一个 useStorage Hook，用于订阅 localStorage 数据。这样做的好处是，我们可以确保组件在 localStorage 数据发生变化时，自动更新同步。

我们将创建一个 useStorage Hook，能够存储数据到 localStorage，并在不同浏览器标签页之间同步这些状态。此 Hook 接收一个键值参数用于存储数据的键名，还可以接收一个默认值用于在无数据时的初始化。

- 在 hooks/useStorage.ts 中定义 useStorage Hook：

```tsx
import { useSyncExternalStore } from "react";

/**
 * @param key 存储到localStorage 的key
 * @param defaultValue 默认值
 */
export const useStorage = (key: any, defaultValue?: any) => {
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", e => {
      console.log("触发了", e);
      callback();
    });
    return () => window.removeEventListener("storage", callback);
  };
  //从localStorage中获取数据 如果读不到返回默认值
  const getSnapshot = () => {
    return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null) || defaultValue;
  };
  //修改数据
  const setStorage = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("storage")); //手动触发storage事件
  };
  //返回数据
  const res = useSyncExternalStore(subscribe, getSnapshot);

  return [res, setStorage];
};
```

在 App.tsx 中，我们可以直接使用 useStorage，来实现一个简单的计数器。值会存储在 localStorage 中，并且在刷新或其他标签页修改数据时自动更新。

```tsx
import { useStorage } from "./hooks/useStorage";
const App = () => {
  const [val, setVal] = useStorage("data", 1);
  return (
    <>
      <h3>{val}</h3>
      <button onClick={() => setVal(val + 1)}>设置val</button>
    </>
  );
};

export default App;
```

效果演示

值的持久化：点击按钮增加 val，页面刷新后依然会保留最新值。
跨标签页同步：在多个标签页打开该应用时，任意一个标签页修改 val，其他标签页会实时更新，保持同步状态。

##### 3.3.2 订阅 history 实现路由跳转

- 实现一个简易的 useHistory Hook，获取浏览器 url 信息 + 参数

```tsx
import { useSyncExternalStore } from "react";
export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    window.addEventListener("popstate", callback);
    window.addEventListener("hashchange", callback);
    return () => {
      window.removeEventListener("popstate", callback);
      window.removeEventListener("hashchange", callback);
    };
  };
  const getSnapshot = () => {
    return window.location.href;
  };
  const push = (path: string) => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const replace = (path: string) => {
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const res = useSyncExternalStore(subscribe, getSnapshot);
  return [res, push, replace] as const;
};
```

- 使用 useHistory Hook

让我们在组件中使用这个 useHistory Hook，实现基本的前进、后退操作以及程序化导航。

```tsx
import { useHistory } from "./hooks/useHistory";
const App = () => {
  const [history, push, replace] = useHistory();
  return (
    <>
      <div>当前url:{history}</div>
      <button
        onClick={() => {
          push("/aaa");
        }}
      >
        跳转
      </button>
      <button
        onClick={() => {
          replace("/bbb");
        }}
      >
        替换
      </button>
    </>
  );
};

export default App;
```

效果演示

history：这是 useHistory 返回的当前路径值。每次 URL 变化时，useSyncExternalStore 会自动触发更新，使 history 始终保持最新路径。

push 和 replace：点击“跳转”按钮调用 push("/aaa")，会将 /aaa 推入历史记录；点击“替换”按钮调用 replace("/bbb")，则会将当前路径替换为 /bbb。

::: warning
如果 getSnapshot 返回值不同于上一次，React 会重新渲染组件。这就是为什么，如果总是返回一个不同的值，会进入到一个无限循环，并产生这个报错。

Uncaught (in promise) Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside
componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

```tsx
function getSnapshot() {
  return myStore.todos; //object
}
```

这种写法每次返回了对象的引用，即使这个对象没有改变，React 也会重新渲染组件。

如果你的 store 数据是可变的，getSnapshot 函数应当返回一个它的不可变快照。这意味着 确实 需要创建新对象，但不是每次调用都如此。
而是应当保存最后一次计算得到的快照，并且在 store 中的数据不变的情况下，返回与上一次相同的快照。如何决定可变数据发生了改变则取决于你的可变 store。

```tsx
function getSnapshot() {
  if (myStore.todos !== lastTodos) {
    // 只有在 todos 真的发生变化时，才更新快照
    lastSnapshot = { todos: myStore.todos.slice() };
    lastTodos = myStore.todos;
  }
  return lastSnapshot;
}
```

:::

### 4.useTransition

useTransition 是 React 18 中引入的一个 Hook，用于管理 UI 中的过渡状态，特别是在处理长时间运行的状态更新时。它允许你将某些更新标记为`过渡`状态，
这样 React 可以优先处理更重要的更新，比如用户输入，同时延迟处理过渡更新。

#### 4.1 使用方法

```tsx
const [isPending, startTransition] = useTransition();
```

#### 4.2 参数

useTransition 不需要任何参数

#### 4.3 返回值

`useTransition` 返回一个数组,包含两个元素

- **isPending(boolean)** 告诉你是否存在待处理的 transition。
- **startTransition(function)** 函数，你可以使用此方法将状态更新标记为 transition。

#### 4.4 优先级

(一般) 不是很重要，因为在实际工作中应用较少

#### 4.5 案例

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import type { Plugin } from "vite";
import mockjs from "mockjs"; // 模拟数据
import url from "node:url"; // 解析url

// 创建vite插件
const viteMockServer = (): Plugin => {
  return {
    // 插件名称
    name: "vite-mock-server",
    //使用vite插件的钩子函数
    configureServer(server) {
      server.middlewares.use("/api/list", async (req, res) => {
        const parsedUrl = url.parse(req.originalUrl, true);
        //获取url参数 true表示返回对象 {keyWord: 'xx'}
        const query = parsedUrl.query;
        res.setHeader("Content-Type", "application/json");
        const data = mockjs.mock({
          //返回1000条数据
          "list|1000": [
            {
              "id|+1": 1, //id自增
              "name": query.keyWord, //name为url参数中的keyWord
              "address": "@county(true)" //address为随机地址
            }
          ]
        });
        //返回数据
        res.end(JSON.stringify(data));
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteMockServer()]
});
```

```tsx
import { useTransition, useState } from "react";
import { Input, Flex, List } from "antd";
interface Item {
  id: number;
  name: string;
  address: string;
}
const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition(); // 开始过渡
  const [list, setList] = useState<Item[]>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetch(`/api/list?keyWord=${value}`)
      .then(res => res.json())
      .then(data => {
        const res = data?.list ?? [];
        // 使用过渡 useTransition
        startTransition(() => {
          setList([...res]);
        });
        //不使用过渡 useTransition
        //setList([...res])
      });
  };
  return (
    <>
      <Flex>
        <Input
          value={inputValue}
          onChange={handleInputChange} // 实时更新
          placeholder="请输入姓名"
        />
      </Flex>
      {isPending && <div>loading...</div>}
      <List
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}
      />
    </>
  );
};

export default App;
```

- 1. 输入框和状态管理使用`useState`管理输入框的值和结果列表。 每次输入框的内容变化时，`handleInputChange` 函数会被触发，它会获取用户输入的值，并进行 API 请求。
- 2. API 请求在`handleInputChange`中，输入的值会作为查询参数发送到 `/api/list` API。API 返回的数据用于更新结果列表。 为了优化用户体验，我们将结果更新放在 `startTransition` 函数中，这样 React 可以在处理更新时保持输入框的响应性。
- 3. `useTransition`会返回一个布尔值`isPending`，指示过渡任务是否仍在进行中。 当用户输入时，如果正在加载数据，我们会显示一个简单的`loading...`提示，以告知用户当前操作仍在进行。
- 4. 列表渲染 使用 List 组件展示返回的结果，列表项显示每个结果的 name 和 address。

#### 4.6 注意事项

`startTransition` 必须是`同步`的，不能是异步的

错误做法

```tsx
startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage("/about");
  }, 1000);
});

startTransition(async () => {
  await someAsyncFunction();
  // ❌ 在调用 startTransition 后更新状态
  setPage("/about");
});
```

正确做法

```tsx
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage("/about");
  });
}, 1000);

await someAsyncFunction();
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage("/about");
});
```

#### 4.7 原理剖析

`useTransition`的核心原理是`将一部分状态更新处理为低优先级任务`，
这样可以将关键的高优先级任务先执行，而低优先级的过渡更新则会稍微延迟处理。
这在渲染大量数据、进行复杂运算或处理长时间任务时特别有效。`React` 通过调度机制来管理优先级：

- 1. **高优先级更新**：直接影响用户体验的任务，比如表单输入、按钮点击等。
- 2. **低优先级更新**：相对不影响交互的过渡性任务，比如大量数据渲染、动画等，这些任务可以延迟执行。

### 5.useDeferredValue

`useDeferredValue`用于延迟某些状态的更新，直到主渲染任务完成。这对于高频更新的内容（如输入框、滚动等）非常有用，可以让 UI 更加流畅，避免由于频繁更新而导致的性能问题。

#### 5.1 useTransition 和 useDeferredValue 的区别？

`useTransition` 和 `useDeferredValue` 都涉及延迟更新，可以去做性能优化，但它们关注的重点和用途略有不同：

- 1. **useTransition** 主要关注点是`状态的过渡`。比如`列表或者 tab页的过渡`，不适合做输入框(比如在输入框中输入 123，那么它会进行一个阻断，直到用户停止输入，才会进行一个过渡，最后就只有一个 3 了，1 和 2 会丢失)或者滚动的过渡，它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- 2. **useDeferredValue** 主要关注点是`单个值的延迟更新`，适合做`输入框或者滚动的过渡`。它允许你把特定状态的更新标记为低优先级。

#### 5.2 使用方法

```tsx
const deferredValue = useDeferredValue(value);
```

#### 5.3 参数

value: 延迟更新的值(支持任意类型)

#### 5.4 返回值

deferredValue: 延迟更新的值,在初始渲染期间，返回的延迟值将与您提供的值相同

#### 5.5 注意事项

当 `useDeferredValue` 接收到与之前不同的值（使用 `Object.is` 进行比较）时，除了当前渲染（此时它仍然使用旧值），它还会安排一个后台重新渲染。这个后台重新渲染是可以被中断的，如果 value 有新的更新，React 会从头开始重新启动后台渲染。举个例子，如果用户在输入框中的输入速度比接收延迟值的图表重新渲染的速度快，那么图表只会在用户停止输入后重新渲染。

#### 5.6 案例

延迟搜索数据的更新

```tsx
import React, { useState, useTransition, useDeferredValue } from "react";
import { Input, List } from "antd";
import mockjs from "mockjs";
interface Item {
  name: number;
  address: string;
}
export const App = () => {
  const [val, setVal] = useState("");
  const [list] = useState<Item[]>(() => {
    // 使用 Mock.js 生成模拟数据
    return mockjs.mock({
      "list|10000": [
        {
          "id|+1": 1,
          name: "@natural",
          "address": "@county(true)"
        }
      ]
    }).list;
  });
  const deferredQuery = useDeferredValue(val);
  const isStale = deferredQuery !== val; // 检查是否为延迟状态
  const findItem = () => {
    //过滤列表，仅在 deferredQuery 更新时触发
    return list.filter(item => item.name.toString().includes(deferredQuery));
  };
  return (
    <div>
      <Input value={val} onChange={e => setVal(e.target.value)} />
      <List
        style={{ opacity: isStale ? "0.2" : "1", transition: "all 1s" }}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}
        dataSource={findItem()}
      ></List>
    </div>
  );
};

export default App;
```

使用 useDeferredValue 后，输入框中的搜索内容不会立即触发列表过滤，避免频繁的渲染。输入停止片刻后(看起来像防抖)，列表会自动更新为符合条件的数据，确保了较流畅的交互体验。

#### 注意事项

::: warning
useDeferredValue 并不是防抖,防抖是需要一个固定的延迟时间，譬如 1 秒后再处理某些行为，但是 useDeferredValue 并不是一个固定的延迟，它会根据用户设备的情况进行延迟，
当设备情况好，那么延迟几乎是无感知的
:::

### 6.useImmer-第三方 hook

`useImmer` 是基于 `immer` 库实现的一个 `React Hook`，它让你可以像修改可变数据一样来修改不可变数据。`immer` 是一个不可变的数据结构库，完全符合 `React` 的不可变性原则。

#### 6.1 安装

```bash
npm install immer use-immer
```

#### 6.2 API 参考

##### 6.2.1 useImmer

```tsx
function useImmer<S>(initialState: S | (() => S)): [S, (f: (draft: Draft<S>) => void | S) => void];
```

**参数**

- `initialState`: 初始状态值或返回初始状态的函数

**返回值**

- `state`: 当前状态
- `setState`: 更新状态的函数

##### 6.2.2 useImmerReducer

```tsx
function useImmerReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & InitializerArg<R>,
  initializer?: (arg: I & InitializerArg<R>) => ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

#### 6.3 使用

##### 6.3.1 处理嵌套对象

`useImmer` 在处理深层嵌套对象时特别有用，无需手动展开每一层：

```tsx
import { useImmer } from "use-immer";

interface User {
  name: string;
  age: number;
  profile: {
    avatar: string;
    bio: string;
    preferences: {
      theme: "light" | "dark";
      notifications: boolean;
    };
  };
}

export default function UserProfile() {
  const [user, setUser] = useImmer<User>({
    name: "大满zs",
    age: 25,
    profile: {
      avatar: "/avatar.jpg",
      bio: "前端开发者",
      preferences: {
        theme: "light",
        notifications: true
      }
    }
  });

  const updateTheme = () => {
    setUser(draft => {
      draft.profile.preferences.theme = "dark";
    });
  };

  const updateBio = (newBio: string) => {
    setUser(draft => {
      draft.profile.bio = newBio;
    });
  };

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>年龄: {user.age}</p>
      <p>个人简介: {user.profile.bio}</p>
      <p>主题: {user.profile.preferences.theme}</p>

      <button onClick={updateTheme}>切换主题</button>
      <button onClick={() => updateBio("热爱编程的开发者")}>更新简介</button>
    </div>
  );
}
```

##### 6.3.2 处理数组

数组操作变得异常简单，所有原生数组方法都可以直接使用：

```tsx
import { useImmer } from "use-immer";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useImmer<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos(draft => {
      draft.push({
        id: Date.now(),
        text,
        completed: false
      });
    });
  };

  const toggleTodo = (id: number) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    });
  };

  const removeTodo = (id: number) => {
    setTodos(draft => {
      const index = draft.findIndex(t => t.id === id);
      if (index > -1) {
        draft.splice(index, 1);
      }
    });
  };

  const clearCompleted = () => {
    setTodos(draft => {
      return draft.filter(todo => !todo.completed);
    });
  };

  return (
    <div className="todo-list">
      <h2>待办事项 ({todos.length})</h2>

      <div className="add-todo">
        <input
          type="text"
          placeholder="添加新待办..."
          onKeyPress={e => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              addTodo(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>

      {todos.some(t => t.completed) && <button onClick={clearCompleted}>清除已完成</button>}
    </div>
  );
}
```

##### 6.3.3 处理基本类型

对于基本类型，`useImmer` 的行为与 `useState` 完全一致：

```tsx
import { useImmer } from "use-immer";

export default function Counter() {
  const [count, setCount] = useImmer(0);
  const [isVisible, setIsVisible] = useImmer(true);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="counter">
      {isVisible && (
        <>
          <h2>计数器: {count}</h2>
          <div className="controls">
            <button onClick={decrement}>-</button>
            <button onClick={increment}>+</button>
            <button onClick={reset}>重置</button>
          </div>
        </>
      )}
      <button onClick={toggleVisibility}>{isVisible ? "隐藏" : "显示"}计数器</button>
    </div>
  );
}
```

#### 6.4 useImmerReducer 使用

`useImmerReducer` 结合了 `useReducer` 和 `immer` 的优势，让 `reducer` 函数更加简洁：

```tsx
import { useImmerReducer } from "use-immer";

interface State {
  count: number;
  history: number[];
  isLoading: boolean;
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_TO_HISTORY" };

const initialState: State = {
  count: 0,
  history: [],
  isLoading: false
};

function counterReducer(draft: State, action: Action) {
  switch (action.type) {
    case "INCREMENT":
      draft.count += 1;
      break;
    case "DECREMENT":
      draft.count -= 1;
      break;
    case "RESET":
      draft.count = 0;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "ADD_TO_HISTORY":
      draft.history.push(draft.count);
      break;
  }
}

export default function AdvancedCounter() {
  const [state, dispatch] = useImmerReducer(counterReducer, initialState);

  const handleIncrement = () => {
    dispatch({ type: "SET_LOADING", payload: true });

    // 模拟异步操作
    setTimeout(() => {
      dispatch({ type: "INCREMENT" });
      dispatch({ type: "ADD_TO_HISTORY" });
      dispatch({ type: "SET_LOADING", payload: false });
    }, 500);
  };

  return (
    <div className="advanced-counter">
      <h2>高级计数器</h2>

      <div className="display">
        <span>当前值: {state.count}</span>
        {state.isLoading && <span className="loading">加载中...</span>}
      </div>

      <div className="controls">
        <button onClick={handleIncrement} disabled={state.isLoading}>
          增加
        </button>
        <button onClick={() => dispatch({ type: "DECREMENT" })} disabled={state.isLoading}>
          减少
        </button>
        <button onClick={() => dispatch({ type: "RESET" })} disabled={state.isLoading}>
          重置
        </button>
      </div>

      {state.history.length > 0 && (
        <div className="history">
          <h3>历史记录:</h3>
          <ul>
            {state.history.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 二、副作用

### 1.useEffect

useEffect 是 React 中用于处理副作用的钩子。并且 useEffect 还在这里充当生命周期函数，在之前你可能会在类组件中使用 componentDidMount、componentDidUpdate 和 componentWillUnmount 来处理这些生命周期事件。

#### 1.1 什么是副作用函数，什么是纯函数？

##### 1.1.1 纯函数

- 输入决定输出：相同的输入永远会得到相同的输出。这意味着函数的行为是可预测的。
- 无副作用：纯函数不会修改外部状态，也不会依赖外部可变状态。因此，纯函数内部的操作不会影响外部的变量、文件、数据库等。

```tsx
const add = (x: number, y: number) => x + y;
add(1, 2); //3
```

##### 1.1.2 副作用函数

1. 副作用函数 指的是那些在执行时会改变外部状态或依赖外部可变状态的函数。
2. 可预测性降低但是副作用不一定是坏事有时候副作用带来的效果才是我们所期待的
3. 高耦合度函数非常依赖外部的变量状态紧密
   操作引用类型

   操作本地存储例如 localStorage

   调用外部 API，例如 fetch ajax

   操作 DOM

   计时器

```tsx
//------------副作用函数--------------
let obj = { name: "小满" };
const changeObj = obj => {
  obj.name = "大满";
  return obj;
};
//小满
changeObj(obj); //修改了外部变量属于副作用函数
//大满

//------------修改成纯函数--------------
//也就是不会改变外部传入的变量
let obj = { name: "小满" };
const changeObj = obj => {
  const newObj = window.structuredClone(obj); //深拷贝
  newObj.name = "大满";
  return newObj;
};
console.log(obj, "before"); //obj 小满
let newobj = changeObj(obj);
console.log(obj, "after", newobj); //obj 小满 newobj 大满
```

#### 1.2 模拟生命周期

##### 1.2.1 模拟 componentDidUpdate()

```tsx
// 如果不写[]，那么在任何一个状态发生改变的时候，useEffect里面的回调函数都会进行调用
useEffect(() => {
  // 此处可以执行任何带副作用操作
});

// 从生命周期的角度来说，使用useLayoutEffect更加合适模拟componentDidUpdate
useLayoutEffect(() => {
  console.log("componentDidUpdate -- layout");
});
```

##### 1.2.2 模拟 componentDidMount()

```tsx
// 第二个参数传[]，相当于不监视任何状态的改变，这样写就相当于componentDidMount()
useEffect(() => {
  // 此处可以执行任何带副作用操作
  console.log(1); // 只会在初始化的时候打印一次
}, []);
```

##### 1.2.3 模拟 componentWillUnmount()

```tsx
// 返回一个函数，相当于componentWillUnmount()
useEffect(() => {
  return () => {
    // 在组件卸载前执行，相当于componentWillUnmount
    // 在此处做一些收尾的工作，比如：清除定时器/取消订阅等
  };
}, []);
```

##### 1.2.4 模拟 componentWillReceiveProps()

```tsx
// 第二个参数为接收[props]的话，模拟componentWillReceiveProps
// 如果props改变了，那么useEffect里面的回调函数就会进行调用
useEffect(() => {
  console.log("componentWillReceiveProps");
}, [props]);
```

#### 1.3 案例

```tsx
import React, { useState, useEffect } from "react";
interface UserData {
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
}
function App() {
  const [userId, setUserId] = useState(1); // 假设初始用户ID为1
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`); //免费api接口 可以直接使用
        if (!response.ok) {
          throw new Error("网络响应不正常");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>用户信息应用</h1>
      <label>
        输入用户ID:
        <input type="number" value={userId} onChange={handleUserChange} min="1" max="10" />
      </label>
      {loading && <p>加载中...</p>}
      {error && <p>错误: {error}</p>}
      {userData && (
        <div>
          <h2>用户信息</h2>
          <p>姓名: {userData.name}</p>
          <p>邮箱: {userData.email}</p>
          <p>用户名: {userData.username}</p>
          <p>电话: {userData.phone}</p>
          <p>网站: {userData.website}</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

### 2.useLayoutEffect

useLayoutEffect 是 React 提供的一个用于处理副作用的钩子。它与 useEffect 类似，但它在 DOM 更新后同步执行，确保在 DOM 更新后执行的副作用不会阻塞渲染。

#### 2.1 使用方法

与 useEffect 使用方法一样

#### 2.2 useLayoutEffect 和 useEffect 有什么区别？

**执行时机**

- useEffect：组件更新挂载完成 -> 浏览器 dom 绘制完成 -> 执行 useEffect 回调
- useLayoutEffect：组件更新挂载完成 -> 执行 useLayoutEffect 回调 -> 浏览器 dom 绘制完成 -> 执行 useEffect 回调

**同步或者异步**

- useEffect：它的 callback 是`异步调用`，它会等主线程任务执行完成，DOM 更新，js 执行完成，视图绘制完成之后，才会去执行
- useLayoutEffect：它的 callback 是`同步调用`，执行时机是 DOM 更新之后，视图绘制完成之前，才会去执行。这个时间可以去更方便的去修改 DOM；如果说修改 DOM 放在 useEffect 里，界面上的视图会绘制两次，就会导致回流和重绘；如果要修改 DOM 用 useLayoutEffect，其他都用 useEffect

#### 2.3 哪个和 componentDidMount、componentDidUpdate 更接近？

- 因为 componentDidMount、componentDidUpdate 的执行是`同步`的，所以`useLayoutEffect`更接近

#### 2.4 使用场景

1. useEffect：适合用于处理不需要立即同步执行的副作用，比如数据请求、定时器等。
2. useLayoutEffect：适合用于处理需要立即同步执行的副作用，比如 DOM 操作、动画等。

### 3.useInsertionEffect

- useInsertionEffect 比 useLayoutEffect 的执行时机更早，useInsertionEffect 执行时，DOM 还没更新；
- 本质上 useInsertionEffect 主要是解决`CSS-in-js`解决渲染注入样式的性能问题

## 三、状态传递

### 1.useRef

当你在 React 中需要处理 DOM 元素或需要在组件渲染之间保持持久性数据时，便可以使用 useRef。

```tsx
import { useRef } from "react";
const refValue = useRef(initialValue);
refValue.current; // 访问ref的值 类似于vue的ref，Vue的ref是.value，其次就是vue的ref是响应式的，而react的ref不是响应式的
```

#### 1.1 通过 Ref 操作 DOM 元素

::: tip

- 改变 ref.current 属性时，`React 不会重新渲染组件`。React 不知道它何时会发生改变，因为 ref 是一个 `普通的 JavaScript 对象`。
- 除了 初始化 外不要在渲染期间写入或者读取 ref.current，否则会使组件行为变得不可预测。
  :::

```tsx
import { useRef } from "react";
function App() {
  //首先，声明一个 初始值 为 null 的 ref 对象
  let div = useRef(null);
  const heandleClick = () => {
    //当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的 current 属性
    console.log(div.current);
  };
  return (
    <>
      {/*然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX*/}
      <div ref={div}>dom元素</div>
      <button onClick={heandleClick}>获取dom元素</button>
    </>
  );
}
export default App;
```

#### 1.2 数据存储

我们实现一个保存 count 的新值和旧值的例子，但是在过程中我们发现一个问题，就是 num 的值一直为 0，这是为什么呢？

因为等 useState 的 SetCount 执行之后，组件会重新 render 渲染,num 的值又被初始化为了 0，所以 num 的值一直为 0。

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";

function App() {
  let num = 0;
  let [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    num = count;
  };
  return (
    <div>
      <button onClick={handleClick}>增加</button>
      <div>
        {count}:{num}
      </div>
    </div>
  );
}

export default App;
```

##### 1.2.1 如何修改？

我们可以使用 useRef 来解决这个问题，因为 useRef 只会在初始化的时候执行一次，当组件 reRender 的时候，useRef 的值不会被重新初始化。

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";

function App() {
  let num = useRef(0);
  let [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    num.current = count;
  };
  return (
    <div>
      <button onClick={handleClick}>增加</button>
      <div>
        {count}:{num.current}
      </div>
    </div>
  );
}

export default App;
```

#### 1.3 实际应用

我们实现一个计时器的例子，在点击开始计数的时候，计时器会每 300ms 执行一次，在点击结束计数的时候，计时器会被清除。

##### 1.3.1 问题

我们发现，点击 end 的时候，计时器并没有被清除，这是为什么呢？

##### 1.3.2 原因

这是因为组件一直在重新 ReRender,所以 timer 的值一直在被重新赋值为 null，导致无法清除计时器。

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";

function App() {
  console.log("render");
  let timer: NodeJS.Timeout | null = null;
  let [count, setCount] = useState(0);
  const handleClick = () => {
    timer = setInterval(() => {
      setCount(count => count + 1);
    }, 300);
  };
  const handleEnd = () => {
    console.log(timer);
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  return (
    <div>
      <button onClick={handleClick}>开始计数</button>
      <button onClick={handleEnd}>结束计数</button>
      <div>{count}</div>
    </div>
  );
}

export default App;
```

##### 1.3.3 如何解决？

我们可以使用 useRef 来解决这个问题，因为 useRef 的值不会因为组件的重新渲染而改变。

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";

function App() {
  console.log("render");
  let timer = useRef<null | NodeJS.Timeout>(null);
  let [count, setCount] = useState(0);
  const handleClick = () => {
    timer.current = setInterval(() => {
      setCount(count => count + 1);
    }, 300);
  };
  const handleEnd = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  return (
    <div>
      <button onClick={handleClick}>开始计数</button>
      <button onClick={handleEnd}>结束计数</button>
      <div>{count}</div>
    </div>
  );
}

export default App;
```

::: warning

1. 组件在重新渲染的时候，useRef 的值不会被重新初始化。

2. 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。

3. useRef 的值不能作为 useEffect 等其他 hooks 的依赖项，因为它并不是一个响应式状态。

4. useRef 不能直接获取子组件的实例，需要使用 forwardRef。

:::

### 2.useImperativeHandle

可以在子组件内部暴露给父组件句柄，父组件可以调用子组件的方法，或者访问子组件的属性。 如果你学过 Vue，就类似于 Vue 的 `defineExpose`

#### 2.1 使用方法

```tsx
useImperativeHandle(
  ref,
  () => {
    return {
      // 暴露给父组件的方法或属性
    };
  },
  [deps]
);
```

#### 2.2 参数

- ref: 父组件传递的 ref 对象
- createHandle: 返回值，返回一个对象，对象的属性就是子组件暴露给父组件的方法或属性
- deps?:[可选] 依赖项，当依赖项发生变化时，会重新调用 createHandle 函数，类似于 useEffect 的依赖项

#### 2.3 使用场景

- 需要暴露给父组件的方法或属性
- 需要访问子组件的特定实例值
- 需要在子组件中使用 ref 来操作 DOM 元素

#### 2.4 版本使用问题

##### 2.4.1 react18 版本

- react18 版本需要配合`forwardRef`一起使用
- `forwardRef` 包装之后，会有两个参数，第一个参数是 props，第二个参数是 ref

我们使用的时候只需要将 ref 传递给`useImperativeHandle`即可，然后 `useImperativeHandle`就可以暴露子组件的方法或属性给父组件， 然后父组件就可以通过 ref 调用子组件的方法或访问子组件的属性

```tsx
interface ChildRef {
  name: string;
  count: number;
  addCount: () => void;
  subCount: () => void;
}

//React18.2
const Child = forwardRef<ChildRef>((props, ref) => {
  const [count, setCount] = useState(0);
  //重点
  useImperativeHandle(ref, () => {
    return {
      name: "child",
      count,
      addCount: () => setCount(count + 1),
      subCount: () => setCount(count - 1)
    };
  });
  return (
    <div>
      <h3>我是子组件</h3>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
});

function App() {
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      <button onClick={() => childRef.current?.addCount()}>操作子组件+1</button>
      <button onClick={() => childRef.current?.subCount()}>操作子组件-1</button>
      <hr />
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
```

##### 2.4.2 react19 版本

- react19 版本不需要配合`forwardRef`一起使用，直接使用即可，他会把 Ref 跟 props 放到一起，你会发现变得更加简单了
- react19 版本 useRef 的参数改为必须传入一个参数例如`useRef<ChildRef>(null)`

```tsx
interface ChildRef {
  name: string;
  count: number;
  addCount: () => void;
  subCount: () => void;
}

//React19
const Child = forwardRef<ChildRef>((_, ref) => {// [!code --]
const Child = ({ ref }: { ref: React.Ref<ChildRef> }) => {
  const [count, setCount] = useState(0);
  useImperativeHandle(ref, () => {
    return {
      name: "child",
      count,
      addCount: () => setCount(count + 1),
      subCount: () => setCount(count - 1)
    };
  });
  return (
    <div>
      <h3>我是子组件</h3>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
};

function App() {
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      <button onClick={() => childRef.current?.addCount()}>操作子组件+1</button>
      <button onClick={() => childRef.current?.subCount()}>操作子组件-1</button>
      <hr />
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
```

#### 2.5 执行时机[第三个参数]

1. 如果不传入第三个参数，那么 useImperativeHandle 会在组件挂载时执行一次，然后状态更新时，都会执行一次

```tsx
useImperativeHandle(ref, () => {});
```

2. 如果传入第三个参数，并且是一个空数组，那么 useImperativeHandle 会在组件挂载时执行一次，然后状态更新时，不会执行

```tsx
useImperativeHandle(ref, () => {}, []);
```

3. 如果传入第三个参数，并且有值，那么 useImperativeHandle 会在组件挂载时执行一次，然后会根据依赖项的变化，决定是否重新执行

```tsx
const [count, setCount] = useState(0);
useImperativeHandle(ref, () => {}, [count]);
```

#### 2.6 案例

例如，我们封装了一个表单组件，提供了两个方法：校验和重置。使用`useImperativeHandle`可以将这些方法暴露给父组件，父组件便可以通过`ref`调用子组件的方法。

```tsx
interface ChildRef {
  name: string;
  validate: () => string | true;
  reset: () => void;
}

const Child = ({ ref }: { ref: React.Ref<ChildRef> }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: ""
  });
  const validate = () => {
    if (!form.username) {
      return "用户名不能为空";
    }
    if (!form.password) {
      return "密码不能为空";
    }
    if (!form.email) {
      return "邮箱不能为空";
    }
    return true;
  };
  const reset = () => {
    setForm({
      username: "",
      password: "",
      email: ""
    });
  };
  useImperativeHandle(ref, () => {
    return {
      name: "child",
      validate: validate,
      reset: reset
    };
  });
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>我是表单组件</h3>
      <input
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        placeholder="请输入用户名"
        type="text"
      />
      <input
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        placeholder="请输入密码"
        type="text"
      />
      <input
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        placeholder="请输入邮箱"
        type="text"
      />
    </div>
  );
};

function App() {
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  const submit = () => {
    const res = childRef.current?.validate();
    console.log(res);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      <button onClick={() => submit()}>校验子组件</button>
      <button onClick={() => childRef.current?.reset()}>重置</button>
      <hr />
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
```

### 3.useContext

useContext 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。设计的目的就是解决组件树间数据传递的问题。

#### 3.1 使用方法

```tsx
const MyThemeContext = React.createContext({ theme: "light" }); // 创建一个上下文
function App() {
  return (
    <MyThemeContext.Provider value={{ theme: "light" }}>
      <MyComponent />
    </MyThemeContext.Provider>
  );
}
function MyComponent() {
  const themeContext = useContext(MyThemeContext); // 使用上下文
  return <div>{themeContext.theme}</div>;
}
```

#### 3.2 参数

入参

- context：是 createContext 创建出来的对象，他不保持信息，他是信息的载体。声明了可以从组件获取或者给组件提供信息。
  返回值
- 返回传递的 Context 的值，并且是只读的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件

#### 3.3 基本用法

##### 3.3.1 react18 版本

首先我们先通过 `createContext` 创建一个上下文，然后通过 `createContext` 创建的组件包裹组件，传递值。

被包裹的组件，在任何一个层级都是可以获取上下文的值，那么如何使用呢？

使用的方式就是通过 useContext 这个 hook，然后传入上下文，就可以获取到上下文的值。

```tsx
import React, { useContext, useState } from "react";

// 定义上下文类型
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// 创建上下文
const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);

const Child = () => {
  // 获取上下文
  const themeContext = useContext(ThemeContext);
  const styles = {
    backgroundColor: themeContext.theme === "light" ? "white" : "black",
    border: "1px solid red",
    width: 100 + "px",
    height: 100 + "px",
    color: themeContext.theme === "light" ? "black" : "white"
  };
};

const Parent = () => {
  // 获取上下文
  const themeContext = useContext(ThemeContext);

  const styles = {
    backgroundColor: themeContext.theme === "light" ? "white" : "black",
    border: "1px solid red",
    width: 100 + "px",
    height: 100 + "px",
    color: themeContext.theme === "light" ? "black" : "white"
  };

  return (
    <div>
      <div style={styles}>Parent</div>
      <Child />
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>切换主题</button>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Parent />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
```

##### 3.3.2 react19 版本

```tsx
import React, { useContext, useState } from 'react';
const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);
interface ThemeContextType {
   theme: string;
   setTheme: (theme: string) => void;
}

const Child = () => {
   const themeContext = useContext(ThemeContext);
   const styles = {
      backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
      border: '1px solid red',
      width: 100 + 'px',
      height: 100 + 'px',
      color: themeContext.theme === 'light' ? 'black' : 'white'
   }
   return <div>
      <div style={styles}>
         child
      </div>
   </div>
}

const Parent = () => {
   const themeContext = useContext(ThemeContext);
   const styles = {
      backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
      border: '1px solid red',
      width: 100 + 'px',
      height: 100 + 'px',
      color: themeContext.theme === 'light' ? 'black' : 'white'
   }
   return <div>
      <div style={styles}>
         Parent
      </div>
      <Child />
   </div>
}
function App() {
   const [theme, setTheme] = useState('light');
   return (
      <div>
         <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
          // 这里可以直接使用，不需要ThemeContext.Provider包裹
         <ThemeContext value={{ theme, setTheme }}>
            <Parent />
         <ThemeContext>
      </div >
   );
}

export default App;
```

#### 3.4 注意事项

- 使用 ThemeContext 时，传递的 key 必须为 value

```tsx
// 🚩 不起作用：prop 应该是“value”
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
// ✅ 传递 value 作为 prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

- 可以使用多个 Context

```tsx
const ThemeContext = React.createContext({ theme: "light" });

function App() {
  return (
    <ThemeContext value={{ theme: "light" }}>
      {/* 里面的这个ThemeContext会覆盖了上面的值 */}
      <ThemeContext value={{ theme: "dark" }}>
        <Parent />
      </ThemeContext>
    </ThemeContext>
  );
}
```

## 四、状态派生

### 1. useMemo

`useMemo`是 React 提供的一个性能优化 Hook。它的主要功能是避免在每次渲染时执行复杂的计算和对象重建。通过记忆上一次的计算结果，仅当依赖项变化时才会重新计算，提高了性能，有点类似于 Vue 的`computed`。

#### 1.1 使用方法

```tsx
import React, { useMemo, useState } from "react";
const App = () => {
  const [count, setCount] = useState(0);
  const memoizedValue = useMemo(() => count, [count]);
  return <div>{memoizedValue}</div>;
};
```

#### 1.2 参数

- 第一个参数：是一个函数，返回值是计算的值
- 第二个参数：是一个数组，数组中的值是依赖项，当依赖项变化时，会重新计算`执行时机跟 useEffect 类似`
- 返回值：返回需要缓存的值

#### 1.3 案例

:::tip

- 我们来看下面这个例子，如果没有使用 useMemo 进行缓存，每次 search 发生变化， total 都会重新计算，因为我们的 total 跟 search 没有关系，所以这样就造成了没必要的计算，我们可以使用 useMemo 缓存去进行优化。
- 当我们使用 useMemo 缓存后，只有 goods 发生变化时， total 才会重新计算, 而 search 发生变化时， total 不会重新计算。
  :::

```tsx
import React, { useMemo, useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [goods, setGoods] = useState([
    { id: 1, name: "苹果", price: 10, count: 1 },
    { id: 2, name: "香蕉", price: 20, count: 1 },
    { id: 3, name: "橘子", price: 30, count: 1 }
  ]);
  const handleAdd = (id: number) => {
    setGoods(goods.map(item => (item.id === id ? { ...item, count: item.count + 1 } : item)));
  };
  const handleSub = (id: number) => {
    setGoods(goods.map(item => (item.id === id ? { ...item, count: item.count - 1 } : item)));
  };

  // 使用 useMemo 缓存计算结果
  const total = useMemo(() => {
    console.log("total");
    return goods.reduce((total, item) => total + item.price * item.count, 0);
  }, [goods]);

  return (
    <div>
      <h1>父组件</h1>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>商品名称</th>
            <th>商品价格</th>
            <th>商品数量</th>
          </tr>
        </thead>
        <tbody>
          {goods.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price * item.count}</td>
              <td>
                <button onClick={() => handleAdd(item.id)}>+</button>
                <span>{item.count}</span>
                <button onClick={() => handleSub(item.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>总价：{total}</h2>
    </div>
  );
}

export default App;
```

#### 1.4 执行时机

- 如果依赖项是个空数组，那么 useMemo 的回调函数会执行一次
- 指定依赖项，当依赖项发生变化时， useMemo 的回调函数会执行
- 不指定依赖项，不推荐这么用，因为每次渲染和更新都会执行

#### 1.5 useMemo 总结

##### 1.5.1 使用场景：

- 当需要缓存复杂计算结果时
- 当需要避免不必要的重新计算时
- 当计算逻辑复杂且耗时时

##### 1.5.2 优点：

- 通过记忆化避免不必要的重新计算
- 提高应用性能
- 减少资源消耗

##### 1.5.3 注意事项：

- 不要过度使用，只在确实需要优化的组件上使用
- 如果依赖项经常变化，useMemo 的效果会大打折扣
- 如果计算逻辑简单，使用 useMemo 的开销可能比重新计算还大

### 2. React.memo

`React.memo`是一个 React API，用于优化性能。它通过记忆上一次的渲染结果，仅当 props 发生变化时才会重新渲染, 避免重新渲染。

#### 2.1 使用方法

使用`React.memo`包裹组件`一般用于子组件`，可以避免组件重新渲染。

```tsx
// 第一种用法
import React, { memo } from "react";
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // 组件逻辑
});
const App = () => {
  return <MyComponent prop1="value1" prop2="value2" />;
};

// 第二种用法
import React, { memo } from "react";

const Child = memo(({ name }) => {
  return <div>{name}</div>;
});
const App = () => {
  return <Child name="value1" />;
};
```

#### 2.2 案例

首先明确 React 组件的渲染条件：

- 组件的 props 发生变化
- 组件的 state 发生变化
- useContext 发生变化

:::tip

- 我们来看下面这个例子，这个例子没有使用 memo 进行缓存，所以每次父组件的 state 发生变化，子组件都会重新渲染。
- 而我们的子组件只用到了 user 的信息，但是父组件每次 search 发生变化，子组件也会重新渲染, 这样就就造成了没必要的渲染所以我们使用 memo 缓存。
- 当我们使用 memo 缓存后，只有 user 发生变化时，子组件才会重新渲染, 而 search 发生变化时，子组件不会重新渲染。
  :::

```tsx
import React, { useMemo, useState } from "react";

interface User {
  name: string;
  age: number;
  email: string;
}
interface CardProps {
  user: User;
}

const Card = React.memo(function ({ user }: CardProps) {
  console.log("Card render");
  const styles = {
    backgroundColor: "lightblue",
    padding: "20px",
    borderRadius: "10px",
    margin: "10px"
  };

  return (
    <div style={styles}>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
      <p>{user.email}</p>
    </div>
  );
});

function App() {
  const [users, setUsers] = useState<User>({
    name: "张三",
    age: 18,
    email: "zhangsan@example.com"
  });

  const [search, setSearch] = useState("");
  return (
    <div>
      <h1>父组件</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <div>
        <button
          onClick={() =>
            setUsers({
              name: "李四",
              age: Math.random() * 100,
              email: "lisi@example.com"
            })
          }
        >
          更新user
        </button>
      </div>
      <Card user={users} />
    </div>
  );
}

export default App;
```

#### 2.3 React.memo 总结

##### 2.3.1 使用场景：

- 当子组件接收的 props 不经常变化时
- 当组件重新渲染的开销较大时
- 当需要避免不必要的渲染时

##### 2.3.2 优点：

- 通过记忆化避免不必要的重新计算
- 提高应用性能
- 减少资源消耗

##### 2.3.3 注意事项：

- 不要过度使用，只在确实需要优化的组件上使用
- 对于简单的组件，使用 memo 的开销可能比重新渲染还大
- 如果 props 经常变化， memo 的效果会大打折扣

### 3. useCallback

`useCallback`用于优化性能，返回一个记忆化的回调函数，可以减少不必要的重新渲染，也就是说它是用于`缓存组件内的函数`，避免函数的重复创建。

#### 3.1 使用方法

```tsx
import React, { useCallback } from "react";

const handleClick = useCallback(() => {
  console.log("handleClick");
}, []);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

##### 为什么需要 useCallback？

在 React 中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。`useCallback` 通过缓存函数，可以减少不必要的重新渲染，提高性能。

##### useMemo 和 useCallback 的区别？

**共同点：**

- 入参是一个函数，依赖项都是一模一样的

**不同点：**

- useMemo 返回函数执行之后的结果，useCallback 返回的是一个当前所缓存的函数
- useMemo 用于缓存计算结果，而 useCallback 用于缓存函数。

#### 3.2 参数

入参

- callback：回调函数
- deps：依赖项数组，当依赖项发生变化时，回调函数会被重新创建，跟 useEffect 一样。

返回值

- 返回一个记忆化的回调函数，可以减少函数的创建次数，提高性能。

#### 3.3 案例

- 我们创建了一个 Child 子组件，并使用 React.memo 进行优化，memo 在上一章讲过了，他会检测 props 是否发生变化，如果发生变化，就会重新渲染子组件。
- 我们创建了一个 childCallback 函数，传递给子组件，然后我们输入框更改值，发现子组件居然重新渲染了，但是我们并没有更改 props，这是为什么呢？
- 这是因为输入框的值发生变化，App 就会重新渲染，然后 childCallback 函数就会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

```tsx
import React, { useCallback, useState } from "react";
const Child = React.memo(({ user, callback }: { user: { name: string; age: number }; callback: () => void }) => {
  console.log("Render Child");
  const styles = {
    color: "red",
    fontSize: "20px"
  };
  return (
    <div style={styles}>
      <div>{user.name}</div>
      <div>{user.age}</div>
      <button onClick={callback}>callback</button>
    </div>
  );
});

const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({
    name: "John",
    age: 20
  });
  const childCallback = () => {
    console.log("callback 执行了");
  };
  return (
    <>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
      <Child callback={childCallback} user={user} />
    </>
  );
};

export default App;
```

因为 App 重新渲染了，所以 childCallback 函数会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

只需要在 childCallback 函数上使用 useCallback，就可以优化性能。

```tsx
const childCallback = useCallback(() => {
  console.log("callback 执行了");
}, []);
```

#### 3.4 useCallback 总结

- useCallback 的使用需要有所节制，不要盲目地对每个方法应用 useCallback，这样做可能会导致不必要的性能损失。useCallback 本身也需要一定的性能开销。
- useCallback 并不是为了阻止函数的重新创建，而是通过依赖项来决定是否返回新的函数或旧的函数，从而在依赖项不变的情况下确保函数的地址不变。
