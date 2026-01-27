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

```sh
npm i zustand
```

## 二、基础使用

- store/price.ts

```tsx
import { create } from "zustand";

// 定义一个接口，用于描述状态管理器的状态和操作
interface PriceStore {
  price: number;
  incrementPrice: () => void;
  decrementPrice: () => void;
  resetPrice: () => void;
  getPrice: () => number;
}
// 创建一个状态管理器，使用 create 函数，传入一个函数，返回一个对象
/**
 *
 * @param set 用于更新状态
 * @param get 用于获取状态
 * @returns 返回一个对象，对象中的方法可以用于更新状态
 */
const usePriceStore = create<PriceStore>((set, get) => ({
  price: 0, // 初始状态
  incrementPrice: () => set(state => ({ price: state.price + 1 })), // 更新状态
  decrementPrice: () => set(state => ({ price: state.price - 1 })), // 更新状态
  resetPrice: () => set({ price: 0 }), // 重置状态
  getPrice: () => get().price // 获取状态
}));

export default usePriceStore;
```

- APP.tsx 组件中使用

```tsx
import usePriceStore from "./store/price";
export const App = () => {
  //直接解构使用即可 把他当做一个hook使用
  const { price, incrementPrice, decrementPrice, resetPrice, getPrice } = usePriceStore();
  return (
    <div>
      <p>价格: {price}</p>
      <button onClick={incrementPrice}>增加</button>
      <button onClick={decrementPrice}>减少</button>
      <button onClick={resetPrice}>重置</button>
      <button onClick={getPrice}>获取</button>
    </div>
  );
};
```

:::tip
zustand 的 set 函数会帮我们合并第一层状态，回想一下 useState

```tsx
import { useState } from "react";

const [state, setState] = useState({
  name: "张三",
  age: 18,
  price: 0
});

setState(state => ({
  ...state, // 合并第一层状态 这个操作在 zustand 中会自动完成所以我们就不需要写这行代码了
  price: state.price + 1 // 更新状态
}));
```

:::

## 三、状态处理

### 1. 深层次状态处理

#### 1.1 使用 immer 中间件

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // 注意这里的引入方式

// 注意：使用 immer 中间件时的特殊结构
const useUserStore = create<User>()(
  immer(set => ({
    gourd: {
      oneChild: "大娃",
      twoChild: "二娃",
      threeChild: "三娃",
      fourChild: "四娃",
      fiveChild: "五娃",
      sixChild: "六娃",
      sevenChild: "七娃"
    },
    updateGourd: () =>
      set(state => {
        // 直接修改状态，无需手动合并
        state.gourd.oneChild = "大娃-超进化";
        state.gourd.twoChild = "二娃-谁来了";
        state.gourd.threeChild = "三娃-我来了";
      })
  }))
);
```

### 2.immer 原理剖析

immer.js 通过 Proxy 代理对象的所有操作，实现不可变数据的更新。当对数据进行修改时，immer 会创建一个`被修改对象的副本`，并在副本上进行修改，最后返回修改后的新对象，而原始对象保持不变。这种机制确保了数据的不可变性，同时提供了直观的修改方式。

immer 的核心原理基于以下两个概念：

1. 写时复制 (Copy-on-Write)

- 无修改时：直接返回原对象
- 有修改时：创建新对象

2. 惰性代理 (Lazy Proxy)

- 按需创建代理
- 通过 Proxy 拦截操作
- 延迟代理创建

:::tip
注意：这是一个简化实现，没有考虑数组的情况和深层次的代理，只实现了其核心思想。
:::

```tsx
type Draft<T> = {
  -readonly [P in keyof T]: T[P];
};

function produce<T>(base: T, recipe: (draft: Draft<T>) => void): T {
  // 用于存储修改过的对象
  const modified: Record<string, any> = {};

  const handler = {
    get(target: any, prop: string) {
      // 如果这个对象已经被修改过，返回修改后的对象
      if (prop in modified) {
        return modified[prop];
      }

      // 如果访问的是对象，则递归创建代理
      if (typeof target[prop] === "object" && target[prop] !== null) {
        return new Proxy(target[prop], handler);
      }
      return target[prop];
    },
    set(target: any, prop: string, value: any) {
      // 记录修改
      modified[prop] = value;
      return true;
    }
  };

  // 创建代理对象
  const proxy = new Proxy(base, handler);

  // 执行修改函数
  recipe(proxy);

  // 如果没有修改，直接返回原对象
  if (Object.keys(modified).length === 0) {
    return base;
  }

  // 创建新对象，只复制修改过的属性
  return JSON.parse(JSON.stringify(proxy));
}

// 使用示例
const state = {
  user: {
    name: "张三",
    age: 25
  }
};

const newState = produce(state, draft => {
  draft.user.name = "李四";
  draft.user.age = 26;
});

console.log(state); // { user: { name: '张三', age: 25 } }
console.log(newState); // { user: { name: '李四', age: 26 } }
```

## 四、状态简化

回忆一下我们在使用 zustand 时，是这样引入状态的(如下),通过解构的方式引入状态，但是这样引入会引发一个问题，例如 A 组件用到了 hobby.basketball 状态，而 B 组件 没有用到 hobby.basketball 状态，但是更新 hobby.basketball 这个状态的时候，A 组件和 B 组件都会重新渲染，这样就导致了不必要的重渲染，因为 B 组件并没有用到 hobby.basketball 这个状态。

```tsx
const { name, age, hobby, setHobbyRap, setHobbyBasketball } = useUserStore();
return (
  <div className="left">
    <h1>A组件</h1>
    <div>
      <h3>{name}</h3>
      <div>
        年龄：<span>{age}</span>
      </div>
      <div>
        爱好1：<span>{hobby.sing}</span>
      </div>
      <div>
        爱好2：<span>{hobby.dance}</span>
      </div>
      <div>
        爱好3：<span>{hobby.rap}</span>
      </div>
      <div>
        爱好4：<span>{hobby.basketball}</span>
      </div>
      <button onClick={() => setHobbyRap("只因你太美")}>改变爱好rap</button>
      <button onClick={() => setHobbyBasketball("篮球")}>改变爱好basketball</button>
    </div>
  </div>
);
```

### 1. 状态选择器

所以为了规避这个问题，我们可以使用状态选择器，状态选择器可以让我们只选择我们需要的部分状态，这样就不会引发不必要的重渲染。

```tsx
const name = useUserStore(state => state.name);
const age = useUserStore(state => state.age);
const rap = useUserStore(state => state.hobby.rap);
const basketball = useUserStore(state => state.hobby.basketball);
```

### 2. useShallow

比如 100 个状态，那我们使用状态选择器来写起来岂不是要疯了，但是你用解构的话他又会造成不必要的重渲染，这时候我们就可以使用 useShallow 来避免这个问题。
:::tip
useShallow 只检查顶层对象的引用是否变化，如果顶层对象的引用没有变化（即使其内部属性或子对象发生了变化，但这些变化不影响顶层对象的引用），使用 useShallow 的组件将不会重新渲染
:::

```tsx
import { useShallow } from "zustand/react/shallow";
const { rap, name } = useUserStore(
  useShallow(state => ({
    rap: state.hobby.rap,
    name: state.name
  }))
);
```

## 五、中间件

`zustand`的中间件是用于在状态管理过程中添加额外逻辑的工具。它们可以用于日志记录、性能监控、数据持久化、异步操作等。

### 1. 自定义编写中间件

```tsx
const logger = config => (set, get, api) =>
  config(
    (...args) => {
      console.log(api);
      console.log("before", get());
      set(...args);
      console.log("after", get());
    },
    get,
    api
  );
```

**参数解释**：

1. config (外层函数参数)

- 类型：函数 (set, get, api) => StoreApi
- 作用：原始创建 store 的配置函数，由用户传入。中间件需要包装这个函数。

2. set (内层函数参数)

- 类型：函数 (partialState) => void
- 作用：原始的状态更新函数，用于修改 store 的状态。

3. get (内层函数参数)

- 类型：函数 () => State
- 作用：获取当前 store 的状态值。

4. api (内层函数参数)

- 类型：对象 StoreApi
- 作用：包含 store 的完整 API（如 setState, getState, subscribe, destroy 等方法）。

### 2. 使用中间件

```tsx
const useUserStore = create<User>()(
  immer(
    logger(set => ({
      name: "坤坤",
      age: 18,
      hobby: {
        sing: "坤式唱腔",
        dance: "坤式舞步",
        rap: "坤式rap",
        basketball: "坤式篮球"
      },
      setHobbyRap: (rap: string) =>
        set(state => {
          state.hobby.rap = rap;
        }),
      setHobbyBasketball: (basketball: string) =>
        set(state => {
          state.hobby.basketball = basketball;
        })
    }))
  )
);
```

### 3.持久化-persist

persist 是 zustand 提供的一个用于持久化状态的工具，它可以帮助我们更好地管理状态，默认是存储在 localStorage 中，可以指定存储方式

```tsx
import { persist } from "zustand/middleware";

const useUserStore = create<User>()(
  immer(
    persist(
      set => ({
        name: "坤坤",
        age: 18,
        hobby: {
          sing: "坤式唱腔",
          dance: "坤式舞步",
          rap: "坤式rap",
          basketball: "坤式篮球"
        },
        setHobbyRap: (rap: string) =>
          set(state => {
            state.hobby.rap = rap;
          }),
        setHobbyBasketball: (basketball: string) =>
          set(state => {
            state.hobby.basketball = basketball;
          })
      }),
      {
        name: "user", // 仓库名称(唯一)
        storage: createJSONStorage(() => localStorage), // 存储方式 可选 localStorage sessionStorage IndexedDB 默认localStorage
        partialize: state => ({
          name: state.name,
          age: state.age,
          hobby: state.hobby
        }) // 部分状态持久化
      }
    )
  )
);
```

## 六、订阅-subscribe

zustand 的 subscribe，可以订阅一个状态，当状态变化时，会触发回调函数。

### 1. 订阅一个状态

只要 store 的 state 发生变化，就会触发回调函数，另外就是这个订阅可以在`组件内部订阅`，也可以在`组件外部订阅`,如果在`组件内部订阅需要放到useEffect`中,防止重复订阅。

```tsx
const store = create(set => ({
  count: 0
}));
//外部订阅
store.subscribe(state => {
  console.log(state.count);
});
//组件内部订阅
useEffect(() => {
  store.subscribe(state => {
    console.log(state.count);
  });
}, []);
```

### 2. 案例

比如我们需要观察年龄的变化，大于等于 26 就提示可以结婚了，小于 26 就提示还不能结婚，如果使用选择器的写法，age 每次更新都会重新渲染组件，这样就会导致组件的频繁渲染。

```tsx
const store = create(set => ({
  age: 0
}));
//组件里面 age 每次更新都会重新渲染组件
const { age } = useStore(
  useShallow(state => ({
    age: state.age
  }))
);
```

性能优化，采用订阅的模式，age 变化的时候，会调用回调函数，但是不会重新渲染组件。

```tsx
const store = create(set => ({
  age: 0
}));

const [status, setStatus] = useState("单身");
//只会更新一次组件
useStore.subscribe(state => {
  if (state.age >= 26) {
    setStatus("结婚");
  } else {
    setStatus("单身");
  }
});
return <div>{status}</div>;
```

持续优化，目前的订阅只要是 store 内部任意的 state 发生变化，都会触发回调函数，我们希望只订阅 age 的变化，可以使用中间件 subscribeWithSelector 订阅单个状态。

```tsx
import { subscribeWithSelector } from "zustand/middleware";
const store = create(
  subscribeWithSelector(set => ({
    age: 0,
    name: "张三"
  }))
);
const [status, setStatus] = useState("单身");
//订阅age的变化 并且组件渲染一次
useStore.subscribe(
  state => state.age,
  (age, prevAge) => {
    if (age >= 26) {
      setStatus("结婚");
    } else {
      setStatus("单身");
    }
  },
  {
    equalityFn: (a, b) => a === b, // 默认是浅比较，如果需要深比较，可以传入一个比较函数
    fireImmediately: true // 默认是false，如果需要立即触发，可以传入true
  }
);
```

### 3. 取消订阅

```tsx
const unSubscribe = useStore.subscribe(state => {
  console.log(state.age);
});
unSubscribe(); //取消订阅
```
