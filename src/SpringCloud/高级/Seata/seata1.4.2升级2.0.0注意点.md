---
icon: fa-solid fa-web-awesome
date: 2025-02-25
category:
  - SpringCloud高级篇
tag:
  - Seata
  - 分布式事务
  - 微服务
---
# seata1.4.2升级2.0.0注意点

1. lock_table中status字段缺失要补上

2. 客户端配置项中，特别注意`seata.registry.application`配置的要与`seata-server`在Nacos中注册的服务名一致

   ```yaml
   seata:
     # 注册中心
     registry: # TC服务注册中心的配置，微服务根据这些信息去注册中心获取tc服务地址
       # 参考tc服务自己的registry.conf中的配置
       type: nacos
       nacos: # tc
         server-addr: 81.70.62.114:8848
         group: DEFAULT_GROUP
         # 注意这个地方一定与Nacos中注册的tc服务名一致！！！！
         application: seata-server # tc服务在nacos中的服务名称
         cluster: SH
     tx-service-group: seata-demo # 事务组，根据这个获取tc服务的cluster名称
     service:
       vgroup-mapping: # 事务组与TC服务cluster的映射关系
         seata-demo: SH
   ```