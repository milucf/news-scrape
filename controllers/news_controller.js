var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var Article=require("../models/Article.js");
var Note=require("../models/Note.js");

var router=express.Router();


mongoose.connect("mongodb://localhost/dbnews");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


router.get("/",function(req,res){
    var articles=[];
    var articlesTitles=[];
    request("https://www.nytimes.com/section/world/",function(error,response,html){
        var $=cheerio.load(html);
  
        $("#latest-panel article.story.theme-summary div.story-body a.story-link").each(function(i,element){
             var result={
                 title:$(this).children(" div.story-meta").children("h2").text().trim(),
                 link:$(this).attr("href"),
                 photo:$(this).children("div.wide-thumb").children("img").attr("src"),
                 body:$(this).children(" div.story-meta").children("p.summary").text()
             }
    
           articles.push(result);
           articlesTitles.push(result.title);
          });  

          Article.find({title:{$in:articlesTitles}},function(valerr,existdocs){
            for(i=0;i<articles.length;i++)
                for(j=0;j<existdocs.length;j++){
                    if(articles[i].title==existdocs[j].title){
                       articles.splice(i,1);
                       i--;
                       j=existdocs.length;
                    }
                }
                if(articles.length>0){
                    Article.insertMany(articles,function(createrr,adddocs){
                        Article.find({},function(err,docs){
                            res.render("index",{news:docs});
                        });
                    });
                }
                else{   
                    Article.find({},function(err,doc){
                        res.render("index",{news:doc});
                    });
                  
                }

        });       
    });
});

router.get("/article/:id",function(req,res){
    Article.findOne({_id:req.params.id},function(err,doc){
        if(err) throw err;
        res.json(doc);
    })

});

router.post("/savenote/:articleId", function(req, res) {
    var note={
        body:req.body.body
    }
    var newNote = new Note(note);

    newNote.save(function(error, noteDoc) {
        Article.findOneAndUpdate({ "_id": req.params.articleId }, {$push:{"notes": noteDoc._id }})
        .exec(function(err, article) {
            res.send(article);
        });
    });
  });

  router.get("/api/news",function(req,res){
    Article.find({},function(err,doc){
        res.json(doc);
    });
  });

  router.post("/delete/note", function(req, res) {
      Note.findOneAndRemove({_id:req.body.noteid},function(err,notedoc){
          Article.update({"notes":notedoc._id},{ $pull: { "notes": notedoc._id}},function (err2,articledoc) {
              res.json(articledoc);
          } );
      });

  });

  router.get("/article/comnts/:articleId",function(req,res){
    Article.find({_id:req.params.articleId}).populate("notes").exec(function(err,doc){
        res.json(doc);
    });
  });



module.exports = router;