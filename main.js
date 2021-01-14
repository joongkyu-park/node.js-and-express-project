const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');



const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
/*
bodyParser.urlencoded({ extended: false }) 와
compression() 는
각각의 '미들웨어'를 return하는 함수.
그 미들웨어가 app.use를 통해서 장착.

그러면 애플리케이션은 요청이 들어올때마다  
위의 두 statement가 실행된다.
*/


/* 원래는 app.use( ... )인 미들웨어였지만, post 방식일 때도 파일목록을 만들 이유는 없기 때문에,
요청방식이 get 일 때만 파일리스트를 만드는 미들웨어로 변경!
*/
app.get('*', function(req, res, next){
  fs.readdir('./data', function(error, filelist){
    req.list = filelist;
    next();
  });
});



/*라우터를 이용해서 /topic 으로 시작하는 파일을 분리해서 정리
즉, 라우터 라고 하는 express의 기능을 이용해, 서로 연관되어있는 라우트들을 별도의 파일로 빼내서 코드를 단순화시킨다.*/
app.use('/topic', topicRouter) // 뜻 : '/topic'으로 시작하는 주소들에게, 'topicRouter'라고 하는 미들웨어를 적용하겠다, 라는 뜻

app.use('/index', indexRouter)



//에러핸들링은 항상 모든 함수의 제일 아래에 있어야한다.
app.use(function (err, req, res, next) { // 이 인자가 4개 있는 함수가 에러핸들링
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// html상에서 404에러가 전해졌을 때 쓸 수 있는 에러처리방법.


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(req.params.pageId === undefined){
        
      } else {
        
      }
    } else if(pathname === '/create'){

    } else if(pathname === '/create_process'){

    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
     
    } else if(pathname === '/delete_process'){
     
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/