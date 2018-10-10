var jsonArray;
var webSocket;
var wsUrl = "wss://koenhabets.nl/ws";
var server = "https://koenhabets.nl/api";
var miliadd = 0;

function main() {
    $('#alert').hide();
    getPowerData();
    startWebSocket();
    updateRecentPower();
}

function parse(data) {
    var obj = JSON.parse(data);
    $('#alert').hide();
    $('#temp').text("Binnen: " + obj['inside-temp']);
    $('#outsideTemp').text("Buiten: " + obj['outside-temp']);
    $('#lamp1').text("Lamp 1: " + obj['light-A']);
    $('#lamp2').text("Lamp 2: " + obj['light-B']);
    $('#lamp3').text("Lamp 3: " + obj['light-C']);
    $('#currentEnergyUsage').text("Energie verbruik: " + obj['currentEnergyUsage']);
    $('#currentEnergyProduction').text("Energie productie: " + obj['currentEnergyProduction']);

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

function getPowerData() {
    var jsonArrayGasData = [];
    var jsonArrayPowerData = [];
    var jsonArrayPowerTime = [];
    var time = new Date();
    time.setHours(0);
    time.setMinutes(0);
    var millisecondsStart = Math.round(time.getTime() / 1000) + miliadd;
    var millisecondsEnd = Math.round(time.getTime() / 1000 + 86520000) + miliadd;
    $.get(server + "/energy?interval=hourly&startTime=" + millisecondsStart + "&endTime=" + millisecondsEnd, function (data, status) {
        var jsonArrayPower = JSON.parse(data);
        var i;
        var total;
        var gasTotal;
        for (i = 0; i < jsonArrayPower.length; i++) {
            if (i != 0) {
                var item = jsonArrayPower[i];
                var usage1 = item.energyUsage1 + item.energyUsage2;
                var production1 = item.energyProduction1 + item.energyProduction2;
                var total1 = usage1 - production1;
                var gasUsage1 = item.gasUsage;

                var item2 = jsonArrayPower[i - 1];
                var usage2 = item2.energyUsage1 + item2.energyUsage2;
                var production2 = item2.energyProduction1 + item2.energyProduction2;
                var total2 = usage2 - production2;
                var gasUsage2 = item2.gasUsage;

                total = total1 - total2;
                gasTotal = gasUsage1 - gasUsage2;
                jsonArrayPowerData.push(total);
                jsonArrayGasData.push(gasTotal);
                jsonArrayPowerTime.push(i);
            }
        }
        var ctx = document.getElementById('powerUsageToday').getContext('2d');
        var myChartEnergy = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: jsonArrayPowerTime,
                datasets: [{
                    label: 'Stroom gebruik vandaag',
                    data: jsonArrayPowerData,
                    backgroundColor: "rgb(6,122,56)"
                }]
            }
        });
        var ctx2 = document.getElementById('gasUsageToday').getContext('2d');
        var myChartGas = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: jsonArrayPowerTime,
                datasets: [{
                    label: 'Gas gebruik vandaag',
                    data: jsonArrayGasData,
                    backgroundColor: "rgb(6,122,56)"
                }]
            }
        });
    });
}

function updateRecentPower(){
    $.get(server + "/energy?interval=recent", function (data, status) {
        var jsonArrayPower = JSON.parse(data);
        var jsonArrayRecent = [];
        var jsonArrayRecentTime = [];
        for (i = 0; i < jsonArrayPower.length; i++) {
            var item = jsonArrayPower[i];
            jsonArrayRecent.push(item.energyUsage - item.energyProduction);
            jsonArrayRecentTime.push(i * 5);
        }
        var chartRecent = document.getElementById('powerUsageRecent').getContext('2d');
        var myChartRecent = new Chart(chartRecent, {
            type: 'line',
            data: {
                labels: jsonArrayRecentTime,
                datasets: [{
                    label: 'Recent power usage',
                    data: jsonArrayRecent,
                    backgroundColor: "rgb(6,122,56)"
                }]
            }
        });
    });
}

$('#vorige').on('click', function () {
    miliadd = miliadd - 86400000 / 1000;
    getPowerData();
});
$('#volgende').on('click', function () {
    miliadd = miliadd + 86400000 / 1000;
    getPowerData();
});

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
    getPowerData();
}, 120 * 1000);

setInterval(function () {
    updateRecentPower();
}, 5 * 1000);

setInterval(function () {
    webSocket.send("ping");
}, 60 * 1000);

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
