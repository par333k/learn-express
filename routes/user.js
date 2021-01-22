const express = require('express');
const router = express.Router();



// GET /user 라우터
/*router.get('/', (req, res) => {
    res.send('Hello, User');
});*/


router.get('/', (req, res, next) => {
    next('route'); // route를 넣으면 주소와 일치하는 다음 라우터로 넘어간다.
}, function(req, res, next) {
    console.log('실행되지 않습니다');
    next();
}, function(req, res, next) {
    console.log('실행되지 않습니다');
});

router.get('/', function(req, res) {
    console.log('실행됩니다');
    res.send('Hello, Express!');
});

// 라우트 매개변수 패턴
// 일반 라우터보다 뒤에 위치해야함. 앞에 위치할 경우 뒤에 있는 라우터가 작동하지 않음. 다양한 라우터를 아우르는 와일드카드 역할을 하기 때문
router.get('/user/:id', function(req, res) {
    console.log(req.params, req.query);
});

// 주소는 같으나 메서드가 다를경우 합칠 수 있다
router.route('/abc')
    .get((req, res) => {
      res.send('GET /abc');
    })
    .post((req, res) => {
       res.send('POST /abc');
    });

module.exports = router;
