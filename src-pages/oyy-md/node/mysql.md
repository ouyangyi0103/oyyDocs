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

## 七、mysql2

我们需要使用 mysql2 把 mysql 和 express,nodejs 连接起来。

### 1. 依赖安装

```js
npm install mysql2 express js-yaml
// mysql2 用来连接mysql和编写sq语句
// express 用来提供接口 增删改差
// js-yaml 用来编写配置文件
```

### 2. 代码编写

- db.config.yaml

```yaml
db:
  host: localhost #主机
  port: 3306 # 端口
  user: root # 账号
  password: "123456" #密码
  database: dlt #数据库名
```

- index.js

```js
import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";
import express from "express";

const yaml = fs.readFileSync("./db.config.yaml", "utf-8");
const config = yaml.load(yaml);
const sql = await mysql2.createConnection({
  ...config.db
});

const app = express();
app.use(express.json()); // 支持post接口

// 查询全部
app.get("/", async (req, res) => {
  const [data] = await sql.query("select * from user");
  res.send(data);
});

// 查询单个params
app.get("/user/:id", async (req, res) => {
  const [row] = sql.query(`select * from user where id = ${req.params.id}`);
  res.send(row);
});

//新增接口
app.post("/create", async (req, res) => {
  const { name, age, hobby } = req.body;
  await sql.query(`insert into user(name,age,hobby) values(?,?,?)`, [name, age, hobby]);
  res.send({ ok: 1 });
});

//编辑
app.post("/update", async (req, res) => {
  const { name, age, hobby, id } = req.body;
  await sql.query(`update user set name = ?,age = ?,hobby = ? where id = ?`, [
    name,
    age,
    hobby,
    id
  ]);
  res.send({ ok: 1 });
});

//删除
app.post("/delete", async (req, res) => {
  await sql.query(`delete from user where id = ?`, [req.body.id]);
  res.send({ ok: 1 });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## 八、prisma

:::tip ORM 解释
ORM（对象关系映射）是一种编程技术，用于在面向对象编程语言与关系型数据库之间建立映射关系，解决两者在数据模型上的差异
‌ 对象与表映射 ‌：将数据库表映射为程序中的类，表记录映射为类的实例，表字段映射为对象属性 。 ‌
‌ 操作转换 ‌：通过面向对象的方式（如创建、查询、更新对象）替代直接编写 SQL 语句
:::

`Prisma` 是一个现代化的数据库工具套件，用于简化和改进应用程序与数据库之间的交互。它提供了一个类型安全的`查询构建器`和一个`强大的 ORM`（对象关系映射）层，使开发人员能够以声明性的方式操作数据库。
`Prisma` 支持多种主流数据库，包括 PostgreSQL、MySQL 和 SQLite，它通过生成`标准的数据库模型`来与这些`数据库`进行交互。使用 Prisma，开发人员可以定义数据库模型并生成类型安全的查询构建器，这些构建器提供了一套直观的方法来`创建、更新、删除和查询数据库中的数据`。

Prisma 的主要特点包括：

- **类型安全的查询构建器：** Prisma 使用强类型语言（如 TypeScript）生成查询构建器，从而提供了在编译时捕获错误和类型检查的能力。这有助于减少错误，并提供更好的开发人员体验。
- **强大的 ORM 层：** Prisma 提供了一个功能强大的 ORM 层，使开发人员能够以面向对象的方式操作数据库。它自动生成了数据库模型的 CRUD（创建、读取、更新、删除）方法，简化了与数据库的交互。
- **数据库迁移：** Prisma 提供了数据库迁移工具，可帮助开发人员管理数据库模式的变更。它可以自动创建和应用迁移脚本，使数据库的演进过程更加简单和可控。
- **性能优化：** Prisma 使用先进的查询引擎和数据加载技术，以提高数据库访问的性能。它支持高级查询功能，如关联查询和聚合查询，并自动优化查询以提供最佳的性能

### 1. 安装 prisma cli

```js
npm install -g prisma
```

### 2. 初始化项目

```js
prisma init -h
// 查看prisma有哪些命令

prisma init --datasource-provider mysql
// 执行命令之后 就会创建生成基本目录
```

### 3. 连接 mysql

#### 3.1 修改.env 文件

```js
DATABASE_URL = "mysql://root:123456@localhost:3306/xiaoman";
// DATABASE_URL="mysql://账号:密码@主机:端口/库名"
```

### 4.创建表

- prisma 文件夹/schema.prisma

```js
model Post {
  id       Int     @id @default(autoincrement()) //id 整数 自增
  title    String  //title字符串类型
  publish  Boolean @default(false) //发布 布尔值默认false
  author   User   @relation(fields: [authorId], references: [id]) //作者 关联用户表 关联关系 authorId 关联user表的id
  authorId Int
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  posts Post[]
}
```

然后执行命令去创建表
:::danger 注意
用这个命令一定要注意是否覆盖当前库里面的所有内容，建议使用一个新的库去测试
:::

```js
prisma migrate dev
```

### 5.实现 mysql 增删查改

```js
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
const port: number = 3000;

app.use(express.json());

//关联查找
app.get("/", async (req, res) => {
  const data = await prisma.user.findMany({
    include: {
      posts: true
    }
  });
  res.send(data);
});
//单个查找
app.get("/user/:id", async (req, res) => {
  const row = await prisma.user.findMany({
    where: {
      id: Number(req.params.id)
    }
  });
  res.send(row);
});
//新增
app.post("/create", async (req, res) => {
  const { name, email } = req.body;
  const data = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: {
          title: "标题",
          publish: true
        }
      }
    }
  });
  res.send(data);
});

//更新
app.post("/update", async (req, res) => {
  const { id, name, email } = req.body;
  const data = await prisma.user.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
      email
    }
  });
  res.send(data);
});

//删除
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await prisma.post.deleteMany({
    where: {
      authorId: Number(id)
    }
  });
  const data = await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
  res.send(data);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
```
