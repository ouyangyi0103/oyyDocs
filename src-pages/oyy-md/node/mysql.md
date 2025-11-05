---
outline: deep
head:
  - - meta
    - name: title
      content: 自我学习
  - - meta
    - name: description
      content: 自我学习，努力上进
---

## 一、介绍

`MySQL`是一种开源的`关系型数据库`管理系统（RDBMS），它是最受欢迎的数据库系统之一。MySQL 广泛用于 Web 应用程序和其他需要可靠数据存储的应用程序中。

### 1. 什么是关系型数据库？

在关系型数据库中，数据以结构化的方式存储，其中每个表格由一组列（字段）和一组行（记录）组成。每个列定义了数据的类型和属性，而每个行则表示一个特定的数据实例。表格之间的关系通过使用主键和外键进行建立。主键是唯一标识表格中每个行的列，而外键是指向其他表格主键的列，用于建立表格之间的关联关系。

### 2. 安装

官网：`www.mysql.com/`

安装完成之后检查 Mysql 服务是否开启，使用 win+r 打开运行窗口输入 services.msc，找到 MySQL83 启动服务，然后去配置环境变量
最后在 cmd 中输入 mysql -u root -p，再输入密码，如果出现 mysql 就说明成功了

## 二、sql 语句

`SQL语句`（Structured Query Language）是一种用于管理关系型数据库系统的语言。它是一种标准化语言，用于执行各种数据库操作，包括数据查询、插入、更新和删除等。

### 1. 操作数据库

#### 1.1 创建数据库

```sql
create database 库名
```

进行重复创建会进行报错，如果要避免报错，可以进行下面的操作

```sql
create database if not exists `xiaoman`
```

说明如果数据库不存在，就创建数据库，如果存在，就什么都不做

添加字符集`utf-8`

```sql
create database `xiaoman`
    default character set = 'utf8mb4';
```

#### 1.2 创建表

```sql
CREATE TABLE `user` (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(100) COMMENT '名字',
   age int COMMENT '年龄',
   address varchar(255) COMMENT '地址',
   create_time timestamp DEFAULT CURRENT_TIMESTAMP  COMMENT '创建时间'
) COMMENT '用户表'
```

```txt
create table 表名字 (
  id字段名称   int数据类型代表数字类型   NOT NULL(不能为空)  AUTO_INCREMENT(id自增) PRIMARY KEY(id为主键)
  name(字段名称) varchar(100)字符串类型100字符 COMMENT(注释)
  age(字段名称) int数据类型代表数字类型  COMMENT(注释)
  create_time(字段名称) timestamp(时间戳) DEFAULT CURRENT_TIMESTAMP(自动填充创建时间)
)
```

#### 1.3 修改表名

```sql
ALTER TABLE `user` RENAME `user2`;
```

#### 1.4 增加列

```sql
ALTER TABLE `user` ADD COLUMN `hobby` VARCHAR(200)
```

#### 1.5 删除列

```sql
ALTER TABLE `user` DROP COLUMN `hobby`
```

#### 1.6 编辑列

```sql
ALTER TABLE `user` MODIFY COLUMN `age` VARCHAR(255) NULL COMMENT '年龄2'
```

## 三、数据库查询

### 1. 查询单个列

```sql
SELECT `name` FROM `user`
```

### 2. 查询多个列

```sql
SELECT `name`,`age` FROM `user`
```

### 3. 查询所有列

```sql
SELECT * FROM `user`
```

### 4. 列的别名

```sql
SELECT `name` as `user_name`,`id` as `user_id` FROM `user`
```

### 5. 列排序

ORDER BY [字段名称] `desc降序`(从大到小) `asc升序`(从小到大)

```sql
SELECT * FROM `user` ORDER BY id DESC
```

### 6. 限制查询结果

limit [开始行] [限制条数]

```sql
SELECT *  FROM `user` LIMIT 1,3
```

### 7. 条件查询

```sql
SELECT * FROM `user` WHERE name='大神'
```

### 8. 多个条件联合查询

#### 8.1 and 操作符

在给定多个搜索条件的时候，我们有时需要某条记录只在符合所有搜索条件的时候进行查询，这种情况我们可以使用 `AND` 操作符来连接多个搜索条件

```sql
SELECT * FROM `user` name='大神' ADN age <= 20
```

#### 8.2 or 操作符

在给定多个搜索条件的时候，我们有时需要某条记录在符合某一个搜索条件的时候就将其加入结果集中，这种情况我们可以使用 `OR` 操作符来连接多个搜索条件

```sql
SELECT * FROM `user` name='大神' OR age <= 20
```

### 9. 模糊查询

```sql
SELECT * FROM `user` WHERE name LIKE '%满%'
```

- "满%"：匹配以"满"开头的字符串，后面可以是任意字符。
- "%满"：匹配以"满"结尾的字符串，前面可以是任意字符。
- "%满%"：匹配包含"满"的任意位置的字符串，前后可以是任意字符。

## 四、数据库增删改

### 1. 新增语句

```sql
INSERT INTO user(`name`,`age`,`hobby`) VALUES(`yy`,`18`,`唱歌`)

也可以插入 NULL
INSERT INTO user(`name`,`age`,`hobby`) VALUES(NULL,NULL,NULL)

插入多条数据
INSERT INTO user(`name`,`age`,`hobby`) VALUES(NULL,NULL,NULL),(`yy`,`18`,`唱歌`)
```

### 2. 删除语句

```sql
DELETE FROM `user` WHERE id = 1
```

#### 2.1 批量删除

```sql
DELETE FROM `user` WHERE id IN (8,9,10)
```

### 3. 更新语句
