---
icon: pen-to-square
date: 2025-01-02
category:
  - MySQL
tag:
  - 踩坑
---

# caching_sha2_password无法加载

> 错误信息：“2059 - Authentication plugin 'caching_sha2_password' cannot be loaded”。这个问题通常是由于MySQL 8.0默认使用了`caching_sha2_password`身份验证插件而导致的。该插件需要相关的共享库文件来正常工作，但如果这些文件缺失或无法加载，就会导致身份验证插件无法正确加载，从而导致错误的出现。

<!-- more -->
**解决方法**：

1. **更改MySQL身份验证插件**：
   
   - 将root用户的身份验证插件更改为`mysql_native_password`，避免使用`caching_sha2_password`插件。可以通过以下SQL命令来实现：
     ```sql
     use mysql;
     ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
     ```
   
2. **安装缺失的共享库文件**：
   - 尝试找到并安装缺失的共享库文件`caching_sha2_password.so`。这通常可以通过重新安装MySQL或使用MySQL的官方安装程序来解决。

3. **重新安装MySQL**：
   - 如果以上方法无效，可以尝试重新安装MySQL，并确保在安装过程中选择正确的选项，以避免出现缺失文件的问题。
