# dos2unix换行符清理

> [!important]
>
> `dos2unix` 是一个用于转换文本文件格式的工具，它的主要功能是将 Windows 风格的换行符（`\r\n`）转换为 UNIX/Linux 风格的换行符（`\n`）。通过使用 `dos2unix`，可以避免由于换行符问题导致的脚本执行错误或不兼容问题。

### 主要特点：
- **转换换行符格式**：Windows 系统使用 `\r\n` 作为行结束符，而 UNIX/Linux 系统只使用 `\n`。`dos2unix` 可以帮助你将 Windows 格式的换行符转换为 UNIX 格式。
- **解决跨平台问题**：如果在 Windows 上创建或编辑的文件被传输到 Linux 系统，可能会出现执行错误或显示异常的情况。`dos2unix` 可以确保文件格式适应不同的操作系统。
- **简洁易用**：只需运行一个简单的命令，就能转换文件格式。
<!-- more -->
### 安装和使用：
- **安装**：
  
  ```bash
  sudo apt-get install dos2unix
  ```
  
- **转换文件格式**：
  
  ```bash
  dos2unix filename
  ```
  
- **生成新文件（不修改原文件）**：
  ```bash
  dos2unix filename newfile
  ```

### 适用场景：
- 从 Windows 转移到 Linux 系统时，清理换行符格式问题。
- 处理脚本或配置文件，确保它们能在 Linux 环境下正常运行。

