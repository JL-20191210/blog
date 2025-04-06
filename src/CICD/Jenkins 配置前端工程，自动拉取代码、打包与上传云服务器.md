---
title: Jenkins配置后端
date: 2025-04-06
category:
  - DevOps
tag:
  - CICD
---
title: Jenkins配置后端
date: 2025-04-06
category:
  - DevOps
tag:
  - CICD
---
---
# Jenkins 配置前端工程，自动拉取代码、打包与上传云服务器

本小节中，将演示如何在 `Jenkins` 中配置一键部署 `weblog` **前端工程**，流程中包括拉取最新的 `master` 分支代码、执行 `npm run build` 打包，并最终连接云服务器，上传 `/dist` 文件夹下所有文件至 `Nginx` 静态文件目录下。
<!-- more -->
## 1. 创建 Job

首先，在 `Jenkins` 首页中，点击点击左侧栏的 *新建任务*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726172.jpeg)

输入任务名称，取名为 `weblog-vue3` , 选择 *Freestyle project* 自由类型的项目，点击*确定*按钮：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726258.jpeg)

进入到 `weblog-vue3` 任务的具体配置环节，先给这个任务填写描述文字，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726210.jpeg)

## 2. 配置 Git 源码管理

接着，进入到源码管理的配置，如下图所示：

> TIP : 和上小节配置后端的步骤一致，这一块就直接复制过来了。

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726573.jpeg)

> - ①： Git 仓库的地址，可以在 Gitee 中该仓库主页，复制其仓库地址；
>
>   ![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726050.jpeg)
>
> - ②：配置 Gitee 的登录账号、密码（未配置，或者登录信息不正确，会提示*无法连接仓库*）；
>
>   ![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061726167.jpeg)

添加完成后，若账号、密码正确，则*无法连接仓库*的错误信息会自动消失。在 Credentials 选项中，选择刚刚配置好的登录账号/密码，指定拉取 `master` 主分支的代码，最后点击*保存*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727302.jpeg)

## 3. 构建任务

配置完成后，回到首页中，针对 `weblog-vue3` 任务，点击右侧的*运行*按钮，开始构建：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727967.jpeg)

点击左侧正在构建的任务，再点击*控制台输出*，即可实时查看构建日志：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727788.jpeg)

> 解释一下构建日志关键的几个地方：
>
> - ①：表示**构建空间**的路径在 `/var/jenkins_home/workspace/weblog-vue3` 目录下，根据之前运行容器时指定的挂载路径，即为宿主机中的 `E:\docker\jenkins2\jenkins_home\workspace\weblog-vue3` 目录；
> - ②：拉取远程仓库的最新代码，对应的提交信息，可以依此来判断拉取的，是不是最新的代码；
> - ③：构建完毕；

任务执行成功后，进入到 `E:\docker\jenkins2\jenkins_home\workspace\`工作空间下，即可看到新建的任务了，点击进去即可看到最新拉取的代码了：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727714.jpeg)

## 4. 安装 NodeJS 插件

前端代码拉取完毕后，就轮到打包环节了。这里需要先给 `jenkins` 容器安装上 `nodejs` 环境，回到首页，点击 *系统管理 | 插件管理 | Available Plugins* , 输入关键词 *nodejs* , 勾选上点击安装：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727525.jpeg)

勾选*安装完成后重启 Jenkins* , 等待安装完成，观察容器是否运行，若停止了则表示插件安装成功了，这个时候，手动重启一下 `jenkins` 容器：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727989.jpeg)

## 5. 全局配置 NodeJS

重新进入 `jenkins` 后台，点击 *系统管理 | 全局工具配置* ，找到 *NodeJS 安装*，开始配置：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727799.jpeg)

> - 填写 `nodejs` 的别名；
> - 勾选**自动安装**；
>
> > TIP : 如果碰到 `nodejs` 自动安装失败的情况，可参考球友分享的这篇帖子：https://t.zsxq.com/162Vkp9fr
>
> - 版本这里选择的是，最新的 `NodeJS 21.5.0` 版本；
> - 点击**保存**；

## 6. 配置前端打包

`nodejs` 环境配置完成后，继续配置 `weblog-vue3` 任务，在*构建环境*选项中，勾选上 *Provide Node & npm bin/folder to PATH* , 版本选择刚刚配置好的 `nodejs21` , 如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727905.jpeg)

接着，点击 *增加构建步骤 | 执行 shell* :

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727542.jpeg)

输入 `shell` 命令如下，命令也很简单，首先进入到前端工程的根目录下，先安装相关依赖包，再执行打包命令：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727371.jpeg)

```bash
cd /var/jenkins_home/workspace/weblog-vue3/weblog-vue3
npm install
npm run build
```

点击保存后，回到首页，点击运行 `weblog-vue3` 构建任务，查看构建日志如下，若提示如下信息，则表示前端打包成功了：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727148.jpeg)

> TIP : 第一次构建需要安装 `nodejs` 环境，可能比较慢，请耐心等待其安装完毕。

任务构建完完成后，进入到 `E:\docker\jenkins2\jenkins_home\workspace\weblog-vue3\weblog-vue3` 目录下，查看是否有 `/dist` 文件夹，来确认一下是否真的打包成功了：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727617.jpeg)

## 7. 上传前端文件至 Nginx 静态目录

打包完成后，继续配置 `weblog-vue3` 构建任务，在执行 `shell` 脚本任务后面，点击*增加构建步骤* ，选择 *Send files or execute commands over SSH* :

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727610.jpeg)

> ①： 选择要上传的云服务器；
>
> ②：需要上传的源文件，这里是 `/dist` 文件夹下的所有文件；
>
> ③： 删除文件夹前缀；
>
> ④：需要上传到云服务器哪个目录下；
>
> ⑤：点击保存；

保存后，回到首页，再次点击构建 `weblog-vue3` 任务，并查看构建日志，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727543.jpeg)

若看到类似 `Transferred 116 files` 信息，则表示上传成功了 116 个文件。也可以进入到云服务器中 `/docker/nginx/html` 目录下，查看相关文件的更新时间，若是最新的时间，表示是刚刚上传上去的：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061727169.jpeg)

至此，通过 `Jenkins` 一键拉取远程仓库的前端 `master` 分支代码，执行 `npm run build` 打包，并上传到云服务器中 `nginx` 静态目录下的工作就完成了。