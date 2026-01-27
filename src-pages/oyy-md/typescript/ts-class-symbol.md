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

## 一、class 类

### 1. interface 进行类型约束

```ts
interface Options {
  el: string | HTMLElement;
  init(): viod;
}

interface VueCls {
  options: Options;
}

class Vue implements VueCls {
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }
  init(): void {
    console.log("init");
  }
}

new Vue({
  el: "#app",
  data: {
    msg: "hello"
  }
});
```

### 2. 类的继承

```ts
interface ManX {
  sex: string;
  height: number;
}

class Person {
  name: string;
  age: number;
}

class Man extends Person implements ManX {
  sex: string;
  height: number;
  constructor(name: string, age: number, sex: string, height: number) {
    super(name, age);
    this.sex = sex;
    this.height = height;
  }
}

const man = new Man();
man.name = "张三";
man.age = 18;
man.sex = "男";
```

### 3. 类的修饰符

#### 【1】public

修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的

```ts
class Person {
  public name: string;
  public age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Man extends Person {
  constructor(name: string, age: number) {
    super(name, age);
  }
}

const man = new Man("张三", 18);
```

#### 【2】private

private 修饰的属性或方法是私有的，不能在声明它的类的外部（实例）访问，子类中也不可以访问

```ts
class Parent {
  constructor(private age: number) {
    this.age = age;
  }
}
const p = new Parent(18);
console.log(p.age); // 报错

class Child extends Parent {
  constructor(age: number) {
    super(age);
  }
}
const c = new Child(18);
console.log(c.age); // 报错
```

#### 【3】protected

修饰的属性或方法是受保护的，类里面，子类里面都可以访问，不能在声明它的类的外部（实例）访问

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【4】readonly

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【5】static

修饰的属性或方法是静态的，不能通过实例访问，只能通过类访问

```ts
class Parent {
  public static age: number;
  constructor() {}
  public static getAge() {
    return Parent.age;
  }
}
const p = new Parent();
console.log(p.age); // 报错，因为age是静态属性，不需要实例化，实例上面不存在静态方法
```

#### 【6】可选属性

可选属性是指在类中可以存在也可以不存在的属性。

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【7】属性的封装

```ts
class Person {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  // 存取器---TS中设置getter方法的方式
  get name() {
    console.log("get name()执行了");
    return this._name;
  }

  set name(newValue: string) {
    console.log("set name()执行了");
    this._name = newVlaue;
  }

  get age() {
    return this._age;
  }

  set age(newValue: number) {
    if (newVlaue > 0) {
      this._age = newVlaue;
    }
  }
}

const person = new Person("oyy", 18);
console.log(person.name); // oyy
person.name = "pq";
console.log(person.name); // pq
```

#### 【8】接口和类的结合

```ts
// 写一个接口给类去使用
interface PerItf {
  name: string;
  age: number;
  getName: () => void;
}

class Mperson implements PerItf {
  name: string = "";
  age: number = 18;
  getName() {}
}

let m = new Mperson();

--------------------------------

interface foodInterface {
  type: string;
}
class foodClass implements foodInterface {
  public type: string;
  // public static type: string 不能使用static修饰，因为type是类的静态属性，那么访问的时候只能通过foodClass类
  // 本身访问，在实例上是没有type属性，接口检测的是使用该接口定义的类创建的实例，所以实例上没有type属性
}
class A {
  protected name: string;
}
interface I extends A {}
class B extends A implements I {
  // 对于protected受保护的属性，必须先要继承，再将类与接口结合
  public name: string;
}
```

#### 【9】抽象类

以 abstract 开头的类是抽象类，抽象类和其它类区别不大，只是不能用来创建对象（不允许被实例化），抽象类就是专门用来被继承的类，抽象类是不允许被实例化的。

```ts
abstract class People {
  constructor(public name: string) {}
  // 抽象方法只能定义在抽象类中，子类必须对抽象方法进行重写（即必须被子类实现）
  public abstract printName(): void;
}

let p = new People(); // 报错，抽象类不能被实例化

// 抽象类中的抽象方法必须被子类实现
class Man extends People {
  constructor(name: string) {
    super(name);
    this.name = name;
  }
  public printName() {
    console.log(this.name); // lison
  }
}
const man = new Man("lison");
man.printName();

// abstract还能标记class里面的属性的存取器
abstract class People {
  public abstract _name: string;
  abstract get insideName(): string;
  abstract set insideName(newValue: string);
}
class Man extends People {
  public _name: string;
  public insideName: string;
}
```

## 二、元组

元组是另一种数据结构，它允许我们定义一个已知元素数量和类型的数组，各元素的类型不必相同。

```ts
let tupleArr: [string, number];
tupleArr = ["hello", 10]; // OK 必须按照定义好的顺序赋值
tupleArr = [10, "hello", 9]; // Error 定义的tupleArr长度为2，长度不能大于2
```

## 三、枚举

枚举不是用来定义类型的，是用来列举数据用的

```ts
enum Gender {
  /** 男 */
  Male = 0,
  /** 女 */
  Female = 1
}
let i: { name: string; gender: Gender };
i = { name: "oyy", gender: Gender.Male };
console.log(i.gender === Gender.Male);

enum actionType {
  /** 跑 */
  Run = "run",
  /** 吃 */
  Eat = "eat"
}
const a = actionType.Run;

// 可以这样去使用枚举
enum StatusCode {
  success = 200,
  paramsErr = 400,
  serveErr = 500
}

let code: string | number = 200;
if (code == StatusCode.success) {
  console.log("请求成功");
} else if (StatusCode.paramsErr) {
  console.log("请求失败");
} else if (StatusCode.serveErr) {
  console.log("请求失败,服务器错误");
}

// 注意 增长枚举的值会自动增长

enum StatusCode {
  success,
  paramsErr,
  serveErr
}
console.log(StatusCode.success, StatusCode.paramsErr, StatusCode.serveErr); // 0 1 2
```

### 1.数字枚举

例如 红绿蓝 Red = 0 Green = 1 Blue= 2 分别代表红色 0 绿色为 1 蓝色为 2

```ts
enum Color {
  Red,
  Green,
  Blue
}

//也可以这样写
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}
```

### 2. 增长枚举

```ts
enum StatusCode {
  success,
  paramsErr = 400,
  serveErr
}
console.log(StatusCode.success, StatusCode.paramsErr, StatusCode.serveErr); // 0 400 401
```

### 3. 字符串枚举

字符串枚举的概念很简单。 在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum StatusCode {
  success = "success",
  paramsErr = "paramsErr",
  serveErr = "serveErr"
}
```

### 4. 异构枚举

枚举可以混合字符串和数字成员

```ts
enum StatusCode {
  success = "success",
  paramsErr = 400,
  serveErr = 500
}
```

### 5. 接口枚举

枚举类型可以和接口结合使用，来约束枚举的值

```ts
enum Types {
  yyds,
  dddd
}
interface A {
  red: Types.yyds;
}

let obj: A = {
  red: Types.yyds
};
```

## 四、Symbol 类型

自 ECMAScript 2015 起，symbol 成为了一种新的原生类型，就像 number 和 string 一样。
symbol 类型的值是通过 Symbol 构造函数创建的。

### 1. 可以传递参做为唯一标识 只支持 string 和 number 类型的参数

```ts
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串key
```

### 2. Symbol 的值是唯一的

```ts
const s1 = Symbol();
const s2 = Symbol();
// s1 === s2 => false
```

#### 【1】如何使两个 Symbol 相等

Symbol 的 for 方法，会在全局搜索，看全局有没有注册过这个 key，如果有直接拿来用，如果没有就会去创建一个新的

```ts
let a = Symbol.for("oyy");
let b = Symbol.for("oyy");
// s1 === s2 => true
```

### 3.用作对象属性的键

```ts
let sym = Symbol();

let obj = {
  [sym]: "value"
};

console.log(obj[sym]); // "value"
```

### 4.使用 symbol 定义的属性，是不能通过如下方式遍历拿到的

```ts
const symbol1 = Symbol("666");
const symbol2 = Symbol("777");
const obj1 = {
  [symbol1]: "小满",
  [symbol2]: "二蛋",
  age: 19,
  sex: "女"
};

// 1 for in 遍历
for (const key in obj1) {
  // 注意在console看key,是不是没有遍历到symbol1
  console.log(key);
}

// 2 Object.keys 遍历
Object.keys(obj1);
console.log(Object.keys(obj1));

// 3 getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj1));

// 4 JSON.stringfy
console.log(JSON.stringify(obj1));
```

如何拿到

```ts
// 1 拿到具体的symbol 属性,对象中有几个就会拿到几个
Object.getOwnPropertySymbols(obj1);
console.log(Object.getOwnPropertySymbols(obj1));
// 2 es6 的 Reflect 拿到对象的所有属性
Reflect.ownKeys(obj1);
console.log(Reflect.ownKeys(obj1));
```

### 5.生成器

```ts
function* gen() {
  yield "你好"; // yield后面可以跟同步或者异步
  yield Promise.resolve("好的");
  yield "很好";
  yield "非常好";
}

const man = gen();
console.log(man.next()); // {value: '你好', done: false}
console.log(man.next()); // {value: Promise('好的'), done: false}
console.log(man.next()); // {value: '很好', done: false}
console.log(man.next()); // {value: '非常好', done: false}
console.log(man.next()); // {value: undefined, done: true} done为true说明没有东西可以迭代了
```

### 6.迭代器 Symbol.iterator

```ts
let arr = [1, 2, 3];
arr[Symbol.iterator]().next(); // {value: 1, done: false}
arr[Symbol.iterator]().next().value; // 1
```

#### 【1】手写一个简单的迭代器

```ts
const iterator = (value: any) => {
  let It: any = value[Symbol.iterator]();
  let next: any = { done: false };

  while (!next.done) {
    next = It.next();
    if (!next.done) {
      console.log(next.value);
    }
  }
};
```

#### 【2】迭代器的语法糖 for of

但是 for of 不能用于对象，因为对象身上没有 iterator，上述简单迭代器可以说是 for of 的底层原理

#### 【3】解构

解构和扩展运算符的底层原理 也是去调用 iterator

#### 【4】如何让对象支持 for of

```ts
let obj = {
  max: 5,
  current: 0,
  [Symbol.iterator]() {
    return {
      max: this.max,
      current: this.current,
      next() {
        if (this.max === this.current) {
          return {
            value: undefined,
            done: true
          };
        } else {
          return {
            value: this.current++,
            done: false
          };
        }
      }
    };
  }
};

for (let val of obj) {
  console.log(val); // 0 1 2 3 4
}

let list = [...obj];
console.log(list); // [0,1,2,3,4]
```
