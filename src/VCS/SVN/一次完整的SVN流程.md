# 一次完整SVN流程

## 1. **初始化仓库（Repository）**
   - 首先，创建一个中央版本库，这个版本库将存储项目的所有文件和版本历史。
   - 命令：`svnadmin create /path/to/repository`
   - 之后，开发人员可以通过 URL 访问仓库，如：`svn://example.com/repository_name`

## 2. **检出（Checkout）代码到本地**
   - 开发人员需要将项目从中央仓库检出（checkout）到本地工作目录，这样就能在本地进行开发。
   - 命令：`svn checkout <repository_url>`，例如：
     ```bash
     svn checkout svn://example.com/repository_name/trunk
     ```

## 3. **更新（Update）本地工作副本**
   - 在开发过程中，其他开发人员也可能对代码进行了修改。为了保持本地代码与中央仓库同步，开发人员需要定期更新（update）本地副本。
   - 命令：`svn update`
   - **注意**：在提交前，确保已经更新到最新版本，避免冲突。

## 4. **修改和开发**
   - 开发人员可以在本地工作副本中进行文件的修改、添加、删除等操作。修改完成后，准备提交更改。

## 5. **查看差异（Diff）**
   - 在提交之前，可以使用 `svn diff` 命令查看本地修改与仓库中当前版本的差异。
   - 命令：`svn diff`

## 6. **解决冲突（Conflict）**
   - 如果在更新时发现与中央仓库的代码发生冲突（比如其他开发人员同时修改了相同的文件），SVN 会提示冲突，开发人员需要手动解决冲突。
   - 解决冲突后，文件需要标记为解决冲突，并提交更改。
   - 命令：`svn resolved <file_path>`

## 7. **提交（Commit）更改到中央仓库**
   - 在完成本地开发并解决冲突后，开发人员需要将本地修改提交到中央仓库，以便其他团队成员可以获取这些更改。
   - 提交时，需要写一个简短的描述说明所做的更改。
   - 命令：`svn commit -m "描述信息"`
   - 示例：
     ```bash
     svn commit -m "修复登录界面BUG"
     ```

## 8. **创建分支（Branch）**
   - 在项目开发过程中，可能需要创建分支来进行新功能的开发或修复工作。创建分支后，可以在分支上独立进行开发。
   - 命令：`svn copy <repository_url>/trunk <repository_url>/branches/my-feature-branch`
   - 然后切换到新分支：
     ```bash
     svn switch <repository_url>/branches/my-feature-branch
     ```

## 9. **合并（Merge）分支到主干**
   - 当一个分支开发完成，且希望将其更改合并回主干（`trunk`）时，开发人员需要执行合并操作。
   - 命令：`svn merge <repository_url>/branches/my-feature-branch`
   - 合并后需要进行冲突解决，确保合并后的代码是正确的，并进行测试。

## 10. **查看日志（Log）**
   - 查看项目的历史记录，帮助开发人员理解项目进展、查看过去的提交记录和变更。
   - 命令：`svn log`
   - 示例：
     ```bash
     svn log
     ```

## 11. **删除文件/目录**
   - 如果需要删除文件或目录，可以使用 `svn delete` 命令，将其从仓库中移除。
   - 命令：`svn delete <file_path>`
   - 提交删除操作：
     ```bash
     svn commit -m "删除不再需要的文件"
     ```

## 12. **标签（Tag）管理**
   - 标签是一个用于标记特定版本（如发布版本）的机制。创建标签通常是在项目的一个稳定状态下进行，便于将来版本的回溯和管理。
   - 命令：`svn copy <repository_url>/trunk <repository_url>/tags/v1.0`
   - 这会将 `trunk` 的当前状态作为 `v1.0` 标签保存。

## 13. **维护和清理（Cleanup）**
   - 在进行操作时，可能会遇到一些锁定文件或操作未完成的情况。使用 `svn cleanup` 来清理本地副本，确保它处于一个干净的状态。
   - 命令：`svn cleanup`
