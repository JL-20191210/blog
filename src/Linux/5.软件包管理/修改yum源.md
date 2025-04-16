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

# 更换脚本

```bash
#!/bin/bash
stty erase ^H
# 交互式脚本：更换YUM国内源

echo "欢迎使用更换YUM国内源的脚本！"
echo "此脚本将帮助您将CentOS的YUM源更换为国内源。"

# 步骤 1: 备份系统自带的YUM源配置文件
echo "步骤 1: 备份系统自带的YUM源配置文件"
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
echo "已备份CentOS-Base.repo为CentOS-Base.repo.backup"

# 步骤 2: 选择YUM源
echo "步骤 2: 请选择您想要使用的国内YUM源："
echo "1. 阿里源（推荐）"
echo "2. 网易源"
echo "3. 中科大源"
echo "4. 搜狐源"
echo "5. 北京首都在线源"
read -p "请输入数字（1-5）选择源: " source_choice

case $source_choice in
    1)
        echo "选择了阿里源"
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
        ;;
    2)
        echo "选择了网易源"
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo
        ;;
    3)
        echo "选择了中科大源"
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://centos.ustc.edu.cn/
        ;;
    4)
        echo "选择了搜狐源"
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.sohu.com/
        ;;
    5)
        echo "选择了北京首都在线源"
        wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.yun-idc.com/
        ;;
    *)
        echo "无效选择！请重新运行脚本并选择正确的数字（1-5）。"
        exit 1
        ;;
esac

echo "YUM源已更换为您选择的源。"

# 步骤 3: 清理YUM缓存并生成新的缓存
echo "步骤 3: 清理YUM缓存并生成新的缓存"
yum clean all
yum makecache
echo "YUM缓存已清理并更新。"

# 步骤 4: 更新YUM源检查是否生效
echo "步骤 4: 更新YUM源并检查是否生效"
yum update -y

echo "操作完成！YUM源已成功更换并更新。"
```

