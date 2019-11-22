// 引入mongoose
const mongoose = require('mongoose');

// 实例化一个模型
/* 
  通过 Schema来设置都有哪些属性
  mongodb是一个非关系型数据库，所以，我们需要一个 Schema,使用Schema实例一个对象，然后给他传递我们需要用到的属性
*/
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  // title:{
  //   type:String,//字符串类型
  //   required:true,//必须的
  // },
  title:{
    type: String,
    // 必须是string吗，用required为true来指定
    required:true
  },
  details:{
    type:String,
    required:true
  },
  // 添加的时候，会自动获取时间
  date:{
    type:Date,
    defaule:Date.now
  }
});

// 供外面调用
mongoose.model('ideas',IdeaSchema);




