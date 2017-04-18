var status;
var jsonArray;
var webSocket;
var wsUrl = "ws://koenhabets.nl/ws";
var server = "https://koenhabets.nl/api";
//var server = "http://127.0.0.1:9999";
function main() {
    $('#alert').hide();
    //update();
    updateGraphData();
    updateGraphInside();
    updateGraphOutside();
    startWebSocket();
}
function update() {
    var info = httpGet(server + "/info");
}

function parse(data) {
    var obj = JSON.parse(data);
        $('#alert').hide();
        $('#temp').text("Binnen: " + obj['inside-temp']);
        $('#outsideTemp').text("Buiten: " + obj['outside-temp']);
        $('#lamp1').text("Lamp 1: " + obj['light-A']);
        $('#lamp2').text("Lamp 2: " + obj['light-B']);
        $('#lamp3').text("Lamp 3: " + obj['light-C']);
        if (obj['pcOn']) {
            $('#status').text("Computer aan");
        } else {
            $('#status').text("Computer uit");
    }
}

$(document).ready(main);
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    status = xmlHttp.status;
    return xmlHttp.responseText;
}
function httpPost(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    status = xmlHttp.status;
    return xmlHttp.responseText;
}

function updateGraphInside() {
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

function updateGraphOutside() {
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

function updateGraphData() {
    var theUrl = server + "/temp?location=graph";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    var timeda = xmlHttp.responseText;
    jsonArray = JSON.parse(timeda);
}
$('#lamp1off').on('click', function () {
    httpPost(server + "/lights?light=Aoff");
    //update();
});
$('#lamp1on').on('click', function () {
    httpPost(server + "/lights?light=Aon");
    //update();
});

$('#lamp2off').on('click', function () {
    httpPost(server + "/lights?light=Boff");
    //update();
});
$('#lamp2on').on('click', function () {
    httpPost(server + "/lights?light=Bon");
    //update();
});

$('#lamp3off').on('click', function () {
    httpPost(server + "/lights?light=Coff");
    //update();
});
$('#lamp3on').on('click', function () {
    httpPost(server + "/lights?light=Con");
    //update();
});
$('#wol').on('click', function () {
    httpPost(server + "/wol/wake");
    //update();
});

//setInterval(function () {
    //update();
//}, 20 * 1000)

setInterval(function () {
    updateGraphData();
    updateGraphInside();
    updateGraphOutside();
}, 120 * 1000)

function startWebSocket() {
    webSocket = new ReconnectingWebSocket(wsUrl);
    webSocket.onopen = function (evt) {
        onOpen(evt)
    };
    webSocket.onclose = function (evt) {
        onClose(evt)
    };
    webSocket.onmessage = function (evt) {
        onMessage(evt)
    };
    webSocket.onerror = function (evt) {
        onError(evt);
    };
}

function onOpen(event) {
    console.log("Web socket connected");
    $('.sjtek-alert-error').css('display', 'none');
}

function onClose(event) {
    console.log("Web socket closed");
}

function onMessage(event) {
    console.log(event.data);
    parse(event.data);
}

function onError(event) {
    console.log("Web socket error: " + event);
}
