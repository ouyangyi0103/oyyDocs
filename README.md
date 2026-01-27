## vitepress(静态站点生成器，也就是 Static Site Generator(SSG) 技术)

它的前身是 vuepress

## 如何使用？

```sh
npm i vitepress -D
```

## vitepress 特有的 formatter

规则必须是三个 - 必须写在头部

```md
---
prev: '',
text:'上一页',
link: ''
---
```

## SEO (搜索引擎优化)

爬虫机器人会抓取 title description keywords， 其它的交给金钱
h1 标签只能出现一个
main 标签只能出现一个
img alt 必须 title 必须有值

```md
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
```
