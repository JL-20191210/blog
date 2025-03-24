---
icon: fa-solid fa-cat
date: 2025-03-09
category:
  - MySQL
  - MyCat
tag:
  - 配置文件
---

# MyCat配置文件server.xml
<!-- more -->
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:server SYSTEM "server.dtd">
<mycat:server xmlns:mycat="http://io.mycat/">
    ...
    ...

	<user name="root" defaultAccount="true">
		<property name="password">123123</property>
		<property name="schemas">DB01,SHOPPING</property>
	</user>
	
	<user name="user">
		<property name="password">123123</property>
		<property name="schemas">SHOPPING</property>
		<property name="readOnly">DB01,true</property>
	</user>

</mycat:server>

```

