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

:cat2:水平分片dn1,dn2,dn3是横着排的，垂直分片dn1,dn2,dn3是竖着排的

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

## 水平分片

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
	<!-- 水平拆分 -->
	<schema name="ITCAST" checkSQLschema="true" sqlMaxLimit="100">
		<table name="tb_log" dataNode="dn7,dn8,dn9" primaryKey="id" rule="mod-long" />
	</schema>
	
	<dataNode name="dn7" dataHost="dhost1" database="itcast" />
	<dataNode name="dn8" dataHost="dhost2" database="itcast" />
	<dataNode name="dn9" dataHost="dhost3" database="itcast" />
	
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

## 分片规则

- 范围分片
- 取模分片
- 一致性hash分片
- 枚举分片
- 应用指定算法
- 固定分片hash算法
- 字符串hash解析算法
- 按天分片算法
- 自然月分片算法

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
	
	
	<!-- 水平拆分 -->
	<schema name="ITCAST" checkSQLschema="true" sqlMaxLimit="100">
		<table name="tb_log" dataNode="dn7,dn8,dn9" primaryKey="id" rule="mod-long" />
		<table name="tb_order" dataNode="dn7,dn8,dn9" primaryKey="id" rule="sharding-by-intfile-enumstatus" />
		<table name="tb_user" dataNode="dn7,dn8,dn9" primaryKey="id" rule="sharding-by-intfile-enumstatus" />
		
		<!-- 应用指定算法 -->
		<table name="tb_app" dataNode="dn7,dn8,dn9" rule="sharding-by-substring" />
		
		<!-- 固定分片hash算法 -->
		<table name="tb_longhash" dataNode="dn7,dn8,dn9" rule="sharding-by-long-hash" />
		
		<!-- 字符串hash解析算法 -->
		<table name="tb_strhash" dataNode="dn7,dn8" rule="sharding-by-stringhash" />
		
		<!-- 按天分片 -->
		<table name="tb_datepart" dataNode="dn7,dn8,dn9" rule="sharding-by-date" />
		
		<!-- 按自然月分片 -->
		<table name="tb_monthpart" dataNode="dn7,dn8,dn9" rule="sharding-by-month" />
	</schema>
	
	
	
	<dataNode name="dn1" dataHost="dhost1" database="shopping" />
	<dataNode name="dn2" dataHost="dhost2" database="shopping" />
	<dataNode name="dn3" dataHost="dhost3" database="shopping" />
	
	<dataNode name="dn4" dataHost="dhost1" database="db01" />
	<dataNode name="dn5" dataHost="dhost2" database="db01" />
	<dataNode name="dn6" dataHost="dhost3" database="db01" />
	
	<dataNode name="dn7" dataHost="dhost1" database="itcast" />
	<dataNode name="dn8" dataHost="dhost2" database="itcast" />
	<dataNode name="dn9" dataHost="dhost3" database="itcast" />
	
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



## 最终配置

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

	<!-- DB01逻辑库 自动分片 -->
	<schema name="DB01" checkSQLschema="true" sqlMaxLimit="100">
		<table name="TB_ORDER" dataNode="dn4,dn5,dn6" rule="auto-sharding-long" />
	</schema>
	
	<schema name="ITCAST_RW2" checkSQLschema="true" sqlMaxLimit="100" dataNode="dn10">
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
	
	
	<!-- 水平拆分 -->
	<schema name="ITCAST" checkSQLschema="true" sqlMaxLimit="100">
		<table name="tb_log" dataNode="dn7,dn8,dn9" primaryKey="id" rule="mod-long" />
		<table name="tb_order" dataNode="dn7,dn8,dn9" primaryKey="id" rule="sharding-by-intfile-enumstatus" />
		<table name="tb_user" dataNode="dn7,dn8,dn9" primaryKey="id" rule="sharding-by-intfile-enumstatus" />
		
		<!-- 应用指定算法 -->
		<table name="tb_app" dataNode="dn7,dn8,dn9" rule="sharding-by-substring" />
		
		<!-- 固定分片hash算法 -->
		<table name="tb_longhash" dataNode="dn7,dn8,dn9" rule="sharding-by-long-hash" />
		
		<!-- 字符串hash解析算法 -->
		<table name="tb_strhash" dataNode="dn7,dn8" rule="sharding-by-stringhash" />
		
		<!-- 按天分片 -->
		<table name="tb_datepart" dataNode="dn7,dn8,dn9" rule="sharding-by-date" />
		
		<!-- 按自然月分片 -->
		<table name="tb_monthpart" dataNode="dn7,dn8,dn9" rule="sharding-by-month" />
	</schema>
	
	
	
	<dataNode name="dn1" dataHost="dhost1" database="shopping" />
	<dataNode name="dn2" dataHost="dhost2" database="shopping" />
	<dataNode name="dn3" dataHost="dhost3" database="shopping" />
	
	<dataNode name="dn4" dataHost="dhost1" database="db01" />
	<dataNode name="dn5" dataHost="dhost2" database="db01" />
	<dataNode name="dn6" dataHost="dhost3" database="db01" />
	
	<dataNode name="dn7" dataHost="dhost1" database="itcast" />
	<dataNode name="dn8" dataHost="dhost2" database="itcast" />
	<dataNode name="dn9" dataHost="dhost3" database="itcast" />
	
	<!-- 读写分离节点 -->
	<dataNode name="dn10" dataHost="dhost4" database="db01" />
	
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
	
	<dataHost name="dhost4" maxCon="1000" minCon="10" balance="1" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1" slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://192.168.68.201:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="123123">
			<readHost host="slave1" url="jdbc:mysql://192.168.68.202:3306?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;characterEncoding=utf8" user="root" password="123123" />
		</writeHost>
	</dataHost>
	
</mycat:schema>
```

