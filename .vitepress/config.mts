import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "oyy Project",
  description: "无人扶我青云志，我自踏雪至山巅。若是命中无此运，孤身亦可登昆仑。",
  // 根路径
  base: "/oyyDocs/",
  // 输出目录
  outDir: "docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右上角导航
    nav: [
      { text: "首页", link: "index.md" },
      {
        text: "武林秘籍",
        items: [
          { text: "vue2/3", link: "src-pages/interview/vue/vue.md" },
          { text: "Item B", link: "/item-2" },
          { text: "Item C", link: "/item-3" }
        ]
      }
    ],
    // 全局搜索
    search: {
      provider: "local"
    },
    // 左侧导航
    sidebar: [
      {
        text: "xm学堂",
        collapsed: true,
        items: [
          { text: "一、jq源码", link: "src-pages/xm-md/jq" },
          { text: "二、项目埋点与监控SDK设计", link: "src-pages/xm-md/track" },
          { text: "三、monorepo与pnpm的原理", link: "src-pages/xm-md/monorepo" },
          { text: "四、axios原理", link: "src-pages/xm-md/axios" },
          { text: "五、vue-router4源码", link: "src-pages/xm-md/vue-router4" },
          { text: "六、网站部署与CICD", link: "src-pages/xm-md/cicd" }
        ]
      },
      {
        text: "oyy",
        collapsed: true,
        items: [
          {
            text: "一、TypeScript",
            collapsed: true,
            items: [
              {
                text: "基础类型",
                link: "src-pages/oyy-md/typescript/ts-base"
              },
              { text: "高级类型", link: "src-pages/oyy-md/typescript/ts-hightype" },
              { text: "类-Symbol", link: "src-pages/oyy-md/typescript/ts-class-symbol" },
              { text: "泛型", link: "src-pages/oyy-md/typescript/ts-generic" },
              { text: "模块化解析", link: "src-pages/oyy-md/typescript/ts-module" },
              { text: "装饰器", link: "src-pages/oyy-md/typescript/ts-decorator" },
              { text: "发布订阅模式-set-map", link: "src-pages/oyy-md/typescript/ts-pubsub" },
              { text: "Proxy & Reflect", link: "src-pages/oyy-md/typescript/ts-proxy-reflect" },
              { text: "类型守卫-类型兼容", link: "src-pages/oyy-md/typescript/ts-type-guard" },
              { text: "infer关键字", link: "src-pages/oyy-md/typescript/ts-infer" }
            ]
          },
          {
            text: "二、React",
            collapsed: true,
            items: [
              { text: "TSX", link: "src-pages/oyy-md/react/tsx" },
              { text: "使用工具", link: "src-pages/oyy-md/react/utils" },
              { text: "原理", link: "src-pages/oyy-md/react/principle" },
              { text: "Hooks", link: "src-pages/oyy-md/react/hooks" },
              { text: "组件", link: "src-pages/oyy-md/react/components" },
              { text: "路由", link: "src-pages/oyy-md/react/router" },
              { text: "状态管理-Zustand", link: "src-pages/oyy-md/react/zustand" }
            ]
          },
          {
            text: "三、Next",
            collapsed: true,
            items: [
              { text: "基础使用", link: "src-pages/oyy-md/next/base" },
              { text: "核心概念", link: "src-pages/oyy-md/next/core" }
            ]
          },
          {
            text: "四、Node",
            collapsed: true,
            items: [
              { text: "概述与原理", link: "src-pages/oyy-md/node/base" },
              { text: "核心API", link: "src-pages/oyy-md/node/coreApi" },
              { text: "实用工具与其它", link: "src-pages/oyy-md/node/utils" },
              { text: "数据库mysql", link: "src-pages/oyy-md/node/mysql" },
              { text: "redis与登录技术", link: "src-pages/oyy-md/node/redis" },
              { text: "项目架构与其它", link: "src-pages/oyy-md/node/project" }
            ]
          },
          {
            text: "五、Nest",
            collapsed: true,
            items: [
              { text: "基础使用", link: "src-pages/oyy-md/next/base" },
              { text: "核心概念", link: "src-pages/oyy-md/next/core" }
            ]
          }
        ]
      }
    ],
    // 右上角图标
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
    // 底部页脚
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
    // 最后修改时间-必须配合git才有效，git提交时间，它就会被列为最后修改时间
    lastUpdated: {
      text: "最后修改时间",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "short"
      }
    }
  }
});
