---
icon: fa-brands fa-bug
date: 2024-11-05
category:
  - Java
tag:
  - 坑王
---
# equals与等号

## 概述

> 等号比较的是变量(栈)内存中存放的对象的(堆)内存地址，用来判断两个对象的地址是否相同，即是否是指相同一个对象。
>
> equals用来比较的是两个对象的内容是否相等

## 基本数据类型和引用数据类型

> 基本类型：long,int,byte,float,double
> 对象类型：Long,Integer,Byte,Float,Double其它一切java提供的，或者你自己创建的类
>
> Long,Integer,Byte,Float,Double成为包装类

## 用法

> 基本数据类型用等号比较值是否相等
>
> 引用类型使用equals比较值是够相等

:warning: `Long类型是long的包装类，如果要比较Long类型的值是否相等，要使用equals`