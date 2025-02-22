# windows版sentinel运行报错问题处理:Unable to make protected final java.lang.Class java.lang.ClassLoader.define

> 更改启动命令，打开特定的包装进行反射：
> `java --add-opens java.base/java.lang=ALL-UNNAMED -jar sentinel-dashboard-1.8.1.jar`