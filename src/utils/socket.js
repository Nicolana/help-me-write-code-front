

class NSocket {
    constructor(url) {
        this.socket = null;
        this.socket_url = url;
        this.init();
    }

    init() {
        this.socket = new Websocket(this.socket_url);

        this.socket.onopen = this.handleOpen;
    }

    handleOpen(e) {
        console.log("连接成功");
    }
}

export default NSocket;
