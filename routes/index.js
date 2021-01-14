// 라우터 만들기
const express = require('express')
const router = express.Router();

const template = require('../lib/template.js');

//route, routing : 사용자들이 여러가지 path를 통해 들어올 때 path마다 적절한 응답을 해주는 것?
//get 메서드를 통해, 첫번째 인자에 path을 전달함으로써 라우팅을 하고 있는것.
router.get('/', (req, res) => {
    // fs.readdir('./data', function(error, filelist){
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(req.list);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:20px">
        `,
        `<a href="/topic/create">create</a>`
      );
      /* res.writeHead(200);
       res.end(html); */
      res.send(html); // 위의 명령을 한번에
    // });
  });

  module.exports = router;