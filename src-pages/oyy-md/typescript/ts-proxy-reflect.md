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

## 一、Proxy & Reflect

### 1.Proxy

Proxy 是 ES6 引入的一种新的对象，它允许我们拦截和修改对象的操作。

#### 【1】Proxy 的语法

target 目标对象，支持对象、函数、数组、Set、Map 等

```ts
let person = {
  name: "oyy",
  age: 18
};
let proxy = new Proxy(person, {
  // 取值
  get(target, prop) {
    return target[prop];
  },
  // 设置值
  set(target, key, value, receiver) {
    // target 目标对象  person
    // key 属性名 name age
    // value 属性值
    // receiver 代理对象 person
    target[key] = value;
    return true;
  },
  // 拦截函数调用
  apply(target, ctx, args) {
    // target 目标对象  person
    // ctx 上下文对象  person
    // args 参数数组 [1, 2, 3]
    return target(...args);
  },
  // 拦截 in 操作符
  has(target, key) {
    return key in target;
  },
  // 拦截 for...in 操作符
  ownKeys(target) {
    return Object.keys(target);
  },
  // 拦截 new 操作符
  construct(target, args) {
    return new target(...args);
  },
  // 拦截 delete 操作符
  deleteProperty(target, key) {
    return delete target[key];
  }
});
```

#### 【2】Proxy 的拦截操作

支持 13 种拦截操作

- get(target, prop, receiver)
- set(target, prop, value, receiver)
- apply(target, ctx, args)
- has(target, key)
- ownKeys(target)
- construct(target, args)
- deleteProperty(target, key)
- ownKeys(target)
- getOwnPropertyDescriptor(target, key)
- defineProperty(target, key, descriptor)
- getPrototypeOf(target)
- setPrototypeOf(target, proto)
- isExtensible(target)
- preventExtensions(target)

#### 【3】Proxy 的局限性

- 无法拦截对象的静态方法
- 无法拦截对象的继承方法
- 无法拦截对象的属性描述符
- 无法拦截对象的继承属性
- 无法拦截对象的继承方法

#### 【4】示例

```ts
let person = {
  name: "oyy",
  age: 18
};

let proxy = new Proxy(person, {
  get(target, key, receiver) {
    if (target.age <= 18) {
      // 返回Reflect.get的值 相当于target[key] 只不过它会帮我们去操作这个对象，并且第三个参数是代理对象，可以保证上下文的正确
      return Reflect.get(target, key, receiver);
    } else {
      return "成年了";
    }
  }
});

proxy.age;
```

### 2.Reflect

Reflect 是 ES6 引入的一种新的对象，它提供了一系列静态方法，用于操作对象。参数和 Proxy 的拦截操作一样

#### 【1】Reflect 的语法

```ts
let person = {
  name: "oyy",
  age: 18
};

// 普通对象取值
console.log(person.name); // oyy

// 使用Reflect取值
console.log(Reflect.get(person, "name", person)); // oyy

// 使用Reflect设置值  它设置成功会返回true
Reflect.set(person, "name", "oyy1", person);
console.log(person.name); // oyy1

// 使用Reflect删除值  它删除成功会返回true
Reflect.deleteProperty(person, "name", person);
console.log(person.name); // undefined
```

#### 【2】Reflect 的静态方法

- get(target, key, receiver)
- set(target, key, value, receiver)
- deleteProperty(target, key)
- has(target, key)
- ownKeys(target)
- getOwnPropertyDescriptor(target, key)
- defineProperty(target, key, descriptor)
- getPrototypeOf(target)
- setPrototypeOf(target, proto)
- isExtensible(target)
- preventExtensions(target)

#### 【3】Reflect 的局限性

- 无法拦截对象的静态方法
- 无法拦截对象的继承方法
- 无法拦截对象的属性描述符
- 无法拦截对象的继承属性
- 无法拦截对象的继承方法

### 3.编写观察者模式

```ts
// 观察者列表
const list: Set<Function> = new Set();

// 添加观察者
const add = (cb: Function) => {
  if (!list.has(cb)) {
    list.add(cb);
  }
};

// 删除观察者
const remove = (fn: Function) => {
  list.delete(fn);
};

// 观察者
const observer = <T extends object>(target: T) => {
  const proxy = new Proxy(target, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // 数据发生变化时,通知观察者
      list.forEach(fn => fn(key, value));
      return result;
    }
  });

  return proxy;
};

// 添加观察者
add((key, value) => {
  console.log(`${key} 发生了变化,值为 ${value}`);
});

// 删除观察者
remove((key, value) => {});

// 观察者
const observer = observer({
  name: "oyy",
  age: 18
});

observer.name = "oyy1";
```
