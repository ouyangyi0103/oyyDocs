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

## 一、类型守卫(类型收缩，类型收窄)

类型守卫是一种用于缩小类型范围的机制，它允许我们在运行时检查变量的类型，并根据类型执行不同的操作。

### 1.typeof 类型守卫

它是有缺陷的，比如数组，对象，函数，Null 等都会返回 object

```ts
const isString = (str: any) => typeof str === "string";

const isNumber = (num: any) => typeof num === "number";

const isBoolean = (bool: any) => typeof bool === "boolean";
```

### 2.instanceof 类型守卫

```ts
const isArray = (arr: any) => arr instanceof Array;

const isObject = (obj: any) => obj instanceof Object;

const isFunction = (func: any) => func instanceof Function;

const isNull = (null: any) => null instanceof Null;
```

### 3.类型谓词 | 自定义守卫

自定义守卫，它只能接手布尔值

#### 语法规则

参数 is 类型

这个函数如果返回 true，那么参数就是该类型

```ts
// 实现一个函数，该函数可以传入任何类型，但是如果是 object 就检查里面的属性，如果里面的属性是 number 就取两位，如果是 string 就去除左右空格，如果是函数就执行

// const isObject = (obj: any): obj is object => {
//   return typeof obj === "object" && obj !== null;
// };

// const isObj = (arg: any) => Object.prototype.toString.call(arg) === "[object Object]";

const isObj = (arg: any): arg is object => ({}.toString.call(arg) === "[object Object]"); // ({}) 相当于是 Object.prototype

const isNumber = (arg: any): arg is number => Object.prototype.toString.call(arg) === "[object Number]";

const isString = (arg: any): arg is string => Object.prototype.toString.call(arg) === "[object String]";

const isFunction = (arg: any): arg is Function => Object.prototype.toString.call(arg) === "[object Function]";

const checkFn = (data: any) => {
  if (isObj(data)) {
    let val;
    // 遍历属性不能用 for in 要用 Object.keys,因为它会遍历原型上的属性
    Object.keys(data).forEach(key => {
      if (isNumber(data[key])) {
        val = data[key].toFixed(2);
      } else if (isString(data[key])) {
        val = data[key].trim();
      } else if (isFunction(data[key])) {
        val = data[key]();
      }
    });
  }
};

checkFn({
  name: " oyy  ",
  age: 18.265,
  fn: function () {
    console.log("fn");
  }
});
```

## 二、类型兼容

所谓的类型兼容性，就是用于确定一个类型是否能赋值给其他的类型。typeScript 中的类型兼容性是基于结构类型的（也就是形状），如果 A 要兼容 B 那么 A 至少具有 B 相同的属性。

### 1.协变 也可以叫鸭子类型

什么是鸭子类型？

一只鸟 走路像鸭子 ，游泳也像，做什么都像，那么这只鸟就可以成为鸭子类型。

```ts
interface A {
  name: string;
  age: number;
}

interface B {
  name: string;
  age: number;
  sex: string;
}

let a: A = {
  name: "老墨我想吃鱼了",
  age: 33
};

let b: B = {
  name: "老墨我不想吃鱼",
  age: 33,
  sex: "女"
};

a = b;
```

A B 两个类型完全不同但是竟然可以赋值并无报错 B 类型充当 A 类型的子类型，当子类型里面的属性满足 A 类型就可以进行赋值，也就是说不能少可以多，这就是协变。

### 2.逆变

逆变一般发生于函数的参数上面

```ts
interface A {
  name: string;
  age: number;
}

interface B {
  name: string;
  age: number;
  sex: string;
}

let a: A = {
  name: "老墨我想吃鱼了",
  age: 33
};

let b: B = {
  name: "老墨我不想吃鱼",
  age: 33,
  sex: "女"
};

a = b;

let fna = (params: A) => {};
let fnb = (params: B) => {};

fna = fnb; //错误

fnb = fna; //正确
```

这里比较绕，注意看 fna 赋值 给 fnb 其实最后执行的还是 fna 而 fnb 的类型能够完全覆盖 fna 所以这一定是安全的，相反 fna 的类型不能完全覆盖 fnb 少一个 sex 所以是不安全的。

### 3.双向协变

tsconfig strictFunctionTypes 设置为 false 支持双向协变 fna fnb 随便可以来回赋值
