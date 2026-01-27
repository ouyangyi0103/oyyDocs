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

# Vue-Router4

## 一、项目目录

```js
 ├── node_moduls
 ├── src
     └── vue-router
     │     └── index.ts
     │     └── router-link.ts
     │     └── router-view.ts
     │     └── config
     │        └── index.ts
     │     └── history
     │        └── hash.ts
     │        └── h5.ts
     │     └── matcher
     │        └── create-matcher.ts
     └── types
     │    └── index.ts
     ├── App.vue
     ├── main.ts
     ├── shim.d.ts
 ├── index.html
 ├── package-lock.json
 ├── package.json
 ├── tsconfig.json
```

## 二、router4

:::tip router3

1. 在 router2 和 3 的版本，hash 是使用 hashchange 实现的
2. history 使用的 popstate，history 的 api 实现
3. 还有一个 abstract 用来做 SSR

:::

:::tip router4
router4 的 hash 不使用 hashchange，在设计的时候多了一个 base，也就是 hash 的#，就是一个 base，用的 api 是用 history 实现的
:::

## 三、router4 的实现

### 1.shim.d.ts

```ts
// 这个文件是用来解决vue3中使用vue-router4的类型问题
declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
```

### 2.types/index.ts

```ts
import { defineComponent, App } from "vue";
import type { RouterHistory } from "../history/h5";

export interface RouterOptions {
  history: RouterHistory;
  routes: RouteRecordRaw[];
}

export interface RouteRecordRaw {
  path: string;
  name?: string;
  meta?: Record<string, any>;
  children?: RouteRecordRaw[];
  component: ReturnType<typeof defineComponent>; // 读取组件返回值的类型
}

export interface Router {
  install(app: App): void;
  push(to: string | RouteLocationRaw): void;
  replace(to: string | RouteLocationRaw): void;
  resolve(to: string | RouteLocationRaw): { path: string; matched: any[] };
  finaLiazeNavigation(to: string | RouteLocationRaw, from: string | RouteLocationRaw, replace: boolean): void;
}
```

### 3.main.ts

```ts
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "./vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: () => import("./views/Home.vue") }]
});

createApp(App).use(router).mount("#app");
```

### 4.vue-router/index.ts

```js
// config / index.ts;
// 定义两个常量，用于在 Vue 中提供和获取 router 和 route 实例，避免命名冲突
export const ROUTER_KEY = Symbol("router");
export const ROUTE_KEY = Symbol("route");
```

```js
import type { App } from "vue";
import { inject, provide, shallowRef, reactive, computed } from "vue";
import RouterLink from "./router-link";
import RouterView from "./router-view";
import { ROUTER_KEY, ROUTE_KEY } from "./config";
import type { RouterOptions, RouteRecordRaw } from "./types";
import { createMatcher } from "./matcher/create-matcher";

// 定义一个常量，用于存储路由的规范化路径
const ROUTE_NORMALIZED = {
  path: "/", // 路径
  params: {}, // 参数
  query: {}, // 查询参数
  meta: {}, // 元数据
  matched: [] // 匹配的路由
};

export const useRouter = (): Router => {
  // 获取 router 实例
  const router = inject(ROUTER_KEY);
  if (!router) {
    throw new Error("useRouter must be used within a Router");
  }
  return router as Router;
};

export const useRoute = (): Route => {
  const route = inject(ROUTE_KEY);
  if (!route) {
    throw new Error("useRoute must be used within a Router");
  }
  return route as Route;
};

export const createRouter = (options: RouterOptions): Router => {
  let lock = false;
  const routerHistory = options.history

  // 创建一个响应式对象，用于存储当前路由，ROUTE_NORMALIZED里面的值就不是响应式的了，这个给自己用
  // 但是用户使用的时候，里面的值需要响应式，可以自己用 reactive 包装一下
  const currentRoute = shallowRef(ROUTE_NORMALIZED);

  const matcher = createMatcher(options.routes);

  class Router implements Router {
    constructor(options: RouterOptions) {
      this.options = options;
    }

    install(app: App) {
      const reactiveRoute = {};
      // 将 ROUTE_NORMALIZED 中的每个属性转换为响应式对象，给用户使用
      for (const key in ROUTE_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }

      // 向外提供 router 实例
      app.provide(ROUTER_KEY, this);
      // 向外提供 route 实例
      app.provide(ROUTE_KEY, reactive(reactiveRoute));
      // 注册插件
      app.use(this);
      // 注册组件
      app.component("RouterLink", RouterLink);
      app.component("RouterView", RouterView);
      app.config.globalProperties.$router = this;

      // 一进页面就需要执行一次
      if (currentRoute.value === ROUTE_NORMALIZED) {
        this.push(routerHistory.location);
      }
    }

    markRady(){
      if(lock) return;
      lock = true;
      routerHistory.listen((to) => {
        const targetLocation = this.resolve(to)
        const from = currentRoute.value
        this.finaLiazeNavigation(targetLocation,from, true)
      })
    }

    finaLiazeNavigation(to,from,replace = false){
      if(from === ROUTE_NORMALIZED){
        // 说明是第一次
        this.markRady()
      }else  if(replace){
        routerHistory.replace(to.path)
      }else{
        routerHistory.push(to.path)
      }

      currentRoute.value = to
    }

    // 给this定义类型，只有TS才能这么写，to还是第一个参数
    push(this: Router,to){
      const targetLocation = this.resolve(to)
      const from = currentRoute.value
      this.finaLiazeNavigation(targetLocation,from,false)
    }

    replace(this: Router,to){

    }

    resolve(to: string | RouteLocationRaw){
      /**
       * router.push('xxx')
       * router.push({path: 'xxx'})
       */
      if(typeof to === 'string'){
        return matcher.resolve({path: to})
      }else{
        return matcher.resolve(to)
      }
    }
  }

  const router = new Router(options);
  return router;
};

export * from "./history/h5";
export * from "./history/hash";
export * from "./types";
```

### 5. history/h5.ts

```ts
function buildState(back: number, current: string, forward: number, replace: boolean = false) {
  return {
    back,
    current,
    forward,
    replace
  };
}

function createCurrentLocation(base: string = ""): string {
  /**
   * @pathname www.baidu.com/a/b/c 读取的是 /a/b/c
   * @search www.baidu.com/?a=1&b=2 包括? 读取的是 ?a=1&b=2
   * @hash www.baidu.com/#/aaa 包括# 读取的是 #/aaa
   */
  const { pathname, search, hash } = window.location;
  // 如果是hash
  if (base.includes("#")) {
    return hash.slice(1) || "/";
  }
  return pathname + hash + search;
}

function useHistoryNavigator(base: string = ""): History {
  // 当前路径存一下
  const currentLocation = { value: createCurrentLocation(base) };

  // 路由的状态  history是会发起请求的
  // 返回的路径 当前的路径  前进的路径 是否是replace 用户的参数 都是存放在 history.state 里面
  const historyState = {
    value: window.history.state
  };

  function changeLocation(to: string, state: any, replace: boolean = false) {
    const url = base.includes("#") ? `${base}${to}` : `${to}`;
    window.history[replace ? "replaceState" : "pushState"](state, "", url);
    // 本地记录一下状态
    historyState.value = state;
  }

  // 首次进入的时候，需要把当前的路径设置为返回的路径
  if (!historyState.value) {
    // 也就是一进页面的时候，进行了 / 跳 / ，并且用的是repalce跳转，无历史记录
    changeLocation(currentLocation.value, buildState(0, currentLocation.value, 0, true), false);
  }

  function push(to: string, data?: any) {
    // 触发前进
    const currentState = Object.assign({}, historyState.value, {
      forward: to
    });
    // 记录一下 没有真实的跳转 只是记录了一下状态，也就是自己跳自己了 在这里可以加 生命周期，跳转之前做些什么
    changeLocation(currentState.current, currentState, true);
    // 实现真正的跳转
    const state = Object.assign({}, buildState(currentState.current, to, 0, false), data); // 合并状态，将data中的query和params合并到state中
    changeLocation(to, state, false);
    currentLocation.value = to;
  }

  function replace(to: string, data?: any) {
    const state = Object.assign({}, buildState(historyState.value.back, to, historyState.value.forward, true), data);
    changeLocation(to, state, true);
    currentLocation.value = to;
  }

  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}

function useHistoryListener(base: string, state: any, currentLocation: { value: string }) {
  const listeners: Function[] = [];

  function listen(fn: Function) {
    listeners.push(fn);
  }

  // 监听路由的变化
  window.addEventListener("popstate", ({ state }) => {
    const to = createCurrentLocation(base); // 当前路径
    const from = currentLocation.value; // 上一次的路径

    // 更新状态
    historyState.state = state;
    // 更新路径
    currentLocation.value = to;
    // 执行监听函数
    listeners.forEach(cb => cb(to, from));
  });

  return {
    listen
  };
}

export function createWebHistory(base: string = ""): History {
  // 这个函数里面实现 push replace 等方法
  const historyNavigator = useHistoryNavigator(base);

  // 实现监听
  const historyListener = useHistoryListener(base, historyNavigator.state, historyNavigator.location);

  // 合并
  const routerHistory = Object.assign({}, historyNavigator, historyListener);

  // 去除.value，方便使用
  Object.defineProperty(routerHistory, "location", {
    get: () => historyNavigator.location.value
  });

  Object.defineProperty(routerHistory, "state", {
    get: () => historyNavigator.state.value
  });

  return routerHistory;
}

export type RouterHistory = ReturnType<typeof createWebHistory>;
```

### 6. history/hash.ts

```ts
import { createWebHistory } from "./h5";

export function createWebHashHistory(): History {
  const history = createWebHistory("#");
  return history;
}
```

### 7. matcher/create-matcher.ts 匹配器

```ts
import type { RouterOptions, RouteRecordRaw } from "../types";

function copyRoute(route: RouteRecordRaw) {
  return {
    name: route.name,
    path: route.path,
    meta: route.meta,
    children: route.children || [],
    components: {
      default: route.component
    }
  };
}

function createRouteRecordMatcher(record, parent) {
  const matcher = {
    path: record.path,
    record,
    parent,
    children: []
  };

  if (parent) {
    parent.children.push(matcher);
  }

  return matcher;
}

export function createMatcher(routes: RouterOptions["routes"]) {
  // 打平的路由存放在这里
  const matchers: ReturnType<typeof createRouteRecordMatcher>[] = [];

  /**
   * route = [
   *  {
   *    name: 'about',
   *    path: '/about',
   *    component: About,
   *    children: [{
    *      name: 'a',
    *      path: 'a',
    *      component: A,
    *    },
    *    {
    *      name: 'b',
    *      path: 'b',
    *      component: B,
    *    }
   *    ]
   *  }
   * ]
   */

  // 添加路由
  function addRouter(route: RouteRecordRaw, parent?) {
    /**
     * normalizedRecord = {
      *  name: 'about',
      *  path: '/about',
      *  component: {
      *    default: About
      *  },
      *  children: [{
        *    name: 'a',
        *    path: 'a',
        *    component: {
        *      default: A
        *    },
        *  },
        *  {
        *    name: 'b',
        *    path: 'b',
        *    component: {
        *      default: B
        *    }
        *  }
      * ]
     * }
     */
    const normalizedRecord = copyRoute(route, parent);
    if (parent) {
      normalizedRecord.path = `${parent.path}/${normalizedRecord.path}`;
    }

    // 组装父子关系
    const matcher = createRouteRecordMatcher(normalizedRecord, parent);

    if (normalizedRecord.children.length > 0) {
      normalizedRecord.children.forEach(child => addRouter(child, matcher));
    }

    matchers.push(matcher);
  }

  // 匹配路由
  function resolve(to: {path: string}) {
    const matched: any:[] = []
    let path = to.path
    let matcher = matchers.find(m => m.path === path)

    while (matcher) {
      // 为什么是unshift，因为父级在前面
      matched.unshift(matcher.record);
      matcher = matcher.parent;
    }

    return {
      path,
      matched
    };
  }

  routes.forEach(route => addRouter(route));

  return {
    addRouter,
    resolve
  };
}
```

### 8. router-link.ts

```ts
import { defineComponent, computed, h, inject } from "vue";
import { ROUTE_KEY } from "./config";

export const RouterLink = defineComponent({
  name: "RouterLink",
  props: {
    to: { type: [String, Object], required: true }
  },
  setup(props, { slots }) {
    const router = useRouter();
    const to = computed(() => {
      return typeof props.to === "string" ? { path: props.to } : props.to;
    });
    return () => {
      // 注意这里创建标签使用的是h函数，而不是createElement
      return h(
        "a",
        {
          onClick: () => {
            if (props.replace) {
              router.replace(to.value);
            } else {
              router.push(to.value);
            }
          }
        },
        slots.default?.() ?? "默认插槽"
      );
    };
  }
});
```

:::tip
?? 是空值合并运算符，只有当左边为 null 或 undefined 时，才会返回右边，0 和 false 不会处理
slots.default?.() 如果 default 有值，并且是个函数，则执行函数，否则返回 null
&&= 左边为真，则进行赋值，否则不进行赋值
||= 左边为假，则进行赋值，否则不进行赋值
:::

### 9. router-view.ts

```ts
import { defineComponent, h, inject, provide, computed } from "vue";
import { useRoute } from "./index";

export const RouterView = defineComponent({
  name: "RouterView",
  setup(props, { slots }) {
    // 数组从0开始，所以需要+1
    const depath = inject("depth", 0);
    // 获取路由
    const route = useRoute() as any;
    // 获取匹配的路由
    const matchRouterRef = computed(() => route.matched[route.depth]);
    // 提供深度
    provide("depth", depath + 1);
    return () => {
      const matchRoute = matchRouterRef.value;
      const viewComponent = matchRoute?.component?.default;
      if (!viewComponent) {
        return slots.default?.() ?? "";
      }
      return h(viewComponent);
    };
  }
});
```
