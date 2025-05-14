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

## 一、发布订阅模式

发布订阅模式是一种设计模式，它定义了对象间的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知并自动更新。

```ts
interface IEvent {
  events: Map<string, Function[]>;
  on: (eventName: string, callback: Function) => viod;
  emit: (eventName: string, ...args: any[]) => void;
  off: (eventName: string, callback: Function) => viod;
  once: (eventName: string, callback: Function) => viod;
}

class Emitter implements IEvent {
  events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, callback: Function): void {
    if (this.events.has(eventName)) {
      // 说明已经存过了，有这个事件了
      const callbackList = this.events.get(eventName);
      callbackList && callbackList.push(callback);
    } else {
      // 说明没有存过事件，第一次存
      this.events.set(eventName, [callback]);
    }
  }

  emit(eventName: string, ...args: any[]): void {
    const callbackList = this.events.get(eventName);
    if (callbackList) {
      callbackList.forEach(callback => {
        callback(...args);
      });
    }
  }

  off(eventName: string, callback: Function): void {
    const callbackList = this.events.get(eventName);
    if (callbackList) {
      const index = callbackList.indexOf(callback);
      if (index !== -1) {
        callbackList.splice(index, 1);
      }
    }
  }

  once(eventName: string, callback: Function): void {
    // 创建一个自定义函数，再通过 on 触发。触发完毕之后立马通过 off 移除掉
    const fn = (...args: any[]) => {
      callback(...args);
      this.off(eventName, fn);
    };

    this.on(eventName, fn);
  }
}

const bus = new Emitter();

const fn = (a, b) => {
  console.log(a, b);
};

bus.on("test", fn);

bus.off("test", fn);

bus.emit("test", 1, 2);
```

## 二、set | map | weakSet | weakMap

### 1.Set

Set 是 ES6 引入的一种新的数据结构，它允许我们存储任何类型的数据，但每个元素只能出现一次。换句话说，Set 中的元素是唯一的，不允许有重复值。它天然去重，但是引用类型除外

#### 【1】属性

size：返回字典所包含的元素个数

```ts
const set = new Set();
set.add(1);
set.add(2);
set.add(2); // 重复添加2，Set会忽略
console.log(set.size); // 输出：2
```

#### 【2】操作方法

- 添加元素：使用 add()方法。
- 删除元素：使用 delete()方法。
- 检查元素是否存在：使用 has()方法。
- 清空 Set：使用 clear()方法。

```ts
let set: Set<number> = new Set([1, 2, 3, 4]);

set.add(5);

set.has(5);

set.delete(5);

set.size; //4
```

#### 【3】遍历方法

Set 中的元素可以通过 for...of 循环或 forEach 方法进行遍历。

```ts
const set = new Set([1, 2, 3]);
for (const item of set) {
  console.log(item);
}
// 输出：1, 2, 3
set.forEach(item => {
  console.log(item);
});
// 输出：1, 2, 3
```

### 2.Map

Map 也是 ES6 引入的一种新的数据结构，它允许我们存储键值对（key-value pairs）。与普通对象不同，Map 的键可以是任意数据类型，包括对象、函数等。

```ts
let obj = { name: "小满" };
let map: Map<object, Function> = new Map();

map.set(obj, () => 123);

map.get(obj);

map.has(obj);

map.delete(obj);

map.size;
```

操作方法同 Set

#### 遍历方法

Map 中的键值对可以通过 for...of 循环或 forEach 方法进行遍历。在遍历过程中，我们可以同时访问键和值。

```ts
const map = new Map();
map.set("name", "Alice");
map.set("age", 30);
for (const [key, value] of map) {
  console.log(key, value);
}
// 输出：
// name Alice
// age 30
map.forEach((value, key) => {
  console.log(key, value);
});
// 输出：
// name Alice
// age 30
```

```ts
let map = new Map();
map.set("name", "Jasmine").set("sex", "Female").set("age", 31);
for (let key of map.keys()) {
  console.log(key);
}
// name
// sex
// age

let map = new Map();
map.set("name", "Jasmine").set("sex", "Female").set("age", 31);
for (let key of map.values()) {
  console.log(key);
}
// Jasmine
// Female
// 31

let map = new Map();
map.set("name", "Jasmine").set("sex", "Female").set("age", 31);
for (let entry of map.entries()) {
  console.log(entry);
}

// (2) ['name', 'Jasmine']
// (2) ['sex', 'Female']
// (2) ['age', 31]
```

### 3.WeakSet

WeakSet 是 ES6（ECMAScript 2015）引入的一种新的集合类型，用于存储对象的集合，并且这些对象都是弱引用。
弱引用的含义是，如果没有其他引用指向集合中的对象，垃圾回收器可以自动回收这些对象，而不会因为它们存在于 WeakSet 中而阻止回收

#### 【1】特点

- 只能存储对象：WeakSet 只能包含对象引用，不能包含原始值（如字符串、数字、布尔值等），尝试添加非对象类型的值将抛出 TypeError
- 对象的弱引用：集合中的对象不计入垃圾回收器的引用计数中，如果没有其他引用，垃圾回收器可以回收这些对象。
- 不可迭代：WeakSet 无法被遍历，没有 entries()、keys()、values()、forEach()等方法。
  没有 size 属性：由于弱引用的特性，WeakSet 无法提供集合的大小信息。

方法与 Set 一样

### 4.WeakMap

Map 可以解决对象的 key 不能为对象的缺陷，但是又随之而来一个缺点：耗费内存，强引用。

ES6（ECMAScript 2015）考虑到这一点，推出了 WeakMap，用于存储键值对，其中键必须是对象，值可以是任意类型。
与 Map 不同的是，WeakMap 的键是弱引用，也就是说，如果键对象没有被其他地方引用，则它们可以被垃圾回收。
这使得 WeakMap 非常适合缓存数据，因为当对象不再需要时，它们可以自动从 WeakMap 中删除，从而释放内存。

#### 【1】特点

- 键必须是对象：WeakMap 的键必须是对象，不能是原始值（如字符串、数字、布尔值等）。
- 弱引用：键对象没有被其他地方引用时，可以被垃圾回收。
- 不可迭代：由于键的弱引用特性，WeakMap 无法被遍历，没有 entries()、keys()、values()、forEach()等方法。

#### 【2】操作方法

- 添加元素：使用 set()方法。
- 删除元素：使用 delete()方法。
- 检查元素是否存在：使用 has()方法。

#### 【3】使用场景

##### 解决内存泄漏问题

内存泄漏是指程序中不再使用的对象仍然保留在内存中，导致内存占用过高，甚至可能导致程序崩溃。
WeakMap 可以用来解决这个问题，因为它的键是弱引用的，当键不再被其他对象引用时，WeakMap 会自动释放对应的键值对，从而避免内存泄漏。

```ts
// 示例：使用 WeakMap 解决内存泄漏问题
class LeakyClass {
  constructor() {
    this.data = new Map();
  }
  // 添加数据
  setData(key, value) {
    this.data.set(key, value);
  }
  // 获取数据
  getData(key) {
    return this.data.get(key);
  }
  // 移除数据
  removeData(key) {
    this.data.delete(key);
  }
}
// 创建 LeakyClass 的实例
let leakyObject = new LeakyClass();
// 将对象添加到 WeakMap 中，并将其作为键
let weakMap = new WeakMap();
weakMap.set(leakyObject, "some data");
// 断开对 leakyObject 的引用
leakyObject = null;
// 检查 WeakMap 中是否仍然存在对应键值对
console.log(weakMap.has(leakyObject)); // false

/*在上述示例中，我们创建了一个LeakyClass类，它有一个data属性，用于存储数据。我们将leakyObject添加到weakMap中，
并将其作为键。然后，我们断开对leakyObject的引用，此时leakyObject成为垃圾回收的候选对象。
最后，我们检查weakMap中是否仍然存在对应键值对。由于leakyObject已经不再被引用，它将被垃圾回收，因此weakMap.has(leakyObject)返回false。*/
```
