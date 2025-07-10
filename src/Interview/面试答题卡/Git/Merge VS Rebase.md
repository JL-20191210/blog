---
title: Git 面试答题卡：merge 和 rebase 全面详解
icon: fa-brands fa-git-alt
date: 2025-07-09
author: JeanHu
category:
  - Git
tag:
  - Git
  - merge
  - rebase
  - 版本控制
summary: 本文详细对比了 Git 中 merge 和 rebase 的概念、图示、使用场景、命令和注意事项，适用于面试准备与实战复习。
---
# ☕ Git 面试答题卡：`merge` 和 `rebase` 全面详解

---

## ✅ 一句话概括

> `merge` 用于合并分支，保留分支历史；`rebase` 将当前分支的提交变基到目标分支之上，历史更线性，但可能重写提交历史。

---

## 🧱 基本概念

| 命令         | 定义说明                                             |
| ------------ | ---------------------------------------------------- |
| `git merge`  | 合并两个分支，生成一个新的合并提交，保留所有历史     |
| `git rebase` | 将当前分支的提交“搬到”目标分支之后，使提交历史更整洁 |

---

## 🗄 图示比较：merge vs rebase

### 📌 原始提交历史结构

![fenzhi](assets/fenzhi.jpeg)

### ✅ 使用 `git merge develop`

![merge](assets/merge-2051602.jpeg)

* 保留了分支结构
* `M` 是合并提交 (merge commit)

---

### ✅ 使用 `git rebase develop`

![rebase](assets/rebase.jpeg)

* 把 feature 分支 rebase（变基）到 develop 分支的意思是：让你现在的 feature 分支基于最新的 develop 分支重新开发（创建副本并且移动到末尾）
* B、C 被复制为新的 B'、C'，历史变得线性
* 更整洁，但提交被 **重写**

---

## ⚙️ 常用命令

### 🔹 合并分支（推荐用于公共分支）

```bash
git checkout topic
git merge develop
```

### 🔹 变基分支（推荐用于本地开发整理）

```bash
git checkout topic
git rebase develop
```

---

## 🧠 主要区别总结

| 对比项         | `merge`                  | `rebase`                             |
| -------------- | ------------------------ | ------------------------------------ |
| 历史结构       | 保留分支结构             | 改写为线性结构                       |
| 是否重写提交   | ❌ 否                     | ✅ 是 (新的提交 ID)                   |
| 是否生成新提交 | ✅ 是 (合并提交)          | ❌ 否 (直接改原提交)                  |
| 推荐使用场景   | 合并多人分支、发布前集成 | 本地提交整理、开发中清理无效提交     |
| 使用难度       | 简单，冲突较少           | 较复杂，冲突多需 `rebase --continue` |
| 适合共享分支   | ✅ 是                     | ❌ 否，慎用于已 push 的分支           |

---

## 🚫 注意事项：`rebase` 会改变历史！

* 会更改提交 SHA 值
* **不要 rebase 已 push 的公共分支**，可能造成同步出错
* 遇到冲突需手动解冲并执行 `git rebase --continue`

---

## 🌟 使用推荐

| 目的                        | 推荐使用方式 |
| --------------------------- | ------------ |
| 多人协作，合并开发分支      | `merge` ✅    |
| 本地开发中整理提交          | `rebase` ✅   |
| 避免提交历史混乱            | `merge` ✅    |
| 提交经纪，线性且便于 review | `rebase` ✅   |

---

## 🛠 推荐配合命令

```bash
git merge --no-ff               # 保留合并提交

git rebase -i HEAD~5            # 交互式 rebase，合并/删除提交

git log --graph --oneline --all # 查看提交历史结构图
```

---

## ✏️ 面试答题模板（建议背识）

> `merge` 和 `rebase` 都可用于合并分支。`merge` 保留所有历史，生成合并提交，适合团队协作；而 `rebase` 会将提交挪到目标分支后，形成更线性的提交历史，但会修改原始提交，适合单人开发阶段整理历史。推荐：本地开发用 rebase，协作提交用 merge。

---

## 📚 抽象阅读

* `git rebase -i` 交互式操作（squash 合并多个 commit）
* `git cherry-pick` 与 `rebase` 对比
* `git reflog`：历史恢复神器
* Git flow 工作流中的 merge/rebase 策略s
