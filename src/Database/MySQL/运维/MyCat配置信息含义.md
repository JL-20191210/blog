---
icon: fa-solid fa-database
date: 2025-03-22
category:
  - MySQL
  - 数据库
tag:
  - 配置文件
---
# MyCat系统配置信息含义

<!-- more -->

| 属性                      | 取值       | 含义                                                         |
| ------------------------- | ---------- | ------------------------------------------------------------ |
| charset                   | utf8       | 设置Mycat的字符集, 字符集需要与MySQL的字符集保持一致         |
| nonePasswordLogin         | 0,1        | 0为需要密码登陆、1为不需要密码登陆 ,默认为0，设置为1则需要指定默认账户 |
| useHandshakeV10           | 0,1        | 使用该选项主要的目的是为了能够兼容高版本的jdbc驱动, 是否采用HandshakeV10Packet来与client进行通信, 1:是, 0:否 |
| useSqlStat                | 0,1        | 开启SQL实时统计, 1 为开启 , 0 为关闭 ; 开启之后, MyCat会自动统计SQL语句的执行情况 ; mysql -h 127.0.0.1 -P 9066 -u root -p 查看MyCat执行的SQL, 执行效率比较低的SQL , SQL的整体执行情况、读写比例等 ; show @@sql ; show @@sql.slow ; show @@sql.sum ; |
| useGlobleTableCheck       | 0,1        | 是否开启全局表的一致性检测。1为开启 ，0为关闭 。             |
| sqlExecuteTimeout         | 1000       | SQL语句执行的超时时间 , 单位为 s ;                           |
| sequnceHandlerType        | 0,1,2      | 用来指定Mycat全局序列类型，0 为本地文件，1 为数据库方式，2 为时间戳列方式，默认使用本地文件方式，文件方式主要用于测试 |
| sequnceHandlerPattern     | 正则表达式 | 必须带有MYCATSEQ或者 mycatseq进入序列匹配流程 注意MYCATSEQ_有空格的情况 |
| subqueryRelationshipCheck | true,false | 子查询中存在关联查询的情况下,检查关联字段中是否有分片字段 .默认 false |
| useCompression            | 0,1        | 开启mysql压缩协议 , 0 : 关闭, 1 : 开启                       |
| fakeMySQLVersion          | 5.5,5.6    | 设置模拟的MySQL版本号                                        |
| defaultSqlParser          |            | 由于MyCat的最初版本使用了FoundationDB的SQL解析器, 在MyCat1.3后增加了Druid解析器, 所以要设置defaultSqlParser属性来指定默认的解析器; 解析器有两个 : druidparser 和 fdbparser, 在MyCat1.4之后,默认是druidparser, fdbparser已经废除了 |
| processors                | 1,2....    | 指定系统可用的线程数量, 默认值为CPU核心 x 每个核心运行线程数量; processors 会影响processorBufferPool, processorBufferLocalPercent, processorExecutor属性, 所有, 在性能调优时, 可以适当地修改processors值 |
| processorBufferChunk      |            | 指定每次分配Socket Direct Buffer默认值为4096字节, 也会影响BufferPool长度, 如果一次性获取字节过多而导致buffer不够用, 则会出现警告, 可以调大该值 |
| processorExecutor         |            | 指定NIOProcessor上共享 businessExecutor固定线程池的大小; MyCat把异步任务交给 businessExecutor线程池中, 在新版本的MyCat中这个连接池使用频次不高, 可以适当地把该值调小 |
| packetHeaderSize          |            | 指定MySQL协议中的报文头长度, 默认4个字节                     |
| maxPacketSize             |            | 指定MySQL协议可以携带的数据最大大小, 默认值为16M             |
| idleTimeout               | 30         | 指定连接的空闲时间的超时长度;如果超时,将关闭资源并回收, 默认30分钟 |
| txIsolation               | 1,2,3,4    | 初始化前端连接的事务隔离级别,默认为 REPEATED_READ , 对应数字为3 READ_UNCOMMITED=1; READ_COMMITTED=2; REPEATED_READ=3; SERIALIZABLE=4; |
| sqlExecuteTimeout         | 300        | 执行SQL的超时时间, 如果SQL语句执行超时,将关闭连接; 默认300秒; |
| serverPort                | 8066       | 定义MyCat的使用端口, 默认8066                                |
| managerPort               | 9066       | 定义MyCat的管理端口, 默认9066                                |