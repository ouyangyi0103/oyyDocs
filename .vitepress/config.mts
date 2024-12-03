import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "oyy Project",
  description:
    "无人扶我青云志，我自踏雪至山巅。若是命中无此运，孤身亦可登昆仑。",
  // 打包输出目录
  outDir: "docs",
  // 根路径
  base: "/oyyDocs/docs",
  // 源目录
  srcDir: "src-pages",
  // 重写路由
  // rewrites: {
  //   "/xm-md/jq.md": "/jq.md",
  //   "/xm-md/track.md": "/track.md",
  //   "/xm-md/monorepo.md": "/monorepo.md"
  // },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右上角导航
    nav: [
      { text: "首页", link: "/index.md" },
      { text: "武林秘籍", link: "/xm-md/jq.md" }
    ],
    // 全局搜索
    search: {
      provider: "local"
    },
    // 左侧导航
    sidebar: [
      {
        text: "知识点",
        items: [
          { text: "jq源码", link: "/xm-md/jq" },
          { text: "项目埋点与监控SDK设计", link: "/xm-md/track" },
          { text: "pnpm与monorepo底层原理", link: "/xm-md/monorepo" }
        ]
      }
    ],
    // 右上角图标
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" }
    ],
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
