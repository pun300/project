$(document).ready(function() {
  $(window).keydown(function (e) {
    if (e.keyCode == 116) {
      if (!confirm("確定清除資料 ?")) {
        e.preventDefault();
      }
    }
  });
  var socket = io.connect();
  var from = $.cookie('user');//從 cookie 中讀取User name
  var to = 'all';//默認傳送為all"
  //send the user's status
  socket.emit('online', {user: from});
  socket.on('online', function (data) {
    //顯示系統資訊
    if (data.user != from) {
      var sys = '<div style="color:#f00">系統(' + now() + '):' + '用戶 ' + data.user + ' 上線！</div>';
    } else {
      var sys = '<div style="color:#f00">系統(' + now() + '):你進入了聊天室！</div>';
    }
    $("#contents").append(sys + "<br/>");
  
    flushUsers(data.users);
    
    showSayTo();
  });

  socket.on('say', function (data) {
    //對所有人說
    if (data.to == 'all') {
      $("#contents").append('<div>' + data.from + '(' + now() + ')對 所有人 說：<br/>' + data.msg + '</div><br />');
    }
    //有人密你
    if (data.to == from) {
      $("#contents").append('<div style="color:#00f" >' + data.from + '(' + now() + ')對 你 說：<br/>' + data.msg + '</div><br />');
    }
  });

  socket.on('offline', function (data) {
    //顯示系統資訊
    var sys = '<div style="color:#f00">系統(' + now() + '):' + '用戶 ' + data.user + ' 下線了 !</div>';
    $("#contents").append(sys + "<br/>");
 
    flushUsers(data.users);
    //如果跟某人聊天，他卻下線，改設定為All
    if (data.user == to) {
      to = "all";
    }
    
    showSayTo();
  });

  //伺服器關閉
  socket.on('disconnect', function() {
    var sys = '<div style="color:#f00">系統:連結伺服器失敗！</div>';
    $("#contents").append(sys + "<br/>");
    $("#list").empty();
  });

  //重啟伺服器
  socket.on('reconnect', function() {
    var sys = '<div style="color:#f00">系統:重新連結伺服器！</div>';
    $("#contents").append(sys + "<br/>");
    socket.emit('online', {user: from});
  });

  //更新線上用戶
  function flushUsers(users) {
    //清空之前用戶列表，添加"所有人"為灰色效果
    $("#list").empty().append('<li title="點兩下聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
    //產生用戶列表
    for (var i in users) {
      $("#list").append('<li alt="' + users[i] + '" title="點兩下聊天" onselectstart="return false">' + users[i] + '</li>');
    }
    //點兩下對某人聊天
    $("#list > li").dblclick(function() {
      //不是點自己名字
      if ($(this).attr('alt') != from) {
        //把點的用戶設定為聊天狀態
        to = $(this).attr('alt');
        //清除之前選中效果
        $("#list > li").removeClass('sayingto');
        //將現在點的對象增加效果
        $(this).addClass('sayingto');
        
        showSayTo();
      }
    });
  }

  //顯示對誰說話
  function showSayTo() {
    $("#from").html(from);
    $("#to").html(to == "all" ? "所有人" : to);
  }

  //得到現在時間
  function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }

  //說話
  $("#say").click(function() {
    //得到訊息
    var $msg = $("#input_content").html();
    if ($msg == "") return;
    //把訊息添加到borswer的 DOM 中
    if (to == "all") {
      $("#contents").append('<div>你(' + now() + ')對 所有人 說：<br/>' + $msg + '</div><br />');
    } else {
      $("#contents").append('<div style="color:#00f" >你(' + now() + ')對 ' + to + ' 說：<br/>' + $msg + '</div><br />');
    }
    //發送訊息對話
    socket.emit('say', {from: from, to: to, msg: $msg});
    //清出輸入框
    $("#input_content").html("").focus();
  });
});
