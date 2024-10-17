import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Java",
    icon: "fa-brands fa-java",
    prefix: "/Java/",
    children: [
      { text: "函数式接口", icon: "pen-to-square", link: "函数式接口" },
    ],
  },
  {
    text: "Python",
    icon: "fa-brands fa-python",
    prefix: "/Python/",
    children: [
      {
        text: "基础",
        icon: "book",
        prefix: "基础/",
        children: [
          { text: "基础课件", icon: "pen-to-square", link: "video" }
        ]
      },
    ],
  },
  {
    text: "Vue",
    icon: "fa-brands fa-vuejs",
    prefix: "/posts/",
    children: [],
  },
  {
    text: "Spring",
    icon: "fa-solid fa-leaf",
    prefix: "/posts/",
    children: [],
  },
  {
    text: "Docker",
    icon: "fa-brands fa-docker",
    prefix: "/posts/",
    children: [],
  },
  {
    text: "Linux",
    icon: "fa-brands fa-linux",
    prefix: "/posts/",
    children: [],
  },
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "苹果",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
          "3",
          "4",
        ],
      },
      {
        text: "香蕉",
        icon: "pen-to-square",
        prefix: "banana/",
        children: [
          {
            text: "香蕉 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "香蕉 2",
            icon: "pen-to-square",
            link: "2",
          },
          "3",
          "4",
        ],
      },
      { text: "樱桃", icon: "pen-to-square", link: "cherry" },
      { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
      "tomato",
      "strawberry",
    ],
  },
  "/demo/",
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
