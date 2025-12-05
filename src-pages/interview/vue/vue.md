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

## 1.computed 原理

- 1. 计算属性维护了一个 dirty 属性，默认是 true，稍后运行过一次会将 dirty 变为 false，并且稍后依赖的值变化后会再次将 dirty 变为 true，这也就是做缓存
- 2. 计算属性也是一个 effect，依赖的属性会收集这个计算属性，当前值发生变化后，会将 computedEffect 里面的 dirty 变为 true
- 3. 计算属性具备收集能力，可以收集对应的 effect，依赖的值变化后会出发 effect 重新执行
