import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "后端",
    icon: "code",
    prefix: "/Java/",
    children: [
      {
        text: "Java",
        link: "/Java/README.md",
        icon: "fa-brands fa-java",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Java/$",
      },
      {
        text: "Python",
        link: "/Python/README.md",
        icon: "fa-brands fa-python",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Python/$",
      },
      {
        text: "JVM",
        link: "/JVM/README.md",
        icon: "fa-brands fa-python",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/JVM/$",
      },
    ],
  },
  {
    text: "Vue",
    icon: "fa-brands fa-vuejs",
    link: "/Vue/",
    activeMatch: "^/Vue/$",
  },
  {
    text: "Spring",
    icon: "fa-solid fa-leaf",
    prefix: "/Spring/",
    link: "Spring",
    children: [
      {
        text: "Spring",
        link: "README.md",
        icon: "fa-solid fa-leaf",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Spring/$",
      },
    ],
  },
  {
    text: "SpringCloud",
    icon: "fa-solid fa-cloud",
    prefix: "/SpringCloud/",
    children: [
      {
        text: "Nacos",
        link: "/SpringCloud/Nacos/",
        icon: "fa-solid fa-cloud",
        // 激活导航栏
        activeMatch: "^/SpringCloud/$",
      },
    ],
  },
  {
    text: "数据库",
    icon: "fa-solid fa-database",
    prefix: "/Database/",
    children: [
      {
        text: "MySQL",
        link: "MySQL/",
        icon: "fa-solid fa-database",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/MySQL/$",
      },
      {
        text: "Redis",
        link: "Redis/",
        icon: "fa-solid fa-server",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Redis/$",
      },
    ],
  },
  {
    text: "Docker",
    icon: "fa-brands fa-docker",
    link: "/Docker/",
    activeMatch: "^/Docker/$",
  },
  {
    text: "Linux",
    icon: "fa-brands fa-linux",
    prefix: "/Linux/",
    link: "Linux",
    children: [
      {
        text: "Linux",
        link: "README.md",
        icon: "fa-brands fa-linux",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Linux/$",
      },
    ],
  },
  {
    text: "Netty",
    icon: "fa-solid fa-n",
    link: "/Netty/",
    activeMatch: "^/Netty/$",
  },
  {
    text: "项目实战",
    icon: "fa-brands fa-product-hunt",
    prefix: "/项目实战/",
    children: [
      {
        text: "谷粒商城",
        link: "谷粒商城/README.md",
        icon: "fa-brands fa-codepen",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/谷粒商城/$",
      },
    ],
  },
  {
    text: "blog",
    icon: "blog",
    link: "http://blog.xiaoxiongmaococo.com:92/#/",
  },
]);
