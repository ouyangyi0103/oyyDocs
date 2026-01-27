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

## 一、infer 关键字

infer 关键字用于在条件类型中推断类型，言简意赅，infer 就是推导泛型参数

:::tip
言简意赅，infer 就是推导泛型参数，并且 infer 声明只能出现在 extends 子语句中
:::

```ts
interface User {
  name: string;
  age: number;
}

type PromiseType = Promise<User>;

type GetPromiseType<T> = T extends Promise<infer U> ? U : never;

type Pres = GetPromiseType<PromiseType>;

// 多层嵌套的情况

type PromiseType = Promise<Promise<Promise<User>>>;

type GetPromiseType<T> = T extends Promise<infer U> ? GetPromiseType<U> : never;

type Res = GetPromiseType<PromiseType>;
```

### 1.infer 的协变

```ts
let obj = {
  name: "张三",
  age: 18
};

// 里面都写成 infer U ，那么就会产生协变，返回的类型就是 U 的联合类型
type Bar<T> = T extends { name: infer U; age: infer U } ? U : T;

type res = Bar<typeof obj>; // type res = string | number
```

### 2.infer 的逆变

一般出现在函数的参数上，逆变返回的是交叉类型

```ts
type Bar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : "null";

type res = Bar<{
  a: (x: number) => void;
  b: (x: number) => void;
}>; // type res =  number

type res = Bar<{
  a: (x: number) => void;
  b: (x: string) => void;
}>; // type res =  never;
// 这里为什么返回的是never，因为逆变返回的是交叉类型，也就是 type res = number & string，这是不可能的，所以返回的是never
```

## 二、infer 类型提取

### 1.提取头部元素

```ts
type Arr = [1, 2, 3];

type First<T extends any[]> = T extends [infer one, ...any[]] ? one : never;

type res = First<Arr>; // type res = 1

type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : never;

type res = Last<Arr>; // type res = 3
```

### 2.递归

```ts
type Arr = [1, 2, 3];

type ReverseArr<T extends any[]> = T extends [infer one, ...infer rest] ? [...ReverseArr<rest>, one] : T;

type res = ReverseArr<Arr>; // type res = [3, 2, 1]
```
