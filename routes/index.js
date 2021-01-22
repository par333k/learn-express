const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
//    res.send('Hello, Express');
// 넌적스를 사용하기 위해 데이터 전달
    res.render('index', { title: 'Nunjucks data'});
});

module.exports = router;