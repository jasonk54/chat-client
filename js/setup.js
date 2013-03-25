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
var globalRoom = 'https://api.parse.com/1/classes/messages';

var ajaxDisplayRoom = function(address, className) {
  $.ajax(address, {
    contentType: 'application/json',
    success: function(data){
      $(className).html('');
      for (var i = 0, l = data.results.length; i < l; i++) {
        var name = data.results[i].username;
        if( !name ){
          name = 'anonymous';
        }
        if( name && data.results[i].text){
          name = name.split(' ').join('_');
          $(className).append('<div class="name ' +
           name + (userNames[name] === true ? ' bold' : '') +
           '" data-username="' + name + '">' + name + ': ' +
           encodeHTML(data.results[i].text) +
           '</div>');
          if(!userNames[name]) {
            userNames[name] = false;
          }
        }
      }
    }
  });
};
Chat.displaySecondaryChat = function(){
  if(Chat.chatRoom === false){
    return;
  }
  ajaxDisplayRoom('https://api.parse.com/1/classes/' + Chat.chatRoom, '.chatRoom');
};


// var user = data.results[i].username
Chat.sendMsg = function(name, message, room, hax){
  var tempUrl = globalRoom;
  var messageObject = {
    'username': name,
    'text': message
  };
  if(room) {
    messageObject.roomname = room;
    tempUrl = "https://api.parse.com/1/classes/" + room;
  }
  $.ajax ({
    url: tempUrl,
    type: "POST",
    contentType: 'application/json',
    // dataType: "JSON",
    data: JSON.stringify(messageObject),
    success: function() {
    }
  });
};

$(document).ready(function(){
  ajaxDisplayRoom(globalRoom, '#main');
  setInterval(function(){
    ajaxDisplayRoom(globalRoom, '#main');
    Chat.displaySecondaryChat();
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
    Chat.displaySecondaryChat();
    ajaxDisplayRoom(globalRoom, '#main');
  });
  $('.name').css('color:blue');
  $('#main').on('click','.name',function(){
    var className = $(this).data('username');
    userNames[className] = true;
    $('.' + className.toString()).addClass('bold');
  });
});
