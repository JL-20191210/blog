import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    // {
    //   text: "文章",
    //   icon: "book",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },

    // {
    //   text: "如何使用",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
  ],
  "/Java/":"structure" ,
  "/Python/":"structure",
  "/Vue/":"structure",
  "/Spring/":"structure",
  "/MySQL/":"structure",
  "/Netty/":"structure",
  "/Nginx/":"structure",
  "/Redis/":"structure",
  "/Docker/":"structure",
  "/项目实战/":"structure",
  "/Linux/":"structure",
});
