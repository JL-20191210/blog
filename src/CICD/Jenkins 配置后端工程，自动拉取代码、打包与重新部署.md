---
title: Jenkins配置后端
date: 2025-04-06
category:
  - DevOps
tag:
  - CICD
  - Jenkins
---
# Jenkins 配置后端工程，自动拉取代码、打包与重新部署

本小节中，将演示如何在 `Jenkins` 中配置一键部署 `weblog` 后端工程，流程中包括拉取最新的 `master` 分支代码、执行 `maven` 打包，并最终连接云服务器，上传 `jar` 包并重启 `Spring Boot` 服务。

<!-- more -->
## 1. 创建 Job

首先，在 `Jenkins` 首页中，点击 *Create a job* , 或者点击左侧栏的 *新建 Item*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061721690.jpeg)

输入任务名称，取名为 `weblog-springboot` , 选择 *Freestyle project* 自由类型的项目，点击*确定*按钮：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722705.jpeg)

进入到 `weblog-springboot` 任务的具体配置环节，先给这个任务填写描述文字，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061721901.jpeg)

## 2. 配置 Git 源码管理

接着，进入到源码管理的配置，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722668.jpeg)

> - ①： Git 仓库的地址，可以在 Gitee 中该仓库主页，复制其仓库地址；
>
>   ![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061721822.jpeg)
>
> - ②：配置 Gitee 的登录账号、密码（未配置，或者登录信息不正确，会提示*无法连接仓库*）；
>
>   ![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722551.jpeg)

添加完成后，若账号、密码正确，则*无法连接仓库*的错误信息会自动消失。在 Credentials 选项中，选择刚刚配置好的登录账号/密码，指定拉取 `master` 主分支的代码，最后点击*保存*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722904.jpeg)

## 3. 构建任务

配置完成后，回到首页中，点击右侧的*运行*按钮，开始构建任务：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722342.jpeg)

点击左侧正在构建的任务，再点击*控制台输出*，即可实时查看构建日志：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722072.jpeg)

> 解释一下构建日志关键的几个地方：
>
> - ①：表示构建空间的路径在 `/var/jenkins_home/workspace/weblog-spring` 目录下，根据之前运行容器时指定的挂载路径，即为宿主机中的 `E:\docker\jenkins2\jenkins_home\workspace\weblog-springboot` 目录；
> - ②：拉取远程仓库的最新代码，对应的提交信息，可以依此来判断拉取的，是不是最新的代码；
> - ③：构建完毕；

任务执行成功后，进入到 `E:\docker\jenkins2\jenkins_home\workspace\weblog-springboot`工作空间下，确认一下代码是否拉取成功：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722932.jpeg)

## 4. 配置 Maven

拉取远程仓库 `master` 分支代码是第一步，这一步完成后，就要开始通过 `maven` 来打包了。首先，将本机中下载解压完成的 `maven` 文件夹，整个复制到 `E:\docker\jenkins2\jenkins_home` 文件夹下：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722668.jpeg)

复制完成后，还需要将 `/apache-maven-3.9.4/conf/settings.xml` 配置文件中的仓库地址修改一下，根据运行容器时，指定的路径挂载关系，配置如下：

```bash
 <localRepository>/var/jenkins_home/apache-maven-3.9.4/repository</localRepository>
```

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722171.jpeg)

接下来，开始在 `Jenkins` 中配置 `maven` , 依次点击 *Manage Jenkins | Tools* ：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061723535.jpeg)

设置 `maven` 的 `settings.xml` 具体路径，如下图：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722214.jpeg)

配置完成后，滑动到最后，如下图：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722874.jpeg)

> - ①：自定义 `maven` 的名称；
> - ②：填写 `maven` 根文件夹路径；

点击保存。

## 5. Maven 打包

`maven` 配置完成后，继续配置 `weblog-springboot` 任务，在拉取代码后面的 `Build Steps` 选项中，点击*增加构建步骤*， 选择*调用顶层 Maven 目标* ：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722953.jpeg)

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722561.jpeg)

> ①：选择刚刚配置好的 `maven` 版本；
>
> ②：**目标**填写执行的打包命令，因为我们没有编写单元测试，添加跳过测试参数，命令如下：
>
> ```go
> clean package -Dmaven.test.skip=true
> ```
>
> ③：针对哪个 `pom` 文件打包，定位到工作空间中父项目 `weblog-springboot/pom.xml`；
>
> ④：点击保存；

这一步配置完成后，再次回到首页，执行构建任务，一步一个脚印，保证每个环节都是 `ok` 的，直到将整个流程测试完成。查看构建日志，若提示 `BUILD SUCCESS` 则打包也没有问题了：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722228.jpeg)

也可以到 `jenkins` 工作空间的 `weblog-web/target` 目录下，确认一下 `jar` 包是否打成功了：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722632.jpeg)

## 6. Publish Over SSH 插件安装

`jar` 包打成功后，就要开始配置将 `jar` 包上传到云服务器，并重启服务了。为了完成这一步，我们需要先下载 *Publish Over SSH 插件* ，依次点击菜单*系统管理 | 插件管理* ：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722851.jpeg)

点击左侧栏的 *Avaliable plugins* , 在搜索栏中搜索插件关键字：*publish over ssh* ，勾选上点击*安装*按钮：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722520.jpeg)

勾选*安装完成后重启 Jenkins* , 等待安装完成，观察容器是否运行，若停止了则表示插件安装成功了，这个时候，手动重启一下 `jenkins` 容器：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722303.jpeg)

## 7. 配置服务器连接

重启成功后，重新访问 `jenkins` 后台，点击 *系统管理 | 系统配置*，滑到下面，找到 Publish over SSH, 开始配置云服务器的连接信息：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722014.jpeg)

> - ①：自定义服务器名称；
> - ②：服务器 `IP` 地址；
> - ③：登录用户名；
> - ④：Remote Directory : 远程文件夹填写 `/`;
> - 如下图，勾选 `Use password authentication` , 填写登录密码，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722218.jpeg)

滑动到下面，点击 *Test Configuration* 按钮，若提示 `Success` , 则表示服务器连接信息配置正确，接着点击*保存*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722429.jpeg)

## 8. 上传 Jar 包，重启服务

继续配置 `weblog-springboot` 任务，在 `maven` 打包步骤的后面，点击*增加构建步骤* ，选择 *Send files or execute commands over SSH* :

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722801.jpeg)

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722531.jpeg)

> - ①： 选择刚刚配置好的云服务器；
>
> - ②：配置要上传的文件，这里是打包好的 `jar` 文件；
>
> - ③：移除路径的前缀文件夹；
>
> - ④：上传到云服务器中的哪个文件夹下；
>
> - ⑤：上传完成后，想要执行的脚本，脚本如下；
>
>   ```bash
>   #!/bin/bash
>   APP_NAME=weblog-web-0.0.1-SNAPSHOT.jar
>   
>   pid=`ps -ef | grep $APP_NAME | grep -v grep|awk '{print $2}'`
>   
>   function is_exist(){
>   	pid=`ps -ef | grep $APP_NAME | grep -v grep|awk '{print $2}'`
>   	if [ -z ${pid} ]; then
>   		String="notExist"
>   		echo $String
>   	else
>   		String="exist"
>   		echo $String
>   	fi
>   }
>   
>   str=$(is_exist)
>   if [ ${str} = "exist" ]; then
>   	echo " 检测到服务已启动，pid 是 ${pid} "
>   	kill -9 $pid
>   else
>   	echo " 服务未启动 "
>   	echo "${APP_NAME} is not running"
>   fi
>   
>   str=$(is_exist)
>   if [ ${str} = "exist" ]; then
>   	echo "${APP_NAME} 已经启动了. pid=${pid} ."
>   else
>   	source /etc/profile
>   	nohup java -Xms300m -Xmx300m -jar /app/weblog/$APP_NAME --spring.profiles.active=prod > /dev/null 2>&1 &
>   	echo "服务已重新启动 .."
>   fi
>   ```
>
> - ⑥：点击保存；

再次执行 `weblog-springboot` 构建任务，注意，同时连接到云服务器中，通过 `tail -f` 命令来观察服务日志，看看任务构建完毕后，服务是否重启，是否有启动相关日志：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722150.jpeg)

> 如上图，查看的构建日志，打包成功后，另外连接到了云服务中，并上传了一个文件，即 `jar` 包。

同时，观察云服务器的服务日志，服务也被重启了，如下图所示：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061723119.jpeg)

再确认一下 `jar` 包的更新时间，如果是最新的时间，说明是刚刚上传的。

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061722629.jpeg)

至此，通过 `jenkins` 一键拉取远程仓库 `master` 分支的最新代码，本地构建打包并上传到云服务器，重启服务的配置工作就完成后，后续如果有新功能迭代，只需将代码合并到远程仓库的 `master` 分支，然后登录 `jenkins` 后台，点击运行一下构建任务即可完成发版工作，解放双手。