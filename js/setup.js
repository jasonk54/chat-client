if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

var encodeHTML = function(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

var Chat = {};
var userNames = {};
Chat.chatRoom = false;

Chat.displaySecondaryChat = function(chatRoomName){
  if(Chat.chatRoomName === false){
    return;
  }
  var room = 'https://api.parse.com/1/classes/' + Chat.chatRoomName;
  $.ajax(room, {
    contentType: 'application/json',
    success: function(data){
      $('.chatRoom').html('');
      for (var i = 0, l = data.results.length; i < l; i++) {
        var name = data.results[i].username;
        if( !name ){
          name = 'anonymous';
        }
        if( name && data.results[i].text){
          name = name.split(' ').join('_');
          $('.chatRoom').append('<div class="name '
           + name + (userNames[name] === true ? ' bold' : '')
           + '" data-username="' + name + '">' + name + ': '
           + encodeHTML(data.results[i].text)
           + '</div>');
          if(!userNames[name]) {
            userNames[name] = false;
          }
        }
      }
    }
  });
};
//Get Message from Parse server - Main room
Chat.displayMsg = function(){
  $.ajax('https://api.parse.com/1/classes/messages', {
    contentType: 'application/json',
    success: function(data){
      $('#main').html('');
      for (var i = 0, l = data.results.length; i < l; i++) {
        var name = data.results[i].username;
        if( !name ){
          name = 'anonymous';
        }
        if( name && data.results[i].text){
          name = name.split(' ').join('_');
          $('#main').append('<div class="name '
           + name + (userNames[name] === true ? ' bold' : '')
           + '" data-username="' + name + '">' + name + ': '
           + encodeHTML(data.results[i].text)
           + '</div>');
          if(!userNames[name]) {
            userNames[name] = false;
          }
        }
      }
    }
  });
};

// var user = data.results[i].username
Chat.sendMsg = function(name, message, room, hax){
  var messageObject = {
    'username': name,
    'text': message
  }
  if (room) {
    messageObject.roomname = room;
  };
  $.ajax ({
    url: "https://api.parse.com/1/classes/messages",
    type: "POST",
    contentType: 'application/json',
    // dataType: "JSON",
    data: JSON.stringify(messageObject),
    success: function() {
    }
  });
};

$(document).ready(function(){
  Chat.displayMsg();
  setInterval(function(){
    Chat.displayMsg();
    Chat.displaySecondaryChat(Chat.chatRoom);
  }, 10000);
  $('.info').submit(function(e){
    e.preventDefault();
    var name = $('.nameText').val();
    var message = $('.message').val();
    var roomname = $('.chatRoomName').val();

    if (roomname) {
      Chat.chatRoom = roomname;
    }
    Chat.sendMsg(name, message, roomname);
    Chat.displaySecondaryChat(roomname);
    Chat.displayMsg();
  });
  $('.name').css('color:blue');
  $('#main').on('click','.name',function(){
    var className = $(this).data('username');
    userNames[className] = true;
    console.log(className, userNames);
    $('.' + className.toString()).addClass('bold');
  });
});
