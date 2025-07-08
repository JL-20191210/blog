---
title: Linux 服务器性能查看命令大全（含自动巡检脚本）
date: 2025-07-04
icon: fa-solid fa-linux
category:
  - Linux
  - 运维工具
  - 性能排查
tags:
  - Linux
  - 性能优化
  - 系统监控
  - 运维
  - 常用命令
---

# 🧠 Linux 服务器性能查看命令大全（含自动巡检脚本）

本文汇总了常用的 Linux 系统性能查看命令，适用于服务器调优、故障排查、容量评估、性能监控等场景，并附带一个可执行的自动巡检脚本。

---

## 🖥️ 1. CPU 信息

### 查看 CPU 基本信息

```bash
lscpu
```

### 查看详细 CPU 架构、型号等

```bash
cat /proc/cpuinfo
```

---

## 🧠 2. 内存信息

### 查看内存使用情况

```bash
free -h
```

### 查看内存与 Swap 详情

```bash
cat /proc/meminfo
```
<!-- more -->
---

## 📦 3. 磁盘信息

### 磁盘分区使用率

```bash
df -h
```

### 磁盘 I/O 状况（需安装 `sysstat`）

```bash
iostat -x 1 5
```

### 挂载情况

```bash
mount | column -t
```

---

## 🌐 4. 网络性能

### 实时网卡吞吐

```bash
ifstat
```

### 查看网卡信息

```bash
ethtool eth0
```

### 查看网络连接与端口

```bash
ss -tunap | less
```

---

## 🔧 5. 系统负载

### 查看系统负载（1/5/15分钟）

```bash
uptime
```

输出示例：

```text
 16:42:13 up 10 days,  5:04,  load average: 0.34, 0.41, 0.45
```

---

## 🔥 6. 实时性能监控

### CPU、内存使用（默认工具）

```bash
top
```

### 增强版 top（需安装 htop）

```bash
htop
```

### 综合指标监控（需安装 dstat）

```bash
dstat -cdngym
```

---

## ⚙️ 7. 内核参数（sysctl）

### 查看所有内核参数

```bash
sysctl -a | less
```

### 查询特定参数

```bash
sysctl vm.swappiness
sysctl net.core.somaxconn
```

---

## 📜 8. 进程信息

### 按内存占用排序前20

```bash
ps aux --sort=-%mem | head -20
```

### 按 CPU 占用排序

```bash
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head
```

---

## 📁 9. 查看资源限制（ulimit）

```bash
ulimit -a       # 查看所有限制
ulimit -n       # 最大文件描述符数
ulimit -u       # 最大进程数
```

---

## 📌 10. 操作系统信息

### 查看内核版本

```bash
uname -a
```

### 查看发行版版本信息

```bash
cat /etc/os-release
```

---

## 🧰 常用性能工具（进阶）

| 工具     | 功能                               |
| -------- | ---------------------------------- |
| `htop`   | 增强版 top，图形化界面             |
| `iotop`  | 磁盘 IO 进程排行                   |
| `iostat` | 磁盘 I/O 统计                      |
| `vmstat` | 内存、CPU、进程、IO 全面查看       |
| `sar`    | 历史性能数据采集（需安装 sysstat） |
| `strace` | 跟踪进程系统调用                   |
| `perf`   | 采样型性能分析器                   |

---

## ✅ 一键查看核心性能信息

```bash
echo "[CPU Info]"; lscpu
echo "[Memory Info]"; free -h
echo "[Disk Info]"; df -h
echo "[OS Info]"; cat /etc/os-release
echo "[Kernel]"; uname -a
echo "[Limits]"; ulimit -a
```

---

## 🛠 自动巡检脚本示例（check\_sysinfo.sh）

以下是一个自动采集关键系统性能信息并生成报告的脚本，并在出现异常时发出警告：

```bash
#!/bin/bash
REPORT=system_report_$(date +%Y%m%d_%H%M%S).log
ALERT=0

exec > "$REPORT"
echo "===== Linux 性能巡检报告 $(date) ====="

echo -e "\n[基本信息]"
uname -a
cat /etc/os-release | grep PRETTY


echo -e "\n[CPU 信息]"
CPU_CORES=$(nproc)
echo "CPU 核心数：$CPU_CORES"


echo -e "\n[内存信息]"
free -h
MEM_USED=$(free | awk '/Mem:/ {print $3/$2*100}')
if (( $(echo "$MEM_USED > 85" | bc -l) )); then
  echo "⚠️  内存使用率过高：${MEM_USED}%"
  ALERT=1
fi


echo -e "\n[磁盘使用情况]"
df -h
DISK_ALERT=$(df -h | awk '$5+0 > 85 {print $1, $5}')
if [ -n "$DISK_ALERT" ]; then
  echo "⚠️  以下磁盘使用率超过85%："
  echo "$DISK_ALERT"
  ALERT=1
fi


echo -e "\n[系统负载]"
LOAD=$(uptime | awk -F 'load average:' '{print $2}' | cut -d',' -f1 | awk '{print $1}')
CPU_COUNT=$(nproc)
if (( $(echo "$LOAD > $CPU_COUNT" | bc -l) )); then
  echo "⚠️  系统负载过高：$LOAD 超过 CPU 核心数 $CPU_COUNT"
  ALERT=1
fi


echo -e "\n[网络状态]"
ss -tunap | head -20


echo -e "\n[进程资源 TOP5]"
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head -6


echo -e "\n[ulimit 配置]"
ulimit -a


echo -e "\n[内核参数优化]"
sysctl vm.swappiness
sysctl net.core.somaxconn

if [ "$ALERT" -eq 1 ]; then
  echo -e "\n❗ 检测到异常项，请尽快检查服务器健康状况！"
else
  echo -e "\n✅ 巡检完成，系统运行正常。"
fi

echo -e "\n报告文件：$REPORT"
```

### 使用方式：

```bash
chmod +x check_sysinfo.sh
./check_sysinfo.sh
```

脚本将自动输出日志并检测以下异常：

* 内存使用率 > 85%
* 磁盘使用率 > 85%
* 系统负载大于 CPU 核心数

你可以将其加入 crontab 定时执行并邮件报警。

---

## 🏁 总结

| 项目     | 命令                             |
| -------- | -------------------------------- |
| CPU      | `lscpu`, `top`, `htop`           |
| 内存     | `free`, `vmstat`                 |
| 磁盘     | `df`, `iostat`, `iotop`          |
| 网络     | `ss`, `ifstat`, `ethtool`        |
| 系统参数 | `sysctl`, `ulimit`               |
| 系统负载 | `uptime`, `top`                  |
| 自动巡检 | `check_sysinfo.sh`（含异常检测） |

---

*建议将这些命令整理为日常运维脚本，或集成到性能监控系统中，实现自动化巡检与告警。*