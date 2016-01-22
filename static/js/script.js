$(document).ready(function (){
  document.session = $('#session').val();

  setTimeout(requestMessage, 100);

  $(document).keypress(function(e) {
      if(e.which == 13) {
          text = $('#message-text').val();
          if(text != ''){
            $.ajax({
              url: '/message',
              type: 'POST',
              data: {
                session: document.session,
                text: text
              },
              success: function(data, status, xhr){
                console.log('sent');
              }
            });
          }
      }
  });

});

function requestMessage(){
  console.log('request update!');
	$.getJSON('/message/update', {session: document.session},
		function(data, status, xhr) {
      console.log(data['message']);
      date = new Date();
      nice_date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      formatted = '<div class="message">' + '<span class="date">' + nice_date + '</span> ' + data['text'] + '</div>';
      $('#messages').append(formatted);
			setTimeout(requestMessage, 0);
		}
	);
}
