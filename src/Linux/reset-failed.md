# reset-failed

`systemctl reset-failed` 命令用于重置 Systemd 记录的所有失败的服务状态信息。当一个服务启动失败后，Systemd 会记录该服务的失败状态，这些状态信息可以帮助系统管理员诊断问题。但有时候，当问题已经解决或者不再需要这些失败状态信息时，可以使用 `systemctl reset-failed` 命令将这些失败状态信息清除，以便重新开始服务的状态跟踪。

重置失败状态信息后，Systemd 将不再记录之前失败的服务状态，这样在下一次服务启动时，Systemd 将重新开始跟踪服务的状态。这个命令通常用于清除旧的失败状态信息，以便更清晰地查看当前系统状态。

请注意，这个命令只会清除失败状态信息，不会影响正在运行的服务或已成功启动的服务。