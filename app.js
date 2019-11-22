const express = require('express');
// 模板引擎
const exphds = require('express-handlebars');
// 用于获取用户端参数
const bodyParser = require('body-parser');
// 数据库
const mongoose = require('mongoose');

const app = express();

// 连接数据库 Connect to mongoose  connect是一个promise封装的方法 ， 所以使用then
//mongodb://localhost/node-app创建一个叫做node-app的数据库
mongoose.connect('mongodb://localhost/node-app').then((res)=>{
    // console.log(res);
    console.log("mongodb connect success...");
}).catch((err)=>{
    console.log(err);
})

// 引入模型
require('./models/Idea');
// 实例化模块，然后使用Idea来存取数据
// 在数据库中创建一张ideas表
const Idea = mongoose.model('ideas');

// 链接成功后，创建一个schema

// handlebars middleware  设置入口文件和文件类型为handlebars
app.engine('handlebars',exphds({
    // views文件夹下的lauouts文件夹下的main.handlebars文件
    defaultLayout:'main'
}))

// 设置当前的模板引擎是 handlebars, 之前是ejs
app.set('view engine', 'handlebars');

// body-parser middleware 配置获取参数类型和编码
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extends:false});

/*  配置路由
*/
// 请求了根路径
app.get('/',(req,res)=>{
    // res.send("INDEX");
    const title = "大家好，我是黄小帅!!!!"
    res.render('index',{
        title:title
    });
})

// 请求了About
// app.get('/about/:id',(req,res)=>{
app.get('/ideas/add',(req,res)=>{
    // console.log(req.params.id);//获取url的参数
    // res.send(`ABOUT${req.params.id}`);
    res.render('ideas/add');
})

app.get('/about',(req,res)=>{
    res.render('about');
})

// 添加
app.get('/ideas',(req,res)=>{
    // 从数据库中拿到ideas表
    Idea.find({})
    .sort({date:'desc'})//做一个排序
    .then(ideas=>{
        res.render('ideas/index',{ideas:ideas});
    })
})

// 编辑
app.get('/ideas/edit/:id',(req,res)=>{
    // 查询这条指定数据
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        res.render('ideas/edit',{
            idea:idea
        })
    })
})


// body-parser的urlencoded({extends:false})用于post的第二个参数
app.post('/ideas',urlencodedParser,(req,res)=>{
    // res.render();
    console.log(req.body);

    let errors = [];

    // 判断前端是否有title输入
    if(!req.body.title){
        errors.push({text:"请输入标题"})
    }

    // 判断用户是否有details输入
    if(!req.body.details){
        errors.push({text:"请输入详情"})
    }

    // 如果出错，就把它render到ideas/add下面
    if(errors.length>0){
        res.render('ideas/add',{
            errors:errors,
            text: req.body.title,
            details:req.body.details
        })
    }else{
        // 完全输入的话，就可以在这里存储数据了
        // res.send("Ok")
        // 把数据存储起来，跳转到要跳转的页面
        // new Idea(req.body)
        const newUser = {
            title:req.body.title,
            details:req.body.details
        }

        // 把数据存起来，并跳转到指定页面
        new Idea(newUser)
        .save()
        .then((idea)=>{
            res.redirect('/ideas')
        });
    }
})

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on ${port}`);
})










