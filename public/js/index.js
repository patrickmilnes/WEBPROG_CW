const ws = new WebSocket("ws://" + window.location.hostname + ":8080/");

function fromServer(e) {
    console.log(JSON.parse(e.data));
}

ws.addEventListener('message', fromServer);