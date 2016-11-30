var websocket = window.WebSocket || window.MozWebSocket;
var wsurl = document.getElementById("wsurl");
var output = document.getElementById("output");
var connect = document.getElementById("connect");
var disconnect = document.getElementById("disconnect");
var send = document.getElementById("send");
var input = document.getElementById("input");
var username = document.getElementById("username");
var clear = document.getElementById("clear");
var userlist = document.getElementById("userlist");

username.value = returnCitySN["cip"]+','+returnCitySN["cname"];
wsurl.value = "ws://localhost:8000";
input.value = "Hello Everybody!";

statusDown();

function statusOn() {
    output.disabled = true;
    disconnect.disabled = false;
    send.disabled = false;
    connect.disabled = true;
    input.disabled = false;
    clear.disabled = false;
}

function statusDown() {
    output.disabled = true;
    input.disabled = true;
    disconnect.disabled = true;
    send.disabled = true;
    clear.disabled = true;
    connect.disabled = false;
}

function doConnect()
{
    ws = new websocket(wsurl.value);
    ws.onopen = function() {
        statusOn();
        var msg = {"name": username.value};
        ws.send(JSON.stringify(msg));
    }
    ws.onclose = function(evt) {
        statusDown();
        writeToScreen("disconnected");
    };
    ws.onmessage = function(evt) {
        var data = evt.data.split("\r\n");
        writeToScreen(data[0]);
        userlist.innerText = data[1];
    };
    ws.onerror = function(evt) {
        statusDown();
        writeToScreen('ERROR');
        ws.close();
    };
}

function doSend()
{
    if (input.value) {
        var msg = {"msg": input.value};
        ws.send(JSON.stringify(msg));
        writeToScreen(input.value);
        input.value = "";
    }
}

function writeToScreen(message)
{
    output.value += message + '\n\n';
    output.scrollTop = output.scrollHeight;
}

function doClear() {
    output.value = "";
}

function doDisconnect() {
    ws.close();
    statusDown();
}