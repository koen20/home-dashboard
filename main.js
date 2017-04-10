var status;
var jsonArray;
function main(){
	$('#alert').hide();
	update();
  updateGraphData();
  updateGraphInside();
  updateGraphOutside();
}
function update(){
	  var info = httpGet("https://koenhabets.nl/api/info");
	  var obj = JSON.parse(info);
if(status != 200){
	$('#temp').text("Binnen: " + "Error: "+status);
	$('#outsideTemp').text("Buiten: " + "Error: "+status)
	$('#alert').fadeIn(1000);
	$('#alert').text("Kan niet met server verbinden.");
    $('#lamp1').text("Lamp 1");
    $('#lamp2').text("Lamp 2");
    $('#lamp3').text("Lamp 3");
}else{
    $('#alert').hide();
    $('#temp').text("Binnen: " + obj['inside-temp']);
    $('#outsideTemp').text("Buiten: " + obj['outside-temp']);
    $('#lamp1').text("Lamp 1: " + obj['light-A']);
    $('#lamp2').text("Lamp 2: " + obj['light-B']);
    $('#lamp3').text("Lamp 3: " + obj['light-C']);
}
}
$(document).ready(main);
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
	status = xmlHttp.status;
    return xmlHttp.responseText;
}
function httpPost(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
        status = xmlHttp.status;
    return xmlHttp.responseText;
}

function updateGraphInside(){
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: jsonArray[0],
    datasets: [{
      label: 'Temperatuur binnen',
      data: jsonArray[1],
      backgroundColor: "rgba(153,255,51,0.4)"
    }]
  }
});
}

function updateGraphOutside(){
  var ctx = document.getElementById('myChart2').getContext('2d');
  var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: jsonArray[0],
    datasets: [{
      label: 'Temperatuur buiten',
      data: jsonArray[2],
      backgroundColor: "rgba(255,153,0,0.4)"
    }]
  }
});
}

function updateGraphData(){
  var theUrl = "https://koenhabets.nl/api/temp?location=graph";
  var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var timeda = xmlHttp.responseText;
    jsonArray = JSON.parse(timeda);
}
$('#lamp1off').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Aoff");
  update();
});
$('#lamp1on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Aon");
    update();
});

$('#lamp2off').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Boff");
    update();
});
$('#lamp2on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Bon");
    update();
});

$('#lamp3off').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Coff");
    update();
});
$('#lamp3on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Con");
    update();
});

setInterval(function(){
	update();
}, 20*1000)

setInterval(function(){
  updateGraphData();
  updateGraphInside();
  updateGraphOutside();
}, 120*1000)
