$(document).ready(function (){
  document.session = $('#session').val();
  msgInput = $('#message-text');

  setTimeout(requestMessage, 100);

  $(document).keypress(function(e) {
      if(e.which == 13) {
          text = msgInput.val();
          if(text != ''){
            $.ajax({
              url: '/message',
              type: 'POST',
              data: {
                session: document.session,
                text: text
              },
              beforeSend: function (){
                msgInput.val('');
              }
            });
          }
      }
  });

});

function requestMessage(){
  var msgsBox = $('#messages-box');

	$.getJSON('/message/update', {session: document.session},
		function(data, status, xhr) {
      date = getCurrentTime();
      formatted = '<div class="msg-wrapper">' +
                    '<div class="msg-user-box">' +
                      '<div class="msg-user-icon"></div>' +
                    '</div>' +
                    '<div class="msg">' + date + '<br>' + data['text'] + '</div>' +
                  '</div>';

      msgsBox.append(formatted);
      msgsBoxHeight = msgsBox.prop('scrollHeight');
      msgsBox.scrollTop(msgsBoxHeight);

			setTimeout(requestMessage, 0);
		}
	);
}

function getCurrentTime(){
  date = new Date();
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  hours = addZero(hours);
  minutes = addZero(minutes);
  seconds = addZero(seconds);
  return hours + ':' + minutes + ':' + seconds;
}

function addZero(time_part){
  if (time_part < 10){
    return '0' + time_part;
  }
  return time_part;
}
