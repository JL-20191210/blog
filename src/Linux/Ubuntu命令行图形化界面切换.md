> 设置默认开机模式

```bash
systemctl set-default multi-user.target  "默认进入命令行界面"
systemctl set-default graphical.target   "默认进入图形化界面"
```

> 切换图形化界面与命令行界面

```bash
init 5 #切换至图形化界面
CTRL+ALT+F1-F6 #切换至tty1-tty6 命令行界面
```

> init命令

```bash
Commands:
  0              Power-off the machine
  6              Reboot the machine
  2, 3, 4, 5     Start runlevelX.target unit
  1, s, S        Enter rescue mode
  q, Q           Reload init daemon configuration
  u, U           Reexecute init daemon
```

