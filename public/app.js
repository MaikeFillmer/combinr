//Scrape articles
  $("#loading1").show();
  $("#loading2").show();
  $("#loading3").show();
  $.getJSON('/scrape1', function(data, status) {

    
      for(i=0; i<data.length;i++){
        

        if(data[i].src == 1){
          if(data[i].note){
            noteExists = '<br><span style="color: red"> Note Attached </span>'
          }else{
            noteExists = "";
          }
          $("#loading1").hide();
          $('#articles1').append('<div class="card teal lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="waves-effect waves-light btn" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form></div></div></div></div>');
          $('.in-form').hide();
        }
        if(data[i].src == 2){
          if(data[i].note){
            noteExists = '<br><span style="color: red"> Note Attached </span>'
          }else{
            noteExists = "";
          }
          $("#loading2").hide();
          $('#articles2').append('<div class="card blue-grey lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="waves-effect waves-light btn" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form></div></div></div></div>');
        }
        if(data[i].src == 3){
          if(data[i].note){
            noteExists = '<br><span style="color: red"> Note Attached </span>'
          }else{
            noteExists = "";
          }
          $("#loading3").hide();
          $('#articles3').append('<div class="card light-blue lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="waves-effect waves-light btn" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form></div></div></div></div>');
        }
      }
      
  });

 
//When the Add a Note button is clicked, the note input (or display) box is displayed
$(document).on('click', '.btn', function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);
  $(".in-form").show();

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
     // $('#'+thisId+'a').append('<input id="titleinput" name="title">');
      
      //$('#'+thisId+'a').append('<textarea id="bodyinput" name="body"></textarea>');
      
      //Logic for which button to display 
      console.log(data);

      if(data.note){
        console.log('in');
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
        $('#'+thisId+'a').append('<button data-id="' + data._id + '" id="deletenote" class="waves-effect waves-light btn">Delete Note</button>');
        
      }else{
        $('#'+thisId+'a').append('<button data-id="' + data._id + '" id="savenote" class="waves-effect waves-light btn">Save Note</button>');
        
      }
    });
});


//This saves the note into the mongoDB
$(document).on('click', '#savenote', function(){

  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "POST",
    url: "/savenote/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      $('.in-form').hide();
    });

    location.reload();
  $('#titleinput').val("");
  $('#bodyinput').val("");
  
});
//This deletes the note
$(document).on('click', '#deletenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId,
  })
    .done(function( data ) {
      
      $('.in-form').hide();
    });

  location.reload();
  $('#titleinput').val("");
  $('#bodyinput').val("");
  
});


