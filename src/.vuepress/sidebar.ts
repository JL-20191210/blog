import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    // {
    //   text: "MySQL",
    //   icon: "fa-solid fa-database",
    //   prefix: "/Database/MySQL",
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
  "/SpringCloud/":"structure",
  "/Database/":"structure",
  "/Netty/":"structure",
  "/Nginx/":"structure",
  "/Redis/":"structure",
  "/Docker/":"structure",
  "/项目实战/":"structure",
  "/Linux/":"structure",
});
