import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "oyy Project",
  description:
    "无人扶我青云志，我自踏雪至山巅。若是命中无此运，孤身亦可登昆仑。",
  // 打包输出目录
  outDir: "docs",
  // 根路径
  base: "/oyyDocs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右上角导航
    nav: [
      { text: "首页", link: "/" },
      { text: "武林秘籍", link: "/jq" }
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
          { text: "jq源码", link: "/jq" },
          { text: "项目埋点SDK设计", link: "/track" }
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
