$(document).ready(function(){

    $(".btn-info").on('click', function () {
        $.get("/article/"+$(this).attr("value"),function(data){
            var headerImg="<img src=\""+data.photo+"\" />";
            var headerTitle="<h3>"+data.title+"</h3>"
            var headerbody="<p>"+data.body+"</p>";
            $(".btn-default").attr("value",data._id);
            $("#comnt-header").html(headerImg+headerTitle+headerbody);
            $("#myModal").modal("show");
        });
        $("#comments-list").text("Loading Comments...");
        getCommnets($(this).attr("value"));

});


   $("#btnpost").on('click', function () {
       var note={body:$("#comment").val().trim()};
       if(note.body.length)
        $.post("/savenote/"+$(this).attr("value"),note,function(data){
            $("#comment").val("");
            getCommnets(data._id);
        });

});

 $(document).on("click",".btndelete",function(){
     var delIds={
         articleid:$(this).attr("data-articleid"),
         noteid:$(this).attr("value")
     }
     $.post("/delete/note",delIds,function(data){
        getCommnets(delIds.articleid);
    });
 });

function getCommnets(articleid){
    $.get("article/comnts/"+articleid,function(data){
        $("#comments-list").empty();
        var comIcon="<span class=\"glyphicon glyphicon-comment\">&nbsp;</span>";
        var btnDelete;
        console.log(data)
        if(0<data[0].notes.length)
         for(i=0;i<data[0].notes.length;i++){
           btnDelete="<button class=\"btn btndelete pull-right\" data-articleid=\""+articleid+"\" value=\""+data[0].notes[i]._id+"\" >Delete comment</button>"
           $("#comments-list").prepend("<div class=\"well\">"+comIcon+data[0].notes[i].body+btnDelete+"</div>");
        }
        else
         $("#comments-list").html("<span class='fine-desc'>No comments found to show</span>");


    });
}

});