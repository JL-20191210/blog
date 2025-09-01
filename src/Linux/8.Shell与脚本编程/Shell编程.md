# Shell编程

## shell概述

是一个命令行解释器，接受应用程序或用户命令，然后调用操作系统内核。

是一个功能强大的编程语言。

$SHELL：查看当前使用的shell

## 基本使用

\#!bin/bash：指定使用的shell

 执行脚本：

- 方式一：指定使用bash执行，不需要修改权限`bash test.sh`或`sh test.sh `
- 方式二：使用当前命令行使用的shell执行，给脚本赋予执行权限`chomd +x test.sh`后`./test.sh`

注意：

- `source test.sh`和`. test.sh`是在当shell执行
- ` sh test.sh``bash test.sh`和`./test.sh`是启动一个子shell去执行脚本
- 在子shell中设置的变量在父shell中不可见

## 变量

### 系统预定义变量

$HOME，$PWD，$SHELL，$USER等

env | less：打印所有系统全局变量

printenv USER：打印USER变量

echo $USER：打印USER变量

ls $USER：查看该目录中文件

注意：bash命令新开一个shell，exit退出该shell

### 自定义变量

#### 变量定义

- 字母，数字，下划线组成。不能用数字打头。环境变量使用大写
- 等号两侧不能有空格
-  在bash中，默认变量类型都是字符串类型，无法直接进行数值运算
- 变量的值如果有空格，需要使用双引号或者单引号括起来

#### 局部变量与全局变量

- 全局变量：对自己和子shell有效
- 局部变量：只对当前shell有效

```bash
[root@localhost ~]# my_var="hello world" #自定义一个局部变量 

[root@localhost ~]# echo $my_var #当前shell输出局部变量

hello world

[root@localhost ~]# export my_var #将局部变量提升为全局变量

[root@localhost ~]# ps -f

UID         PID   PPID  C STIME TTY          TIME CMD

root      49107  49098  0 16:37 pts/0    00:00:00 -bash

root      50314  49107  0 17:40 pts/0    00:00:00 ps -f

[root@localhost ~]# bash #新建一个shell

[root@localhost ~]# echo $my_var #输出该全局变量

hello world

[root@localhost ~]# ps -f #此时执行ps -f的shell为子

UID         PID   PPID  C STIME TTY          TIME CMD

root      49107  49098  0 16:37 pts/0    00:00:00 -bash

root      50325  49107  0 17:40 pts/0    00:00:00 bash

root      50365  50325  0 17:40 pts/0    00:00:00 ps -f

[root@localhost ~]# my_var="hello linux" #当前为子shell，在子shell中修改全局变量的值

[root@localhost ~]# echo $my_var #输出该变量值

hello linux

[root@localhost ~]# exit #退出当前shell，回到父shell

exit

[root@localhost ~]# echo $my_var #输出发布为全局变量的变量，在子shell中修改

hello world  #父shell中没有同步修改

[root@localhost ~]# bash #进入子shell

[root@localhost ~]# export my_var #将修改后的变量发布为全局变量

[root@localhost ~]# exit #退出

exit

[root@localhost ~]# echo $my_var #依旧不影响父shell中该变量

hello world

[root@localhost ~]# my_var="hello bash" #在父shell中修改变量值

[root@localhost ~]# bash  #进入子shell

[root@localhost ~]# echo $my_var #输出

hello bash  #变量值同步修改
```



总结：

- 自定义变量为局部变量，使用`export name`发布为全局变量后子shell才能够使用
- 父shell中修改全局变量影响子shell，子shell中修改全局变量不影响父shell
- 使用子shell运行脚本时含有父shell的局部变量会找不到变量

#### 只读变量

```bash
[root@localhost ~]# readonly b=5

[root@localhost ~]# echo $b

5

[root@localhost ~]# b=10

bash: b: readonly variable

不能unset
```

#### 撤销变量

unset 变量名

#### 双引号与单引号

双引号

- 可以使用转义符，变量

单引号

- 原样输出，不能用变量
- 嵌套单引号成对出现作为字符串拼接符，对单个单引号使用转义符也不行

[root@localhost ~]# echo 'hello 'world''

hello world

### 特殊变量

$n：$0表示脚本名称，$1-9表示第几个参数

$#：获取所有输入参数个数

$*：获取脚本所有参数，看做一个整体。在""里使用是一个整体。

$@：获取脚本所有参数，可视为一个数组。在""里使用每个元素也是独立的。

```bahs
  1 #!bin/bash

  2 echo '===$n==='

  3 echo $1

  4 echo $2

  5 echo '====$#==='

  6 echo $#

  7 echo '====$*==='

  8 echo $*

  9 echo '====$@==='

 10 echo $@
```



执行结果

```bash
[root@localhost ~]# sh  test.sh abc def

===$n===

abc

def

====$#===

2

====$*===

abc def

====$@===

abc def

$?：最后一次执行的命令是否正常，非0即异常

[root@localhost ~]# sh  test.sh abc def

===$n===

abc

def

====$#===

2

====$*===

abc def

====$@===

abc def

[root@localhost ~]# echo $?

0

[root@localhost ~]# sh param.sh

sh: param.sh: No such file or directory

[root@localhost ~]# echo $?

127
```

## 运算符

- $[a+b]
- $((a+b))

```bash
root@localhost ~]# sh add.sh 1 2

sum=3

[root@localhost ~]# cat add.sh 

\#!bin/bash

sum=$[$1+$2]

echo sum=$sum

[root@localhost ~]# s=$[(2+3)*4]

[root@localhost ~]# echo $s

20
```



## 条件判断

### 基本语法

- test condition
- [ condition ] 注意condition两侧都有空格

注意：[ $a = hello ]：等于左右有空格，若连接在一起则会被认为是一个整体

### 常用判断条件

#### 整数之间

- -lt:less than 小于
- -gt:great than 大于
- -eq:equal 等于
- -ne:not equal 不等于
- le:less equal 小于等于
- ge:great equal 大于等于

```bahs
(base) felix@felixdeMacBook-Air / % [ 2 -lt 3 ]

(base) felix@felixdeMacBook-Air / % echo $?

0

(base) felix@felixdeMacBook-Air / % [ 2 -gt 3 ]

(base) felix@felixdeMacBook-Air / % echo $?    

1

(base) felix@felixdeMacBook-Air / % [ 2 -eq 3 ]

(base) felix@felixdeMacBook-Air / % echo $?    

1

(base) felix@felixdeMacBook-Air / % [ 2 -ne 3 ]          

(base) felix@felixdeMacBook-Air / % echo $?

0

(base) felix@felixdeMacBook-Air / % [ 2 -le 3 ]

(base) felix@felixdeMacBook-Air / % echo $?    

0

(base) felix@felixdeMacBook-Air / % [ 2 -ge 3 ]

(base) felix@felixdeMacBook-Air / % echo $?    

1
```



#### 文件权限

-r:文件是否可读

-w:文件是否可写

-x:文件是否可执行

#### 文件类型

-e:文件是否存在

-f:文件是否存在且是一个常规文件（file）

-d:文件是否存在且是一个目录

#### 多重判断

&&：与

｜｜：或

[ $a -lt 15 ]&&echo "$a<15"||"$a>15"：类似三元运算符，如果前一条命令执行成功则输出"$a<15",失败则输出"$a>15"

(base) felix@felixdeMacBook-Air / % a=10

(base) felix@felixdeMacBook-Air / % [ $a -lt 15 ]&&echo "$a<15"||"$a>15"

10<15

## 分支

### 单分支

#### 基本语法

写法一：

if [ condition ]; then 

程序

fi

写法二：

if[ condition ]

then

程序

fi

#### 示例程序

```bash
#!/bin/bash
a=10
b=20
c=30
if [ $a -lt 20 ]; then
echo "$a<20"
fi

if [ $b -eq 20 ]
then
  echo "$b=20"
fi

if [ "$1"x = "hello"x ]; then
echo "hello ok"
fi

if [ $c -gt 18 ] &&[ $c -lt 35 ];then
  echo "age ok"
fi

if [ $c -gt 18 -a $c -lt 35 ];then
  echo "age ok"
fi
```

注意

- if [ "$1"x = "hello"x ]：后面拼接x是防止传入参数为空时程序无法判断，异常退出。
- if后面有空格
- -a 作用与&&相同：AND
- then和if同行时，then前面最好带一个空格

### 多分支

#### 基本语法

if [ condition ]; then

echo "branch 1"

elif [ condition ]; then

echo "branch 2"

else

echo "branch 3"

fi 

#### 示例程序

```bash
#!/bin/bash
if [ $1 -lt 18 ]; then
        echo "<18"
elif [ $1 -lt 35 ]; then
        echo "<35"
elif [ $1 -lt 55 ];then
        echo "<55"
else
        echo ">55"
fi
```

### case语句

#### 基本语法

case $变量名 in

"值1"）

如果为值1，执行程序1

；；

"值2"）

如果为值2，执行程序2

；；

"值3"）

如果为值3，执行程序3

；；

*）

如果为其他值，执行程序4

；；

esac

#### 示例程序

```bash
#!/bin/bash
case $1 in
1)
        echo "one"
;;
2)
        echo "two"
;;
3)
        echo "three"
;;
*)
        echo "other"
;;
esac
~    
```

## 循环

### for循环

#### 基本语法

语法一：

for (( 初始值;循环条件;变量变化 ))

do

程序

done



语法二：**常用** 类似增强for循环

for i in 值1,值2.....

do 

程序

done

注意：

- 双小括号里可以直接写大于小于号
- {1..100}是一个生成序列，表示从1到100

#### 示例程序

```bash
   #!/bin/bash
  for (( i=1;i<=$1;i++ ))
  do
       sum=$[ $sum+$i ]
  done
  echo $sum
```



```bash
  #!/bin/bash
  for i in {1..100}
  do
         sum=$[ $sum+$i ]
  done
  echo $sum
```

### while循环

#### 基本语法

while [ 条件表达式 ]

do

程序

done 

#### 示例程序

```bash
a=1
while [ $a -le $1 ]
do
        sum2=$[ $sum2+$a ]
        #a=$[ $a+1 ]
        let sum3+=a
        let a++ 
done
echo $sum2
echo $sum3
```

## read读取控制台输入

### 基本语法

read (选项) （参数）

选项：

 -p:指定读取时的提示符

-t:指定读取时的等待时间，不加-t就一直等待输入

参数：

变量：指定读取值的变量名

### 示例程序

```bash
#!/bin/bash
stty erase ^H
read -t 10 -p "请输入名字：" name
echo $name
```

## 系统函数

### 命令替换

#### 基本语法

$( 命令/函数 )：相当于函数调用

#### 示例程序

```bash
#!/bin/bash

filename="$1"_log_$(date +%s)
echo $filename
```

### basename

#### 基本语法

basename [ string/pathanme ][ suffix ]

删除前缀只剩下最后一个/后的内容

basename可以理解为路径中的文件名

suffix：如果指定了suffix，会将上述删完前缀的文件名后缀删除

#### 示例程序

basename $0 .sh

### dirname

#### 基本语法

dirname:获取绝对路径。去除文件名返回目录

#### 示例程序例

```bash
#!/bin/bash
cd $( dirname $0)
echo $( pwd) 
```

### 自定义函数

#### 基本语法

- [ function ] functionname[()]{Action;[return int;]}

#### 经验技巧

- 调用函数之前先声明，shell脚本是逐行执行，不会像其他语言会编译
- 函数返回值，只能用$?获取。使用return显示返回，不适用return会返回最后一条命令运行结果
- return只能返回数值0-255,，一般不使用

#### 示例程序  

```bash
#!/bin/bash

function add(){
        sum=$[$1 + $2]
        echo $sum
}

add $1 $2
s=$(add $1 $2)
echo "和的平方："$[s * s]
```