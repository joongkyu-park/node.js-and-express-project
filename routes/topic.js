// 라우터 만들기
const express = require('express')
const router = express.Router()

const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const { nextTick } = require('process');

router.get('/create', (req,res)=>{
    // fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(req.list);
      var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      res.send(html);
    // });
  });
  
  
  router.post('/create_process', (req,res)=>{
  
    /*
    var body = '';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            res.redirect(302,`/page/${title}`)
          })
        });
    });
    */
   
    // body-parser 미들웨어 사용
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(302,`/topic/${title}`)
      })
    });
  })
  
  
  router.get('/update/:pageId', (req,res)=>{
    // fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(req.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.HTML(title, list,
          `
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        res.send(html);
      });
    // });
  });
  
  
  /*
  body : 웹브라우저쪽에서 요청한 정보의 본체
  header : 그 본체를 설명하는 데이터
  */
  
  
  router.post('/update_process', function(req, res){
    /*
    var body = '';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            res.redirect(`/page/${title}`);
          })
        });
    });
    */
  
    //body-parser 사용
   var post = req.body;
   var id = post.id;
   var title = post.title;
   var description = post.description;
   fs.rename(`data/${id}`, `data/${title}`, function(error){
     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
       res.redirect(`/topic/${title}`);
     })
   });
  });
  
  router.post('/delete_process', (req,res)=>{
    /*
    var body = '';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          res.redirect(302,`/`)
        })
    });
    */
   var post = req.body;
   var id = post.id;
   var filteredId = path.parse(id).base;
   fs.unlink(`data/${filteredId}`, function(error){
     res.redirect(302,`/`)
   })
  
  })
  
  
  //querystring이 아닌, URL path 방식으로 파라미터를 전달하는 것을 처리하는 라우팅 기법
  router.get('/:pageId', (req, res, next) => {
    // fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(req.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
            next(err);
        }else{
        var title = req.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(req.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        res.send(html);
        }
      });
    // });
  });
  
  
  module.exports = router;