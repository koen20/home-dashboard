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
	  var insideTemp = httpGet("https://koenhabets.nl/api/temp?location=inside");
    var outsideTemp = httpGet("https://koenhabets.nl/api/temp?location=outside");
if(status != 200){
	$('#temp').text("Binnen: " + "Error: "+status);
	$('#outsideTemp').text("Buiten: " + "Error: "+status)
	$('#alert').fadeIn(1000);
	$('#alert').text("Kan niet met server verbinden");
}else{
    $('#alert').hide();
    $('#temp').text("Binnen: " + insideTemp);
    $('#outsideTemp').text("Buiten: " + outsideTemp);
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
});
$('#lamp1on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Aon");
});

$('#lamp2off').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Boff");
});
$('#lamp2on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Bon");
});

$('#lamp3off').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Coff");
});
$('#lamp3on').on('click', function() {
  httpPost("https://koenhabets.nl/api/lights?light=Con");
});

setInterval(function(){
	update();
}, 30*1000)

setInterval(function(){
  updateGraphData();
  updateGraphInside();
  updateGraphOutside();
}, 120*1000)
