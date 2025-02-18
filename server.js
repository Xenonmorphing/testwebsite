const express = require('express');
const db = require('./database');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 提交分数
app.post('/submit', (req, res) => {
    const { name, score } = req.body;
    db.query('INSERT INTO leaderboard (name, score) VALUES (?, ?)', [name, score], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: '✅ 分数提交成功！' });
    });
});

// 获取排行榜
app.get('/leaderboard', (req, res) => {
    db.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.listen(3001, () => console.log('✅ 服务器运行在 http://localhost:3001'));
