# 一次完整的git流程

## 1. **初始化或克隆仓库**
- **初始化 Git 仓库**（如果还没有初始化）：
  ```bash
  git init
  ```
- **克隆远程仓库**（如果你是从远程仓库开始开发）：
  ```bash
  git clone <repository-url>
  ```

## 2. **创建功能分支并开始开发**
- **切换到主分支**（确保在主分支上开发）：
  ```bash
  git checkout main
  ```
- **创建并切换到功能分支**：
  ```bash
  git checkout -b feature/my-new-feature
  ```

## 3. **开发功能并提交更改**
- **查看文件状态**：
  ```bash
  git status
  ```
- **将更改添加到暂存区**：
  - 添加单个文件：
    ```bash
    git add <file-name>
    ```
  - 添加所有文件：
    ```bash
    git add .
    ```
- **查看差异**（查看修改了哪些内容）：
  ```bash
  git diff
  ```
- **提交更改**：
  ```bash
  git commit -m "Add new feature or fix bug"
  ```

## 4. **推送功能分支到远程仓库**
- **推送功能分支到远程仓库**（第一次推送该分支）：
  ```bash
  git push -u origin feature/my-new-feature
  ```
- **推送本地更改到远程仓库**（后续提交）：
  ```bash
  git push
  ```

## 5. **合并功能分支到主分支**
- **切换到主分支**：
  ```bash
  git checkout main
  ```
- **从远程获取主分支的最新更新**（确保你的主分支是最新的）：
  ```bash
  git pull origin main
  ```
- **合并功能分支到本地主分支**：
  ```bash
  git merge feature/my-new-feature
  ```
- **解决冲突**（如果有冲突，Git 会提示，并且需要手动编辑冲突文件，然后再添加和提交）：
  - 解决冲突后，使用 `git add` 添加解决后的文件：
    ```bash
    git add <conflicted-file>
    ```
  - 提交冲突解决：
    ```bash
    git commit -m "Resolve merge conflict"
    ```

## 6. **推送本地主分支的更改到远程仓库**
- **推送本地主分支的更新到远程仓库**：
  ```bash
  git push origin main
  ```

## 7. **删除功能分支**
- **删除本地功能分支**（功能完成后，可以删除本地分支）：
  ```bash
  git branch -d feature/my-new-feature
  ```
- **删除远程功能分支**（如果远程功能分支已经推送到远程仓库，并且不再需要）：
  ```bash
  git push origin --delete feature/my-new-feature
  ```

## 8. **其他常用 Git 命令**
- **查看提交历史**：
  ```bash
  git log
  ```
- **查看当前分支信息**：
  ```bash
  git branch
  ```
