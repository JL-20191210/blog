---
icon: fa-solid fa-cat
date: 2025-03-09
category:
  - MySQL
  - MyCat
tag:
  - 配置文件
---

# MyCat配置文件schema.xml
<!-- more -->

## 自动分片

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
	<schema name="DB01" checkSQLschema="true" sqlMaxLimit="100">
		<table name="TB_ORDER" dataNode="dn1,dn2,dn3" rule="auto-sharding-long" />
	</schema>
	
	<dataNode name="dn1" dataHost="dhost1" database="db01" />
	<dataNode name="dn2" dataHost="dhost2" database="db01" />
	<dataNode name="dn3" dataHost="dhost3" database="db01" />
	
	<dataHost name="dhost1" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.200.210:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="1234" />
	</dataHost>
	
	<dataHost name="dhost2" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.200.213:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="1234" />
	</dataHost>
	
	<dataHost name="dhost3" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.200.214:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="1234" />
	</dataHost>
</mycat:schema>
```

## 垂直分片

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

	<!-- DB01逻辑库 自动分片 -->
	<schema name="DB01" checkSQLschema="true" sqlMaxLimit="100">
		<table name="TB_ORDER" dataNode="dn4,dn5,dn6" rule="auto-sharding-long" />
	</schema>
	


	<!-- SHOPPING逻辑库 垂直分片 -->
	<schema name="SHOPPING" checkSQLschema="true" sqlMaxLimit="100">
		<table name="tb_goods_base" dataNode="dn1" primaryKey="id" />
		<table name="tb_goods_brand" dataNode="dn1" primaryKey="id" />
		<table name="tb_goods_cat" dataNode="dn1" primaryKey="id" />
		<table name="tb_goods_desc" dataNode="dn1" primaryKey="goods_id" />
		<table name="tb_goods_item" dataNode="dn1" primaryKey="id" />
		<table name="tb_order_item" dataNode="dn2" primaryKey="id" />
		<table name="tb_order_master" dataNode="dn2" primaryKey="order_id" />
		<table name="tb_order_pay_log" dataNode="dn2" primaryKey="out_trade_no" />
		<table name="tb_user" dataNode="dn3" primaryKey="id" />
		<table name="tb_user_address" dataNode="dn3" primaryKey="id" />
		
		<!-- 全局表 -->
		<table name="tb_areas_provinces" dataNode="dn1,dn2,dn3" type="global" primaryKey="id"/>
		<table name="tb_areas_city" dataNode="dn1,dn2,dn3" type="global" primaryKey="id"/>
		<table name="tb_areas_region" dataNode="dn1,dn2,dn3" type="global" primaryKey="id"/>
	</schema>
	
	<dataNode name="dn1" dataHost="dhost1" database="shopping" />
	<dataNode name="dn2" dataHost="dhost2" database="shopping" />
	<dataNode name="dn3" dataHost="dhost3" database="shopping" />
	
	<dataNode name="dn4" dataHost="dhost1" database="db01" />
	<dataNode name="dn5" dataHost="dhost2" database="db01" />
	<dataNode name="dn6" dataHost="dhost3" database="db01" />
	
	<dataHost name="dhost1" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.68.201:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="123123" />
	</dataHost>
	
	<dataHost name="dhost2" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.68.202:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="123123" />
	</dataHost>
	
	<dataHost name="dhost3" maxCon="1000" minCon="10" balance="0"
			  writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		
		<writeHost host="master" url="jdbc:mysql://192.168.68.203:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="123123" />
	</dataHost>
	
</mycat:schema>
```

