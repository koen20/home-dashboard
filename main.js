var jsonArray;
var webSocket;
var wsUrl = "wss://koenhabets.nl/ws";
var server = "https://koenhabets.nl/api";
function main() {
    $('#alert').hide();
    updateGraphData();
    startWebSocket();
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

function httpPost(theUrl) {
    $.post(theUrl);
    return "";
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
    $.get(server + "/temp?location=graph", function(data, status){
        jsonArray = JSON.parse(data);
        updateGraphInside();
        updateGraphOutside();
    });
}
$('#lamp1off').on('click', function () {
    httpPost(server + "/lights?light=Aoff");
});
$('#lamp1on').on('click', function () {
    httpPost(server + "/lights?light=Aon");
});

$('#lamp2off').on('click', function () {
    httpPost(server + "/lights?light=Boff");
});
$('#lamp2on').on('click', function () {
    httpPost(server + "/lights?light=Bon");
});

$('#lamp3off').on('click', function () {
    httpPost(server + "/lights?light=Coff");
});
$('#lamp3on').on('click', function () {
    httpPost(server + "/lights?light=Con");
});
$('#wol').on('click', function () {
    httpPost(server + "/wol/wake");
});

setInterval(function () {
    updateGraphData();
}, 120 * 1000)

setInterval(function () {
    webSocket.send("ping");
}, 60 * 1000)

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
    webSocket.send("update");
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
