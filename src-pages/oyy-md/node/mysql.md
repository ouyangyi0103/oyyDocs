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

```sql
UPDATE `user` SET name="xxx",age=18,hobby="打球" WHERE id = 1
```

## 五、表达式和函数

### 1. 表达式

MySQL 表达式是一种在 MySQL 数据库中使用的计算式或逻辑式。它们可用于查询、更新和过滤数据，以及进行条件判断和计算。

- 1. **算术表达式：** 可以执行基本的数学运算，例如加法、减法、乘法和除法。例如：`SELECT col1 + col2 AS sum FROM table_name;`
- 2. **字符串表达式：** 可以对字符串进行操作，例如连接、截取和替换。例如：`SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM table_name;`
- 3. **逻辑表达式：** 用于执行条件判断，返回布尔值（TRUE 或 FALSE）。例如：`SELECT \* FROM table_name WHERE age > 18 AND gender = 'Male';`
- 4. **条件表达式：** 用于根据条件返回不同的结果。例如：`SELECT CASE WHEN age < 18 THEN 'Minor' ELSE 'Adult' END AS age_group FROM table_name;`
- 5. **聚合函数表达式：** 用于计算数据集的聚合值，例如求和、平均值、最大值和最小值。例如：`SELECT AVG(salary) AS average_salary FROM table_name;`
- 6. **时间和日期表达式：** 用于处理时间和日期数据，例如提取年份、月份或计算日期差值。例如：`SELECT YEAR(date_column) AS year FROM table_name;`

比如在查询数据的时候数值增加 100

```sql
SELECT age + 100 FROM `user`
```

如果要换一个列名可以用 as

```sql
SELECT age as user_age FROM `user`
```

### 2. 函数

MySQL 提供了大量的内置函数，用于在查询和操作数据时进行计算、转换和处理。以下是一些常用的 MySQL 函数分类及其示例：

#### 2.1 字符串函数

- **CONCAT(str1, str2, ...)：** 将多个字符串连接起来。
- **SUBSTRING(str, start, length)：** 从字符串中提取子字符串。
- **UPPER(str)：** 将字符串转换为大写。
- **LOWER(str)：** 将字符串转换为小写。
- **LENGTH(str)：** 返回字符串的长度。

#### 2.2 数值函数

- **ABS(x)：** 返回 x 的绝对值。
- **ROUND(x, d)：** 将 x 四舍五入为 d 位小数。
- **CEILING(x)：** 返回不小于 x 的最小整数。
- **FLOOR(x)：** 返回不大于 x 的最大整数。
- **RAND()：** 返回一个随机数。

#### 2.3 日期和时间函数

- **NOW()：** 返回当前日期和时间。
- **CURDATE()：** 返回当前日期。
- **CURTIME()：** 返回当前时间。
- **DATE_FORMAT(date, format)：** 将日期格式化为指定的格式。
- **DATEDIFF(date1, date2)：** 计算两个日期之间的天数差。

#### 2.4 条件函数

- **IF(condition, value_if_true, value_if_false)：** 根据条件返回不同的值。
- **CASE WHEN condition1 THEN result1 WHEN condition2 THEN result2 ELSE result END：** 根据条件返回不同的结果。

#### 2.5 聚合函数

- **COUNT(expr)：** 计算满足条件的行数。
- **SUM(expr)：** 计算表达式的总和。
- **AVG(expr)：** 计算表达式的平均值。
- **MAX(expr)：** 返回表达式的最大值。
- **MIN(expr)：** 返回表达式的最小值。

## 六、子查询和连表查询

### 1. 子查询

`子查询`（Subquery），也被称为嵌套查询（Nested Query），是指在一个查询语句中嵌套使用另一个完整的查询语句。子查询可以被视为一个查询的结果集，它可以作为外层查询的一部分，用于进一步筛选、计算或操作数据。

`子查询`通常出现在`主查询`的`WHERE子句`、`FROM子句`、`HAVING子句`或`SELECT子句`中，以提供更复杂的查询逻辑。子查询可以根据主查询的结果动态生成结果集，用于过滤和匹配数据，或者作为函数的参数使用。

子查询可以返回单个值、一列值、一行值或者一个结果集，具体取决于子查询的语法和用法。根据子查询返回的结果类型，可以将其与主查询的其他表达式进行比较、连接或使用作为条件进行过滤。

我们之前的案例都是在一张表去查询，现实中不会把所有东西都放在一张表，会进行分表，甚至还会分库分表，读写分离等等。

### 2. 子查询案例

- photo 表的数据
  id:1 create_time:2025-11-5 user_id:1 name:"ouou"
- user 表得到数据
  id: 1 name:'ouou' create_time:2025-11-5 age:18 sex:1

他们的关联关系为` user 表的 id 关联 photo 表的 user_id`

但是我们现在需要通过名字查询出 photo 表的数据 但是 photo 表没有存名字，这该如何去查询呢？
我们可以通过名字查询 user 表的 id，然后通过 user 表的 id 去查询 photo 的 user_id 就完成了

```sql
SELECT * FROM `photo` WHERE `user_id` = (SELECT id FROM `user` WHERE name = 'ouou')
```

### 3. 连表查询

Mysql 的连表分为`内连接`，`外连接`，`交叉连接`

- 对于内连接的两个表，驱动表中的记录在被驱动表中找不到匹配的记录，该记录不会加入到最后的结果集，我们上边提到的连接都是所谓的内连接。
- 对于外连接的两个表，驱动表中的记录即使在被驱动表中没有匹配的记录，也仍然需要加入到结果集。
- 交叉连接是指在两张或多张表之间没有任何连接条件的连接。简单来说，交叉连接可以让你查询所有可能的组合。

#### 3.1 内连接

```sql
SELECT * FROM `user`, `photo` WHERE `user`.`id` = `photo`.`user_id`
```

#### 3.2 外连接

- 左连接
  语法规则 `LEFT JOIN [连接的表] ON [连接的条件]`
  并且以第一个表作为驱动表 被驱动表如果没有值则补充 null

```sql
SELECT * FROM `user` LEFT JOIN `table` ON `user`.`id` = `table`.`user_id`
```

- 右连接

`语法规则 LEFT JOIN [连接的表] ON [连接的条件]`
并且以第二个表作为驱动表 被驱动表如果没有值则忽略

```sql
SELECT * FROM `user` RIGHT JOIN `table` ON `user`.`id` = `table`.`user_id`
```
