# N1盒子配置AdGuard 及PassWall

## 1.修改重定向模式为`重定向53端口到AdGuardHOME`

![image-20250711205255724](assets\image-20250711205255724.png)

## 2.PassWall的DNS分流使用`ChinaDNS-NG`

:fire:取消勾选DNS重定向：使ChinaDNS-NG发送请求给AdGuard

:tada:清空IPSET缓存

![image-20250711205512356](assets\image-20250711205512356.png)

## 3.设置iStoreOS的DNS服务器为`192.168.68.1(主路由网关地址)`

:fire:如果设置为自己会导致DNS自旋

![image-20250711205956020](assets\image-20250711205956020.png)

## 4.设置主路由DNS为N1盒子IP，备选留空全部走N1盒子请求DNS

![image-20250711210053402](assets\image-20250711210053402.png)

## 5.设置电脑为静态IP，指定网关为N1盒子IP（可以科学上网），指定DNS为主路由网关（委托主路由去请求N1盒子DNS服务完成去广告）

![image-20250711210351346](assets\image-20250711210351346.png)

## 6.设置AdGuard过滤器绿色上网

### 黑名单

![image-20250711211542347](assets\image-20250711211542347.png)

规则1：https://raw.githubusercontent.com/BlueSkyXN/AdGuardHomeRules/master/all.txt

规则2：https://raw.githubusercontent.com/BlueSkyXN/AdGuardHomeRules/master/skyrules.txt 

自带规则：https://adguardteam.github.io/HostlistsRegistry/assets/filter_1.txt

成人：https://blocklistproject.github.io/Lists/adguard/porn-ags.txt

### 白名单

规则1：https://raw.githubusercontent.com/BlueSkyXN/AdGuardHomeRules/master/ok.txt 

![image-20250711212312033](assets\image-20250711212312033.png)
