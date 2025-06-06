---
icon: fa-solid fa-cat
date: 2025-03-09
category:
  - MySQL
  - MyCat
tag:
  - 配置文件
---

# rule.xml配置文件

## 最终配置

:cat2:分片算法及方法实现

<!-- more -->

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- - - Licensed under the Apache License, Version 2.0 (the "License"); 
	- you may not use this file except in compliance with the License. - You 
	may obtain a copy of the License at - - http://www.apache.org/licenses/LICENSE-2.0 
	- - Unless required by applicable law or agreed to in writing, software - 
	distributed under the License is distributed on an "AS IS" BASIS, - WITHOUT 
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. - See the 
	License for the specific language governing permissions and - limitations 
	under the License. -->
<!DOCTYPE mycat:rule SYSTEM "rule.dtd">
<mycat:rule xmlns:mycat="http://io.mycat/">
	<tableRule name="rule1">
		<rule>
			<columns>id</columns>
			<algorithm>func1</algorithm>
		</rule>
	</tableRule>

	<tableRule name="rule2">
		<rule>
			<columns>user_id</columns>
			<algorithm>func1</algorithm>
		</rule>
	</tableRule>

	<tableRule name="sharding-by-intfile">
		<rule>
			<columns>sharding_id</columns>
			<algorithm>hash-int</algorithm>
		</rule>
	</tableRule>
		
	
	<!-- 自己增加 tableRule -->
	<tableRule name="sharding-by-intfile-enumstatus">
		<rule>
			<columns>status</columns>
			<algorithm>hash-int</algorithm>
		</rule>
	</tableRule>

	<tableRule name="auto-sharding-long">
		<rule>
			<columns>id</columns>
			<algorithm>rang-long</algorithm>
		</rule>
	</tableRule>
	<tableRule name="mod-long">
		<rule>
			<columns>id</columns>
			<algorithm>mod-long</algorithm>
		</rule>
	</tableRule>
	<tableRule name="sharding-by-murmur">
		<rule>
			<columns>id</columns>
			<algorithm>murmur</algorithm>
		</rule>
	</tableRule>
	<tableRule name="crc32slot">
		<rule>
			<columns>id</columns>
			<algorithm>crc32slot</algorithm>
		</rule>
	</tableRule>

	<tableRule name="latest-month-calldate">
		<rule>
			<columns>calldate</columns>
			<algorithm>latestMonth</algorithm>
		</rule>
	</tableRule>
	
	<tableRule name="auto-sharding-rang-mod">
		<rule>
			<columns>id</columns>
			<algorithm>rang-mod</algorithm>
		</rule>
	</tableRule>
	
	<tableRule name="jch">
		<rule>
			<columns>id</columns>
			<algorithm>jump-consistent-hash</algorithm>
		</rule>
	</tableRule>
	
	<tableRule name="sharding-by-substring">
		<rule>
			<columns>id</columns>
			<algorithm>sharding-by-substring</algorithm>
		</rule>
	</tableRule>
	
	<tableRule name="sharding-by-long-hash">
		<rule>
			<columns>id</columns>
			<algorithm>sharding-by-long-hash</algorithm>
		</rule>
	</tableRule>
	
	<tableRule name="sharding-by-stringhash">
		<rule>
			<columns>name</columns>
			<algorithm>sharding-by-stringhash</algorithm>
		</rule>
	</tableRule>

	<tableRule name="sharding-by-date">
		<rule>
			<columns>create_time</columns>
			<algorithm>sharding-by-date</algorithm>
		</rule>
	</tableRule>
	
		
	<tableRule name="sharding-by-month">
		<rule>
			<columns>create_time</columns>
			<algorithm>partbymonth</algorithm>
		</rule>
	</tableRule>

	<function name="murmur"
		class="io.mycat.route.function.PartitionByMurmurHash">
		<property name="seed">0</property><!-- 默认是0 -->
		<property name="count">3</property><!-- 要分片的数据库节点数量，必须指定，否则没法分片 -->
		<property name="virtualBucketTimes">160</property><!-- 一个实际的数据库节点被映射为这么多虚拟节点，默认是160倍，也就是虚拟节点数是物理节点数的160倍 -->
		<!-- <property name="weightMapFile">weightMapFile</property> 节点的权重，没有指定权重的节点默认是1。以properties文件的格式填写，以从0开始到count-1的整数值也就是节点索引为key，以节点权重值为值。所有权重值必须是正整数，否则以1代替 -->
		<!-- <property name="bucketMapPath">/etc/mycat/bucketMapPath</property> 
			用于测试时观察各物理节点与虚拟节点的分布情况，如果指定了这个属性，会把虚拟节点的murmur hash值与物理节点的映射按行输出到这个文件，没有默认值，如果不指定，就不会输出任何东西 -->
	</function>

	<function name="crc32slot"
			  class="io.mycat.route.function.PartitionByCRC32PreSlot">
	</function>
	<function name="hash-int"
		class="io.mycat.route.function.PartitionByFileMap">
		<property name="mapFile">partition-hash-int.txt</property>
	</function>
	<function name="rang-long"
		class="io.mycat.route.function.AutoPartitionByLong">
		<property name="mapFile">autopartition-long.txt</property>
	</function>
	<function name="mod-long" class="io.mycat.route.function.PartitionByMod">
		<!-- how many data nodes -->
		<property name="count">3</property>
	</function>

	<function name="func1" class="io.mycat.route.function.PartitionByLong">
		<property name="partitionCount">8</property>
		<property name="partitionLength">128</property>
	</function>
	<function name="latestMonth"
		class="io.mycat.route.function.LatestMonthPartion">
		<property name="splitOneDay">24</property>
	</function>

	
	<function name="rang-mod" class="io.mycat.route.function.PartitionByRangeMod">
        	<property name="mapFile">partition-range-mod.txt</property>
	</function>
	
	<function name="jump-consistent-hash" class="io.mycat.route.function.PartitionByJumpConsistentHash">
		<property name="totalBuckets">3</property>
	</function>
	
	<function name="sharding-by-substring"
	class="io.mycat.route.function.PartitionDirectBySubString">
		<!-- zero-based -->
		<property name="startIndex">0</property> 
		<property name="size">2</property>
		<property name="partitionCount">3</property>
		<property name="defaultPartition">0</property>
	</function>
	
	<!-- 分片总长度为1024，count与length数组长度必须一致； -->
	<!-- 固定分片hash算法 -->
	<function name="sharding-by-long-hash"
	class="io.mycat.route.function.PartitionByLong">
		<property name="partitionCount">2,1</property>
		<property name="partitionLength">256,512</property>
	</function>
	
	<function name="sharding-by-stringhash"
	class="io.mycat.route.function.PartitionByString">
		<property name="partitionLength">512</property> <!-- zero-based -->
		<property name="partitionCount">2</property>
		<property name="hashSlice">0:2</property>
	</function>
	
	
	<function name="sharding-by-date"
	class="io.mycat.route.function.PartitionByDate">
		<property name="dateFormat">yyyy-MM-dd</property>
		<property name="sBeginDate">2022-01-01</property>
		<property name="sEndDate">2022-01-30</property>
		<property name="sPartionDay">10</property>
	</function>
	<!--
	从开始时间开始，每10天为一个分片，到达结束时间之后，会重复开始分片插入
	配置表的 dataNode 的分片，必须和分片规则数量一致，例如 2022-01-01 到 2022-12-31 ，每
	10天一个分片，一共需要37个分片。
	-->


	<function name="partbymonth" class="io.mycat.route.function.PartitionByMonth">
		<property name="dateFormat">yyyy-MM-dd</property>
		<property name="sBeginDate">2022-01-01</property>
		<property name="sEndDate">2022-03-31</property>
	</function>
	<!--
	从开始时间开始，一个月为一个分片，到达结束时间之后，会重复开始分片插入
	配置表的 dataNode 的分片，必须和分片规则数量一致，例如 2022-01-01 到 2022-12-31 ，一
	共需要12个分片。
	-->
</mycat:rule>
```
