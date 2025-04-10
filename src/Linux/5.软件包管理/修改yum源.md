# 更换yum国内源

1.首先备份系统自带yum源配置文件/etc/yum.repos.d/CentOS-Base.repo

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

![在这里插入图片描述](assets\2.png)

2.下载国内yum源配置文件到/etc/yum.repos.d/

```bash
阿里源（推荐）：
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
网易源：
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo
```

![在这里插入图片描述](assets\3.png)

3.清理yum缓存，并生成新的缓存

```bash
yum clean all
yum makecache
```

![在这里插入图片描述](assets\4.png)

4.更新yum源检查是否生效

```bash
yum update
```

![在这里插入图片描述](assets\1.png)

注：
若更新 yum 源不更新内核：
直接在 yum 的命令后面加上如下的参数

```bash
yum --exclude=kernel* update
```

国内yum源：
阿里yum源:http://mirrors.aliyun.com/repo/
163(网易)yum源: http://mirrors.163.com/.help/
中科大的Linux安装镜像源：http://centos.ustc.edu.cn/
搜狐的Linux安装镜像源：http://mirrors.sohu.com/
北京首都在线科技：http://mirrors.yun-idc.com/