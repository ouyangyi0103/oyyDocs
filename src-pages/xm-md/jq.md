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

# jq 源码

## 一、箭头函数与普通函数的区别

### 1.消除函数的二义性

```js{5}
let Game = function () {
  this.gameName = gameName;
};

那么Game这个函数，我不知道什么时候该new，还是直接调用，这就产生了函数的二义性了，箭头函数的出现就是为了解决这个问题
```

### 2.箭头函数没有原型对象

```js
箭头函数:只能被调用，不能被new
const fn = () => {};
console.log(fn.prototype); // undefined

普通函数:
function fn1() {}
console.log(fn1.prototype); // {constrctor:fn1}

想要new，推荐使用下面的class

class Game {
  constructor(){
    this.game = game;
  }
}
```

## 二、原型

### 1.显式原型

```js
prototype：它是函数的属性
```

### 2.隐式原型

```js
__proto__：它是对象的属性
```

### 3.构造函数

```js
constructor：它指向函数本身
```

### 4.原型连

```js
其实就是 prototype 和 __proto__ 在进行嵌套
那么 __proto__ 这个属性又是指向函数的prototype
```

```js
原型链的尽头是 null
如果自身找不到，就会去找prototype，找不到顺着 prototype 一直找，还找不到就返回 null
```

<!-- ::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
::: -->

## 三、jq 源码解析

```js
(function (global) {
  // 无new构建
  const jQuery = function (selector, context = document) {
    return new jQuery.fn.init(selector, context);
  };
  jQuery.fn = jQuery.prototype;

  jQuery.fn.init = function (selector, context) {
    if (!selector) return this;
    this.dom = document.querySelectorAll(selector);

    return this; // 链式调用
  };

  // 因为 init 与 text互不相干，他们只是挂载在fn上
  // 在调用jq的时候实际上是new 的 init
  // 而进行链式调用时$("div").text("888")，$("div")返回的是init的实例，init上是没有text函数的
  // 所以要进行这一步，将fn挂载在init的原型对象上去
  jQuery.fn.init.prototype = jQuery.fn;

  jQuery.fn.text = function (text) {
    this.dom.forEach((item) => {
      item.textContent = text;
    });
    return this;
  };

  // 设置css
  jQuery.fn.css = function (key, value) {
    this.dom.forEach((item) => {
      item.style[key] = value;
    });

    return this;
  };

  // 获取父节点
  jQuery.fn.parent = function () {
    return this.dom[0].parentElement;
  };

  // 获取相邻元素
  jQuery.fn.siblings = function () {
    const parent = this.parent();
    const children = parent.children;
    const siblings = [];
    for (let i = 0; i < children.length; i++) {
      if (this.dom[0] !== children[i]) {
        siblings.push(children[i]);
      }
    }
    return siblings;
  };

  // 下一个元素
  jQuery.fn.next = function () {
    return this.dom[0].nextElementSibling;
  };

  // 上一个元素
  jQuery.fn.prev = function () {
    return this.dom[0].previousElementSibling;
  };

  // 动画引擎
  jQuery.fn.animate = function (properties, duration, callback) {
    // 记录原始的状态 {width: 100, height: 100}
    const startStyle = {};
    // 返回微妙 其次就是它是从页面加载到此刻所经过的时间
    // requestAnimationFram() 专门做动画的函数 返回当前60fps（也就是一帧）所需要的时间，返回的也是微秒
    const startTime = performance.now();
    const currentDom = this.dom[0];

    for (let key in properties) {
      // 为什么不使用currentDom.style[key] 因为它只能读取到标签中的style
      // getComputedStyle能读取到标签中的style，也能读取css中的样式
      startStyle[key] = parseFloat(getComputedStyle(currentDom)[key]);
    }

    const animateStep = (currentTime) => {
      // currentTime表示上一帧的渲染结束的时间
      const elapsed = currentTime - startTime; // 一帧的持续时间
      // 进度
      const progress = Math.min(elapsed / duration, 1);
      // 不需要加px的属性
      const cssNumberProperties = [
        "opacity",
        "zIndex",
        "fontWeight",
        "lineHeight",
        "zoom"
      ];
      for (let key in properties) {
        const startValue = startStyle[key]; // 原始值
        const endValue = properties[key]; // 目标值
        const value = startValue + (endValue - startValue) * progress;
        currentDom.style[key] = cssNumberProperties.includes(key)
          ? value
          : `${value}px`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        callback && callback();
      }
    };
    requestAnimationFrame(animateStep);
    // 记录变化后的状态 {width: 500, height: 500}
    // 计算增量 {width: 500 - 400 = 100,height: 500- 400 = 100}
    // 计算帧率 60fps progress进度
    // 总耗时 duration
  };

  jQuery.ready = function () {
    // onload 需要等待页面加载完成，比如dom,图片，字体，css等加载完再执行
    // DOMContentLoaded 不需要等待图片，字体，css，它只需要等待dom加载完就会执行
    // 进行优化，如果已经执行过ready，就执行回调函数
    if (document.readyState === "complete") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  };
  global.jQuery = jQuery;
  global.$ = jQuery;
})(typeof window !== "undefined" ? window : globalThis);

// 这里要实现链式调用 需要进行jQuery.fn.init.prototype = jQuery.fn;
$("div").text("888");
```

## 四、requestAnimationFrame() 方法
::: tip window.requestAnimationFrame()
window.requestAnimationFrame() 方法会告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。

对回调函数的调用频率通常与显示器的刷新率相匹配。虽然 75hz、120hz 和 144hz 也被广泛使用，但是最常见的刷新率还是 60hz（每秒 60 个周期/帧）。为了提高性能和电池寿命，大多数浏览器都会暂停在后台选项卡或者隐藏的 iframe 中运行的 requestAnimationFrame()。
:::

::: tip 参数 callback
1.该函数会在下一次重绘更新你的动画时被调用到。这个回调函数只会传递一个参数：一个 DOMHighResTimeStamp 参数，用于表示上一帧渲染的结束时间（基于 time origin 的毫秒数）

2.时间戳是一个以毫秒为单位的十进制数字，最小精度为 1 毫秒。对于 Window 对象（而非 workers）来说，它等同于 document.timeline.currentTime。此时间戳在同一代理上（所有同源的 window，更重要的是同源的 iframe）运行的所有窗口之间共享——它允许在多个 requestAnimationFrame 回调函数中执行同步动画。此时间戳值也近似于在回调函数开始时调用 performance.now()，但它们永远都不会是相同的值。

3.当 requestAnimationFrame() 队列中的多个回调开始在同一帧中触发时，它们都会收到相同的时间戳，即便在计算前一个回调函数工作量时这一帧的时间已经过去。
:::

::: danger 注意
若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 requestAnimationFrame()。requestAnimationFrame() 是一次性的。
:::


:tada:

<!-- ## 贡献者

<script setup>
  import {VPTeamMembers} from 'vitepress/theme'
  const members = [
    {
      name: 'oyy',
      title: '主要开发者',
      avatar: '',
      link: ''
    }
  ]
  <VPTeamMembers size="small" :members="members"></VPTeamMembers>
</script> -->
