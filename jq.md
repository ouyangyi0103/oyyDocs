# jq 源码

## 一、箭头函数与普通函数的区别

**1.消除函数的二义性**

```js{5}
let Game = function () {
  this.gameName = gameName;
};

那么Game这个函数，我不知道什么时候该new，还是直接调用，这就产生了函数的二义性了，箭头函数的出现就是为了解决这个问题
```

**2.箭头函数没有原型对象**

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

**1.显式原型**

```js
prototype：它是函数的属性
```

**2.隐式原型**

```js
__proto__：它是对象的属性
```

**3.构造函数**

```js
constructor：它指向函数本身
```

**4.原型连**

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

  global.jQuery = jQuery;
  global.$ = jQuery;
})(typeof window !== "undefined" ? window : globalThis);

// 这里要实现链式调用 需要进行jQuery.fn.init.prototype = jQuery.fn;
$("div").text("888");
```

<!-- ## 贡献者 -->

<!-- <script setup>
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
