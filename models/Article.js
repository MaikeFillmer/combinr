//Schema for an Article entry

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type:String,
    required:true,
    index : {
      unique : true,
      dropDups : true
    }
  },
  
  link: {
    type:String,
    required:true,
    index : {
      unique : true,
      dropDups : true
    }
  },
  src: {
    type:String,
    required:true
  },
  createdAt: {type: Date, expires: '1m', default: Date.now},
  // img: {
  //   type:String,
  //   required:true,
  //   index : {
  //     unique : true,
  //     dropDups : true
  //   }
  // },
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});


var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
