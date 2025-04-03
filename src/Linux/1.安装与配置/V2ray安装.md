## 安装 V2Ray

在开始安装之前，安装一些必要的软件：

- Ubuntu/Debian 系统: `apt-get update -y && apt-get install curl -y`
- CentOS 系统: `yum update -y && yum install curl -y`

为了简化安装，我们使用一键安装脚本，使用现成的一键安装脚本，使用 root 用户输入下面命令安装：

```
bash <(curl -s -L https://git.io/v2ray.sh)
```

然后选择安装，即是输入 1 回车

选择传输协议，如果没有特别的需求，使用默认的 `TCP` 传输协议即可，直接回车

选择端口，如果没有特别的需求，使用默认的端口即可，直接回车

是否屏蔽广告，除非你真的需要，一般来说，直接回车即可

是否配置 Shadowsocks ，如果不需要就直接回车，否则就输入 Y 回车

Shadowsocks 端口，密码，加密方式这些东西自己看情况配置即可，一般全部直接回车。。

OK，按回车继续

最后安装完成后会提示安装信息，建议记录下。

## 香港

```bash
使用协议: VMess-TCP
-------------- VMess-TCP-40007.json -------------
协议 (protocol) 	= vmess
地址 (address) 		= 103.106.191.234
端口 (port) 		= 40007
用户ID (id) 		= 6e43dc19-d24e-431f-9bfc-b246eb2ee1c2
传输协议 (network) 	= tcp
伪装类型 (type) 	= none

警告! 首次安装请查看脚本帮助文档: https://233boy.com/v2ray/v2ray-script/

------------- 链接 (URL) -------------
vmess://eyJ2IjoyLCJwcyI6IjIzM2JveS10Y3AtMTAzLjEwNi4xOTEuMjM0IiwiYWRkIjoiMTAzLjEwNi4xOTEuMjM0IiwicG9ydCI6IjQwMDA3IiwiaWQiOiI2ZTQzZGMxOS1kMjRlLTQzMWYtOWJmYy1iMjQ2ZWIyZWUxYzIiLCJhaWQiOiIwIiwibmV0IjoidGNwIiwidHlwZSI6Im5vbmUiLCJwYXRoIjoiIn0=
------------- END -------------
关注(tg): https://t.me/tg2333
文档(doc): https://233boy.com/v2ray/v2ray-script/
推广(ads): 机场推荐(V2Ray services): https://getjms.com/
```

