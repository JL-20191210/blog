# 飞牛OS合盖不休眠

修改配置文件 `vi /etc/systemd/logind.conf`

- 将`HandleLidSwitch`的值从**suspend**改为**ignore**

- 将`HandleLidSwitch`、`LidSwitchIgnoreInhibited`前面的注释符号#删除。

保存完毕后输入（reboot）