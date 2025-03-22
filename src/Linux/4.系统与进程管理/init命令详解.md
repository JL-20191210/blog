---
icon: fa-brands fa-linux
date: 2024-10-27
category:
  - Linux
tag:
  - 总结
# star: true
# sticky: true
---
# init命令详解

## 概述

> 把控制命令发送给 init 守护程序。
>
> init 进程号始终为 1，发送 TERM 信号给 init 会终止所有用户进程、守护进程等。
>
> ---
>
> init 可用于`安全`关闭 重启 停止计算机，init 是所有进程的祖先，是 Linux 系统不可或缺的程序。
>
> 强制直接关闭 Linux 系统计算机电源可能导致进程数据丢失，使系统处于不稳定状态 (甚至损坏硬件设备)。
>
> ------
>
> `shutdown`命令需有 root 权限，shutdown 是把信号发送给`init`命令，要求 init 改变 runlevel，以此进行相关操作。
>
> 关机或重启计算机实际上是 `runlevel` 的调整，因此，也可使用 `init` 命令 (需 root 权限) 直接调整 `runlevel `进行相关操作。

## 参数

init + 运行级别

```bash
init [OPTIONS...] COMMAND

Send control commands to the init daemon.

Commands:
  0              Power-off the machine
  6              Reboot the machine
  2, 3, 4, 5     Start runlevelX.target unit
  1, s, S        Enter rescue mode
  q, Q           Reload init daemon configuration
  u, U           Reexecute init daemon
```

>init 0：安全关闭计算机
>
>init 6：重启计算机
>
>init 1 ：单用户模式（救援模式）
>
>init 2：多用户，没有NFS不联网
>
>init 3：完全多用户模式（正常运行级别）
>
>init 4：没用
>
>init 5：图形化界面

## 开机默认级别设置

### centos

修改`/etc/inittab`文件

```bash
1.  # inittab       This file describes how the INIT process should set up    
2.  #               the system in a certain run-level.    
3.  #    
4.  # Author:       Miquel van Smoorenburg, <miquels@drinkel.nl.mugnet.org>    
5.  #               Modified for RHS Linux by Marc Ewing and Donnie Barnes    
6.  #   
7.  # Default runlevel. The runlevels used by RHS are:    
8.  #   0 - halt (Do NOT set initdefault to this)    
9.  #   1 - Single user mode    
10. #   2 - Multiuser, without NFS (The same as 3, if you do not have networking)    
11. #   3 - Full multiuser mode    
12. #   4 - unused    
13. #   5 - X11    
14. #   6 - reboot (Do NOT set initdefault to this)    
15. #     
16. id:3:initdefault:  
```

> 第16行：
>
> id:3:initdefault: 默认启动命令行模式
>
> id:5:initdefault: 默认启动图形化界面模式
>
> ---
>
> :warning:不能设置为0或者6，会造成反复关机和重启

### ubuntu

修改`/etc/default/grub`文件

```bash
# If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'

GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX=""
```

> 修改配置项
>
> GRUB_CMDLINE_LINUX_DEFAULT="text" 默认启动命令行模式
>
> GRUB_CMDLINE_LINUX_DEFAULT="quiet splash" 默认启动图形化界面模式
>
> ---
>
> 修改后更新 Grub 配置：`sudo update-grub`
>
> 重启系统：`sudo reboot`

或者使用`systemctl`修改

```bash
sudo systemctl set-default multi-user.target #默认启动命令行模式
sudo systemctl set-default graphical.target #默认启动图形化界面模式
```

> 重启系统：`sudo reboot`

