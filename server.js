// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// 启用 JSON 解析和跨域支持
app.use(express.json());
app.use(cors());

// 创建 MySQL 连接（请根据你的配置修改下面参数）
const connection = mysql.createConnection({
  host: 'localhost',        // 数据库服务器地址
  user: 'yourusername',     // 数据库用户名
  password: 'yourpassword', // 数据库密码
  database: 'yourdatabase'  // 数据库名称
});

// 连接到 MySQL 数据库
connection.connect(err => {
  if (err) {
    console.error('连接 MySQL 数据库失败: ' + err.stack);
    return;
  }
  console.log('已连接到 MySQL，线程 ID: ' + connection.threadId);
});

// 创建排行榜数据表（如果不存在则创建）
const createTableQuery = `
CREATE TABLE IF NOT EXISTS leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
connection.query(createTableQuery, (err, results) => {
  if (err) {
    console.error('创建数据表失败: ', err);
    return;
  }
  console.log('数据表已创建或已存在');
});

// API：保存用户成绩
app.post('/api/score', (req, res) => {
  const { name, score } = req.body;
  if (typeof name !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ error: '参数不正确' });
  }
  const query = 'INSERT INTO leaderboard (name, score) VALUES (?, ?)';
  connection.query(query, [name, score], (err, results) => {
    if (err) {
      console.error('插入数据失败: ', err);
      return res.status(500).json({ error: '内部错误' });
    }
    res.json({ message: '成绩保存成功' });
  });
});

// API：获取排行榜数据（按分数从高到低排序）
app.get('/api/leaderboard', (req, res) => {
  const query = 'SELECT name, score, created_at FROM leaderboard ORDER BY score DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询数据失败: ', err);
      return res.status(500).json({ error: '内部错误' });
    }
    res.json(results);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
