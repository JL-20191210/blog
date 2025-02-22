@echo off
java --add-opens java.base/java.lang=ALL-UNNAMED -Dserver.port=8090 -jar sentinel-dashboard-1.8.1.jar
pause
