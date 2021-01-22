const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

// 인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다
app.use(morgan('dev'));

// 정적 파일을 제공하는 라우터 역할, express 객체 안에 있다. '요청 경로', '실제경로' 순
// 파일이 없으면 내부적으로 next를 호출 파일을 발견했다면 응답으로 파일을 보내고 next는 보내지 않음
app.use('/', express.static(path.join(__dirname, 'public')));

// 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어 주는 미들웨어, 보통 폼 데이터느Ajax 요청의 데이터 처리, 단 멀티파트 데이터는 처리 X
// 익스프레스 4.16.0 버전부터 body-parser 미들웨어 일부 기능이 내장, 그러나 JSON과 URL-encoded 외에도 Raw, Text 형식의 데이터를 추가로 해석하려면 설치하면 됨
// Raw는 요청의 본문이 버퍼 데이터 일 때, Text는 텍스트 데이터일 때 해석하는 미들웨어
// JSON은 JSON 형식의 데이터 전달 방식, URL-encoded는 주소 형식으로 데이터를 전달(주로 폼 전송을 많이 씀)
// body-parser 를 사용하면 내부적으로 stream을 처리해 req.body에 추가, req.on('data')나 req.on('end')로 스트림을 따로 사용하지 않아도 된다.
app.use(express.json());
app.use(express.urlencoded({ extended: false})); // extended 옵션이 false면 노드의 querystring 모듈을 사용해 쿼리 스트링을 해석, true 면 qs 모듈을 사용하여 쿼리스트리을 해석
app.use(bodyParser.raw());
app.use(bodyParser.text());

// 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만든다.
// 일반 쿠키가 아닌 서명된 쿠키는 req.signedCookies 객체에 들어간다
// cookie-parser가 쿠키를 생성하지는 않는다. 쿠키는 res.cookie(키, 값, 옵션) 형식으로 사용하고, 제거는 res.clearCookie(키, 값, 옵션) 의 메소드를 사용한다.
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookieParser(비밀키);

// 세션 관리용 미들웨어
// 인수로 세션에 대한 설정을 받는다
// 실제로는 서버에서 세션값을 안정적으로 유지하기 위해 store라는 옵션을 많이 쓴다.
// stroe에 데이터베이스를 연결하여 세션을 유지한다. 레디스나 사용하는 DB를 활용한다.
app.use(session({
    resave: false, // 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 여부
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할 지 여부
    secret: process.env.COOKIE_SECRET, 
    cookie: { // 세션 쿠키에 대한 옵션
        httpOnly: true, // 클라이언트에서 쿠키를 확인하지 '못하게'하는 여부
        secure: false, // https 가 '아닌' 환경에서 사용할지 여부
    },
    name: 'session-cookie', // 세션 쿠키의 이름
}));

// 미들웨어는 익스프레스의 핵심, 요청과 응답의 중간(middle)에 위치하여 미들웨어라고 한다.
// 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도 하고, 나쁜 요청을 걸러내기도 한다.
// 미들 웨어는 app.use(미들웨어)형태로 사용한다.
// next를 호출하지 않는 미들웨어는 res.send나 res.sendFile등의 메서드로 응답을 보내야 합니다.
// 예를 들어 express.static과 같은 미들웨어는 정적 파일을 제공할 때 next 대신 res.sendFile 메서드로 응답을 보내고
// 따라서 그 다음 미들웨어는 연속으로 처리할경우 실행되지 않는다. 미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있다는 것이다.
// next도 응답도 보내지 않으면 클라이언트는 하염없이 기다린다.
// next에 인수를 넣을 수 있다. route라는 문자열을 넣으면 다음 라우터의 미들웨어로 바로 이동하고, 그 외의 인수를 넣는다면 바로 에러 처리 미들웨어로 이동한다.
// 이 때의 인수는 에러 처리 미들웨어의 err 매개변수가 된다. next(err) -> (err, req, res, next) => { }
// 미들웨어에서 요청이 끝날 때 까지만 유지하고 싶은 데이터가 있다면 데이터도 req 객체에 전달할 수 있다.
/*
* app.use((req, res, next) => {
*   req.data = '데이터 넣기';
*   next();
* }, (req, res, next) => {
*   console.log(req.data); // 데이터 받기
*   next();
* });
*
 */
// 새로운 요청이 오면 req.data는 초기화 된다. 다른 미들웨어와 겹치지 않게 하는 것이 중요 ex)body를 속성으로하면 body-parser와 기능이 겹치게된다.
// app.set을 사용하지 않는 이유는 express 전역적으로 사용되는 메서드기 때문에 개별 데이터에 관해서는 직접 req 객체로 전달하는게 좋다.

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

// 미들웨어 디자인 패턴, 미들웨어 안에 미들웨어를 넣을 경우 기존 미들웨어의 기능을 확장할 수 있다.
// 가령 조건에 따른 분기처리 등.
/*
* app.use((req, res, next) => {
*     if (process.env.NODE_ENV === 'production') {
*         morgan('combined')(req, res, next);
*     } else {
*         morgan('dev')(req, res, next);
*     }
* });
 */


/*
* app.use(미들웨어) : 모든 요청에서 미들웨어 실행
* app.use('/abc', 미들웨어) : abc로 시작하는 요청에서 미들웨어 실행
* app.post('/abc', 미들웨어) : abc로 시작하는 POST 요청에서 미들웨어 실행
 */

const multer = require('multer');
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload',
    upload.fields([{ name: 'image1' }, { name: 'image2' }]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send('ok');
    },
);

app.get('/', (req, res, next) => {
    //    res.send('Hello Express');
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})

app.listen(app.get('port'), () => {
   console.log(app.get('port'), '번 포트에서 대기 중');
});

