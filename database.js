const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // 如果设置了密码，请填入
    database: 'quiz_game'
});

db.connect(err => {
    if (err) console.error('❌ 数据库连接失败:', err);
    else console.log('✅ 已连接到 MySQL');
});

module.exports = db;
