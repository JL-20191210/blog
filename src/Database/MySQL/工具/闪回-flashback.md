# 闪回-flashback

### **1. 简介**

mysqlbinlog flashback（闪回）用于快速恢复由于误操作丢失的数据。在DBA误操作时，可以把数据库恢复到以前某个时间点（或者说某个binlog的某个pos）。比如忘了带where条件的update、delete操作，传统的恢复方式是利用全备+二进制日志前滚进行恢复，相比于传统的全备+增备，flashback显然更为快速、简单。

目前MySQL的flashback功能是利用binlog完成的，第一个实现该功能的是阿里云的**彭立勋**， 他在MySQL 5.5版本上就已实现，并将其提交给MariaDB。

### 2. 闪回原理

原理：flashback工具（-B 参数）可对rows格式的binlog可以进行逆向操作，delete反向生成insert、update生成反向的update、insert反向生成delete。

MySQL的binlog以event的形式，记录了MySQL中所有的变更情况，利用binlog我们就能够重现所记录的所有操作。

MySQL引入binlog主要有两个用途/目的：一是为了主从复制；二是用于备份恢复后需要重新应用部分binlog，从而达到全备+增备的效果。

MySQL的binlog有三种格式：

- statement，基于SQL语句的模式，一般来说生成的binlog尺寸较小，但是某些不确定性SQL语句或函数在复制过程可能导致数据不一致甚至出错；
- row，基于数据行的模式，记录的是数据行的完整变化。相对更安全，推荐使用（但通常生成的binlog会比其他两种模式大很多）；
- mixed，混合模式，可以根据情况自动选用statement抑或row模式；这个模式下也可能造成主从数据不一致。它属于MySQL 5.1版本时期的过渡方案，已不推荐使用了。

:fire:注意：使用mysqlbinlog flashback 工具必须设置：binlog_format = row