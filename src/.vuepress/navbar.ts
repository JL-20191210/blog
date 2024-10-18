import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "后端",
    icon: "code",
    prefix: "/Java/",
    link: "Java",
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
    text: "数据库",
    icon: "fa-solid fa-database",
    prefix: "/MySQL/",
    link: "MySQL",
    children: [
      {
        text: "MySQL",
        link: "README.md",
        icon: "fa-solid fa-database",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/MySQL/$",
      },
    ],
  },
  {
    text: "Docker",
    icon: "fa-brands fa-docker",
    prefix: "/Docker/",
    link: "Docker",
    children: [
      {
        text: "Docker",
        link: "README.md",
        icon: "fa-brands fa-docker",
        // 仅在 `/zh/guide/` 激活
        activeMatch: "^/Docker/$",
      },
    ],
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
  // {
  //   text: "博文",
  //   icon: "pen-to-square",
  //   prefix: "/posts/",
  //   children: [
  //     {
  //       text: "苹果",
  //       icon: "pen-to-square",
  //       prefix: "apple/",
  //       children: [
  //         { text: "苹果1", icon: "pen-to-square", link: "1" },
  //         { text: "苹果2", icon: "pen-to-square", link: "2" },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     {
  //       text: "香蕉",
  //       icon: "pen-to-square",
  //       prefix: "banana/",
  //       children: [
  //         {
  //           text: "香蕉 1",
  //           icon: "pen-to-square",
  //           link: "1",
  //         },
  //         {
  //           text: "香蕉 2",
  //           icon: "pen-to-square",
  //           link: "2",
  //         },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     { text: "樱桃", icon: "pen-to-square", link: "cherry" },
  //     { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
  //     "tomato",
  //     "strawberry",
  //   ],
  // },
  "/demo/",
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
