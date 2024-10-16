import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  lang: "zh-CN",
  title: "小满",
  description: "小满的知识库",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
