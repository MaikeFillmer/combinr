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
          $('#articles1').append('<div class="card teal lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'" target="_blank">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="btn waves-effect waves-teal" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form'+ data[i]._id +'"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form><div class="buttonCtr"></div></div></div></div></div>');
          $('form').hide();
        }
        if(data[i].src == 2){
          if(data[i].note){
            noteExists = '<br><span style="color: red"> Note Attached </span>'
          }else{
            noteExists = "";
          }
          $("#loading2").hide();
          $('#articles2').append('<div class="card blue-grey lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'" target="_blank">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="btn waves-effect waves-teal" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form'+ data[i]._id +'"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form><div class="buttonCtr"></div></div></div></div></div>');
          $('form').hide();
        }
        if(data[i].src == 3){
          if(data[i].note){
            noteExists = '<br><span style="color: red"> Note Attached </span>'
          }else{
            noteExists = "";
          }
          $("#loading3").hide();
          $('#articles3').append('<div class="card light-blue lighten-5 hoverable" data-id="' + data[i]._id +'"><div class="card-content black-text"><span class="card-title"><a href="'+data[i].link+'" target="_blank">' + data[i].title + noteExists+'</a></span>'+'<div class="card-action"><a class="btn waves-effect waves-teal" data-id="' + data[i]._id +'">Edit Note</a><div id="'+data[i]._id+'a" class="note"><form class="in-form'+ data[i]._id +'"><input id="titleinput" name="title"><textarea id="bodyinput" name="body"></textarea></form><div class="buttonCtr"></div></div></div></div></div>');
          $('form').hide();
        }
      }
      
  });

 
//When the Add a Note button is clicked, the note input (or display) box is displayed
$(document).on('click', '.btn', function(){
  //checks if the edit note is already open by checking if a save or delete button is present.
  if( $('.buttonCtr' ).find('button').length==0){
    
    console.log('hidden');
    var thisId = $(this).attr('data-id');
    console.log(thisId);
    $(".in-form" + thisId).show();

   $.ajax({
     method: "GET",
     url: "/articles/" + thisId,
   })
    .done(function( data ) {
      
      //Logic for which button to display 
      console.log(data);

      if(data.note){
        console.log('in');
        $('.in-form' + thisId).find('#titleinput').val(data.note.title);
        $('.in-form' + thisId).find('#bodyinput').val(data.note.body);
        $('#'+thisId+'a').find('.buttonCtr').append('<button data-id="' + data._id + '" id="deletenote" class="waves-effect waves-red btn">Delete Note</button>');
        
      }else{
        $('#'+thisId+'a').find('.buttonCtr').append('<br><button data-id="' + data._id + '" id="savenote" class="waves-effect waves-light btn">Save Note</button>');
        
      }

    });
} else {
  console.log('displayed');
    Materialize.toast('Please finish editing your note', 4000)
    /* alternate logic   */
}
  
  
});


//This saves the note into the mongoDB
$(document).on('click', '#savenote', function(){

  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "POST",
    url: "/savenote/" + thisId,
    data: {
      title: $('.in-form' + thisId).find('#titleinput').val(),
      body: $('.in-form' + thisId).find('#bodyinput').val()
    }
  })
    .done(function( data ) {
      $('.buttonCtr').hide();
      $('form').hide();     
      
    });

    location.reload();
      $('.in-form' + thisId).find('#titleinput').val('');
      $('.in-form' + thisId).find('#bodyinput').val('');
  
});
//This deletes the note
$(document).on('click', '#deletenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId,
  })
    .done(function( data ) {
      
      $('form').hide();
      $('.buttonCtr').hide();
    });

  location.reload();
  $('.in-form' + thisId).find('#titleinput').val('');
  $('.in-form' + thisId).find('#bodyinput').val('');
  
});


