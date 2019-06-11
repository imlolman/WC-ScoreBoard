//https://corsbypass.000webhostapp.com?url=https://www.cricbuzz.com/match-api/livematches.json
window.oldmatchesLoaded = 0
data = {
  id: 20284
}
function loadFlags(data){
  try{
  if(data.team1.name == "England"){
    data.team1.name = "United Kingdom of Great Britain and Northern Ireland"
  }
  if(data.team2.name == "England"){
    data.team2.name = "United Kingdom of Great Britain and Northern Ireland"
  }
  fetch('https://restcountries.eu/rest/v2/name/'+data.team1.name).then(response => {
    response.json().then(function(countries) {
      try{
        countries.forEach(country => {
          if(country.name == data.team1.name){
            document.getElementsByClassName('flagL')[0].style.background = "url('"+country.flag+"')"
            document.getElementsByClassName('flagL')[0].style.backgroundSize = 'cover'
          }
        });
      }catch(err){}
    });
  })
  fetch('https://restcountries.eu/rest/v2/name/'+data.team2.name).then(response => {
    response.json().then(function(countries) {
      try{
        countries.forEach(country => {
          if(country.name == data.team2.name){
            document.getElementsByClassName('flagR')[0].style.background = "url('"+country.flag+"')"
            document.getElementsByClassName('flagR')[0].style.backgroundSize = 'cover'
          }
        });
      }catch(err){}
    });
  })
  }catch(err){}
}

function fetchData(){
    if(window.oldmatchesLoaded == 1){
        fetch('https://corsbypass.000webhostapp.com?url=https://www.cricbuzz.com/match-api/'+parseInt(window.location.href.slice(-6,-1)).toString()+'/commentary.json').then(response => {
        response.json().then(function(data) {
          console.log("Refreshed Score")
          window.data = data
          putData(data)
        });
      })
      setTimeout(fetchData,30000);
      return ''
    }
    fetch('https://corsbypass.000webhostapp.com?url=https://www.cricbuzz.com/match-api/'+parseInt(window.location.href.slice(-6,-1)).toString()+'/commentary.json').then(response => {
      response.json().then(function(data) {
        console.log(data)
        window.data = data
        putData(data)
        loadFlags(data)
        window.pmtext = 'Older Matches: '
        loadOldMatches(20236)
      });
    })
    fetch('https://corsbypass.000webhostapp.com?url=https://www.cricbuzz.com/match-api/livematches.json').then(response => {
      response.json().then(function(data) {
        console.log(data)
        amtext = 'Available Matches: '
        for(var key in data.matches){
          match = data.matches[key]
          if(match.type == "ODI"){
            amtext += '<a href="'+window.location.origin+'?m='+match.id.toString()+'/"> '+match.team1.name+' vs '+match.team2.name+'</a>&emsp;&emsp;&emsp;';
          }
        }
        set('am',amtext)
      });
    })
}


function loadOldMatches(id){
  localid = id
    fetch('https://corsbypass.000webhostapp.com?url=https://www.cricbuzz.com/match-api/'+id+'/commentary.json').then(response => {
      response.json().then(function(match) {
        console.log(match)
        window.pmtext += '<a href="'+window.location.origin+'?m='+match.id.toString()+'/"> '+match.team1.name+' vs '+match.team2.name+'</a>&emsp;&emsp;&emsp;';
        set('pm', window.pmtext)
        if(localid < data.id){
          localid += 1
          console.log(localid)
          loadOldMatches(localid)
        }else{
           window.oldmatchesLoaded = 1
           fetchData()
        }
    })
  })
}


function runIt(){
  cleanup()
  fetchData()
}

function cleanup(){
  allIds = ["batter1", "batter2", "r1", "r2", "b1", "b2", "team1_name", "team2_name", "batting-score", "overs_completed", "notice", "bowler_name", "boller_score", "boller_overs", "overBox", "powerPlay"]
  allIds.forEach(id=>document.getElementById(id).innerHTML = "")
  document.getElementsByClassName('flagL')[0].style.background = "red"
  document.getElementsByClassName('flagR')[0].style.background = "yellow"
}


function putData(data){
    if('winning_team_id' in data){
      try{ set('team1_name',""); }catch(err){}
      try{ set('team2_name',data.team1.name + ' v ' + data.team2.name);
      document.getElementsByClassName('powerPlayBox')[0].style.width = document.getElementsByClassName('half-top')[0].clientWidth+'px'
      document.getElementsByClassName('teamScore')[0].style.width = document.getElementsByClassName('half-top')[0].clientWidth+'px'
      document.getElementsByClassName('powerPlayBox')[0].style.borderRadius = '0px'
      document.getElementsByClassName('teamScore')[0].style.borderRadius = '0px'
      document.getElementsByClassName('teamScore')[0].style.textAlign = "center"
      }catch(err){}
      try{ set('notice', data.status) }catch(err){}
      return
    }


    try{ set('batter1',getplayer(data.players,data.score.batsman[0].id).name.toUpperCase()); }catch(err){}
    try{ set('batter2',getplayer(data.players,data.score.batsman[1].id).name.toUpperCase()); }catch(err){}
    try{ set('r1',data.score.batsman[0].r); }catch(err){}
    try{ set('r2',data.score.batsman[1].r); }catch(err){}
    try{ set('b1',data.score.batsman[0].b); }catch(err){}
    try{ set('b2',data.score.batsman[1].b); }catch(err){}
    try{ if(data.score.batsman[0].strike == "1"){
      document.getElementById('str1').setAttribute('class', 'arrow-right active')
    }else{
      document.getElementById('str1').setAttribute('class', 'arrow-right')
    }
    if(data.score.batsman[1].strike == "1"){
      document.getElementById('str2').setAttribute('class', 'arrow-right active')
    }else{
      document.getElementById('str2').setAttribute('class', 'arrow-right')
    }  }catch(err){}
    try{ set('team1_name',data.team1.s_name+" v"); }catch(err){}
    try{ set('team2_name',data.team2.s_name); }catch(err){}
    try{ set('batting-score',data.score.batting.score.split(' ')[0].replace('/','-')) }catch(err){
      try{ set('team1_name',""); }catch(err){}
      try{ set('team2_name',data.team1.name + ' v ' + data.team2.name);
      document.getElementsByClassName('powerPlayBox')[0].style.width = document.getElementsByClassName('half-top')[0].clientWidth+'px'
      document.getElementsByClassName('teamScore')[0].style.width = document.getElementsByClassName('half-top')[0].clientWidth+'px'
      document.getElementsByClassName('powerPlayBox')[0].style.borderRadius = '0px'
      document.getElementsByClassName('teamScore')[0].style.borderRadius = '0px'
      document.getElementsByClassName('teamScore')[0].style.textAlign = "center"
      }catch(err){}
    }
    try{ set('overs_completed',data.score.batting.score.split('(')[1].replace(' Ovs)','')) }catch(err){}
    try{ set('notice','RUN RATE '+data.score.crr) }catch(err){
      if(data.status != undefined){
        if(data.status != ""){
          try{ set('notice', data.status) }catch(err){}
        }else{
          try{ set('notice', data.state_title) }catch(err){}
        }
      }
    }
    try{ set('bowler_name',getplayer(data.players,data.score.bowler[0].id).name.toUpperCase()); }catch(err){}
    try{ set('boller_score',data.score.bowler[0].w+'-'+data.score.bowler[0].r) }catch(err){}
    try{ set('boller_overs',data.score.bowler[0].o) }catch(err){}
    try{ 
    overBoxData = '';
    var prevovers = data.score.prev_overs;
    balls = prevovers.split('|')[prevovers.split('|').length - 1].trim().split(' ');
    balls.forEach(ball => {
      if(ball == '.'){
        overBoxData += '<div class="ball"><div class="dot"></div></div> '
      }else if(ball == '1'){
        overBoxData += '<div class="ball score">1</div> '
      }else if(ball == '2'){
        overBoxData += '<div class="ball score">2</div> '
      }else if(ball == '3'){
        overBoxData += '<div class="ball score">3</div> '
      }else if(ball == '4'){
        overBoxData += '<div class="ball score">4</div> '
      }else if(ball == '5'){
        overBoxData += '<div class="ball score">5</div> '
      }else if(ball == '6'){
        overBoxData += '<div class="ball score">6</div> '
      }else if(ball == '7'){
        overBoxData += '<div class="ball score">7</div> '
      }else if(ball == '8'){
        overBoxData += '<div class="ball score">9</div> '
      }else{
        overBoxData += '<div class="ball mark">'+ball+'</div> '
      }
    })
    }catch(err){}
    try{ set('overBox', overBoxData) }catch(err){}
}

function getplayer(players,id){
  pla = undefined
  players.forEach(player => {
    if(player.id == id){
      pla = player
    }
  });
  return pla
}

function set(id,val){
  document.getElementById(id).innerHTML = val;
}

runIt()