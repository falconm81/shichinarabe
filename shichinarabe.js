$(document).ready(function(){

  var handcard;
  var fin;
  var turnPlayer;
  var putoutCard = [5, 18, 31, 44, 7, 20, 33, 46];


  <!-- 開始ボタン押し -->
  $("#start").on("click", function(){

    <!-- 初期化 -->
    handcard = new Array();
    fin = new Array();
    for(var i=0; i<4; i++) {
      handcard[i] = new Array();
      fin[i] = 0;
      nodisplayRank(i);
    }

    <!-- 山札 -->
    var deck = [];

    <!-- 山札にカードをセット -->
    for(var i=0; i<52; i++) {
      deck[i] = i;
    }

    <!-- 山札シャッフル -->
    shuffle(deck,150);

    <!-- 最初のプレイヤーをランダムで決める -->
    turnPlayer = Math.floor( Math.random() * 4);

    <!-- 手札にカードを分ける -->
    idx = turnPlayer;
    for(var i=0; i<52; i++){
      handcard[idx].push(deck[i]);
      idx++;
      if(idx==4)idx=0;
    }

    <!-- 7 のカードを場に出す -->
    for(var i=0; i<4; i++){
      cardChk7(i);
    }
    for(var i=0; i<4; i++){
      displayCardNum(i*13+6);
    }

    <!-- プレイヤーのカードを表示する -->
    dispPlayerAllCard();

    <!-- コンピューターのカードを表示する -->
    for(var i=1; i<4; i++){
      dispComputerAllCard(i)
    }
    decideNextPlayer();
    exeNextPlayer();
  });

  <!-- 次のプレイヤーを決定する -->
  function decideNextPlayer(){
    for( var i=0; i<10; i++ ){
      turnPlayer++;
      if( turnPlayer == 4 ){
        turnPlayer=0;

        <!-- プレイヤーが場に出せるカードがなかったら自動的にパス -->
        for( var i=0; i < handcard[turnPlayer].length; i++ ){
          for(var j=0; j<8; j++){
            if( handcard[0][i] == putoutCard[j] ){
              return;
            }
          }
        }
        continue;
      }else{
        if( fin[turnPlayer] == 0 ){
          break;
        }
      }
    }
  }

  <!-- 次のプレイヤーの処理をする -->
  function exeNextPlayer(){
    if (turnPlayer == 0){
      displayMessage("プレイヤーの番です。場に出すカードをクリックしてください。");
    }else{
      displayMessage("コンピューター"+ (turnPlayer) +"カードを場に出します。");
      setTimeout(function(){setCardComputer();}, 1000);
    }
  }

  <!-- コンピューターがカードを場に出す -->
　function setCardComputer(){
    for( var i=0; i < handcard[turnPlayer].length; i++ ){
      if( checkPutOutCard(i,turnPlayer) == 1 ){
        <!-- 場に出せるカード -->
        displayCardNum(handcard[turnPlayer][i]);
        handcard[turnPlayer][i] = -1;
        cardSride(turnPlayer);
        dispComputerAllCard(turnPlayer);

        <!-- カードがなくなった -->
        if( setRank(turnPlayer) == 1 ){
          return;
        }
        break;
      }
    }
    decideNextPlayer();
    exeNextPlayer();
  }


  <!-- カードをクリックしたときの処理 -->
  function clickCard( x, y ){
    if( turnPlayer != 0 ){return;}
    if( y != 0 ){return;}
    if( checkPutOutCard( x, y ) == 1 ){
      displayCardNum(handcard[0][x]);
      handcard[0][x] = -1;
      cardSride(0);
      dispPlayerAllCard();
    }else{
      return;
    }

    <!-- カードがなくなった -->
    if( setRank(0) == 1 ){
      return;
    }

    decideNextPlayer();
    exeNextPlayer();

  }

  <!-- カードをシャッフルする -->
  function shuffle( cards, num ){
    var n = cards.length;
    for(var i=0; i<num; i++) {
      var tmp;
      var rand1 = Math.floor( Math.random() * n);
      var rand2 = Math.floor( Math.random() * n);

      tmp = cards[rand1];
      cards[rand1] = cards[rand2];
      cards[rand2] = tmp
    }
  }

  <!-- 数字の7 を検索し、7 を捨てる -->
  function cardChk7(idx){
    var arr = handcard[idx];
    var num = arr.length;
    for( var i=0; i<num; i++ ){
      if( arr[i] % 13 == 6){
        <!-- 数値が7 の場合 -->
        arr[i] = -1;
      }
    }
    cardSride(idx);
  }

  <!-- 手札を配列の左に詰める -->
  function cardSride(idx){
    var tmpArr = new Array();
    var arr = handcard[idx];
    var num = arr.length;
    var tmpIdx = 0;
    for( var i=0; i<num; i++){
      if( arr[i] != -1){
        tmpArr[tmpIdx] = arr[i];
        tmpIdx++;
      }
    }
    handcard[idx] = tmpArr;
  }

  <!-- カードが場に出せるか確認する -->
  <!-- 0:出せない 1:出せる -->
  function checkPutOutCard(x, y){
    for(var i=0; i<8; i++){
      if( handcard[y][x] == putoutCard[i] ){
        if( i < 4 ){
          putoutCard[i]--;
          if( putoutCard[i] % 13 == 12){
            putoutCard[i] = -1;
          }
        }else{
          putoutCard[i]++;
          if( putoutCard[i] % 13 == 0){
            putoutCard[i] = -1;
          }
        }
        return 1;
      }
    }
    return 0;
  }

  <!-- プレイヤーの全カードを表示する -->
  function dispPlayerAllCard(){

    <!-- 手札を表示する -->
    for( var i=0; i < handcard[0].length; i++){
      if (handcard[0][i]!=52){
        display(i,0,handcard[0][i]);
      } else{
        displayJoker(i,0);
      }
    }

    <!-- 手札でないものは非表示する -->
    for( var j=i; j<13; j++){
      nodisplay(j,0);
    }
  }

  <!-- コンピューターの全カードを表示する -->
  function dispComputerAllCard(idx){

    <!-- 手札を裏で表示する -->
    for( var i=0; i < handcard[idx].length; i++){
      displayBack(i,idx);
    }

    <!-- 手札でないものは非表示する -->
    for( var j=i; j<13; j++){
      nodisplay(j,idx);
    }
  }

  <!-- ランキングを設定 -->
  <!-- 戻り値 0:ゲームを続ける 1:ゲームを終了する -->
  function setRank(idx){
    if( handcard[idx].length == 0 ){
      var rank = 1;
      for( var i=0; i<4; i++ ){
        if( fin[i] == 1 ){
          rank++;
        }
      }
      fin[idx] = 1;

      <!-- プレイヤーの勝利 -->
      if( idx == 0 ){
        alert(rank + "位です！");
        displayRank( idx, rank );
        return 1;
      }else{
        if( rank == 3 ){
          <!-- コンピューター全員終了、プレイヤー負け -->
          alert("4位です！");
          displayRank( idx, rank );
          displayRank( 0, 4 );
          return 1;
        }else{
          <!-- コンピューターまだ残っている -->
          displayRank( idx, rank );
          return 0;
        }
      }
    }
    return 0;
  }

  <!-- 指定番号のカードを表示する -->
  function displayCardNum(x){
    var posStr = '#cardnum' + x;
    $(posStr).css("visibility","visible");
  }

  <!-- 指定位置のカードを非表示にする -->
  function nodisplay(x, y){
    var posStr = '#card' + y + x;
    $(posStr).css("visibility","hidden");
  }

  <!-- 指定位置のカードを指定番号で表示する -->
  function display(x, y, num){
    var posStr = '#card' + y + x;
    var left;
    var top;
    var rect;

    if (num%13 <= 6){
      left = 200 + x*50 - Math.floor(num/13)*50;
      top = 450 + y*100 - num%13*75;
      rect = 'rect(' + ((num%13)*75) + 'px ' + (((Math.floor(num/13)+1)*50)+1) + 'px ' + ((num%13+1)*75+1) + 'px ' + (Math.floor(num/13)*50) + 'px)';
    }else{
      left = 200 + x*50 - Math.floor(num/13)*50 - 200;
      top = 450 + y*100 - (num%13-7)*75;
      rect = 'rect(' + ((num%13-7)*75) + 'px ' + ((Math.floor(num/13)+1)*50+200) + 'px ' + ((num%13-6)*75+1) + 'px ' + (Math.floor(num/13)*50+200) + 'px)';
    }
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("clip", rect);
    $(posStr).css("visibility","visible");
  }

  <!-- 指定位置にジョーカーを表示する -->
  function displayJoker( x, y ){
    var posStr = '#card' + y + x;
    var left = x*50;
    var top = y*100;
    var rect = 'rect( 450px 251px 526px 200px)';
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("clip", rect);
    $(posStr).css("visibility","visible");
  }

  <!-- 指定位置に裏を表示する -->
  function displayBack( x, y ){
    var posStr = '#card' + y + x;
    var left = x*50 - 100;
    var top = y*100;
    var rect = 'rect( 450px 351px 526px 300px)';
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("clip", rect);
    $(posStr).css("visibility","visible");
  }

  <!-- メッセージを表示する -->
  function displayMessage(str){
    $("#message").text(str);
  }

  <!-- 順位を表示する -->
  function displayRank( y, rank){
    $("#rank"+y).text(rank+"位");
  }

  <!-- 順位を非表示にする -->
  function nodisplayRank( y ){
    $("#rank"+y).text("");
  }

  <!-- 開始ボタン無効化 -->
  function disabledStart(){
    $("#start").prop("disabled", true);
  }

  <!-- 開始ボタン有効化 -->
  function enabledStart(){
    $("#start").prop("disabled", false);
  }


  <!-- クリック -->
  $("#card00").click(function(){clickCard(0,0)});
  $("#card01").click(function(){clickCard(1,0)});
  $("#card02").click(function(){clickCard(2,0)});
  $("#card03").click(function(){clickCard(3,0)});
  $("#card04").click(function(){clickCard(4,0)});
  $("#card05").click(function(){clickCard(5,0)});
  $("#card06").click(function(){clickCard(6,0)});
  $("#card07").click(function(){clickCard(7,0)});
  $("#card08").click(function(){clickCard(8,0)});
  $("#card09").click(function(){clickCard(9,0)});
  $("#card010").click(function(){clickCard(10,0)});
  $("#card011").click(function(){clickCard(11,0)});
  $("#card012").click(function(){clickCard(12,0)});
  $("#card013").click(function(){clickCard(13,0)});
});
