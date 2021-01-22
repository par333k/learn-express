# Express req, res 객체

## http module 의 확장형

### req
* req.app: req 객체를 통해 app 객체에 덥근할 수 있다. req.app.get('port')와 같은 식으로 사용가능
* req.body: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체
* req.cookies: cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체
* req.ip: 요청의 ip 주소가 담겨 있다.
* req.params: 라우트 매개변수에 대한 정보가 담긴 객체
* req.query: 쿼리스트링에 대한 정보가 담긴 객체
* req.signedCookies: 서명된 쿠키들은 req.cookies 대신 여기에 담겨 있다.
* req.get(헤더 이름): 헤더의 값을 가져오고 싶을 때 사용하는 메서드.

### res
* res.app: req.app 처럼 res 객체를 통해 app 객체에 접근 가능
* res.cookie(키, 값, 옵션): 쿠키를 설정하는 메서드
* res.clearCookie(키, 값, 옵션): 쿠키를 제거하는 메서드
* res.end(): 데이터 없이 응답을 보냄
* res.json(JSON): JSON 형식의 응답을 보냄
* res.redirect(주소): 리다이렉트할 주소와 함께 응답을 보냄
* res.render(뷰, 데이터): 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드
* res.send(데이터): 데이터와 함께 응답을 보냄, 데이터는 문자열일 수도 있고 HTML 일 수도 있고 버퍼일 수도 있고 객체나 배열일 수도 있음
* res.sendFile(경로): 경로에 위치한 파일을 응답
* res.set(헤터, 값): 응답의 헤더를 설정
* res.status(코드): 응답 시의 HTTP 상태 코드를 지정

req나 res 객체의 메서드는 메서드 체이닝을 지원하는 경우가 많다
Ex) res.status(201).cookie('aaa', 'aaa').redirect('/asd');