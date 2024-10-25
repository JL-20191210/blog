---
icon: pen-to-square
date: 2024-10-16
category:
  - 网络
tag:
  - git
  - 网络
---

# 刷新dns缓存

> 可解决github提交代码时连接失败的问题

## Windows

```shell
#cmd窗口下执行
ipconfig /flushdns
```

## Mac

```shell
#终端下执行
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```
