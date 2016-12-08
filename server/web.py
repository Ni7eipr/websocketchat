# !/usr/bin/env python
# coding: utf-8

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from optparse import OptionParser
import json

clients = {}
f = open("log.chat", "a")

class SimpleChat(WebSocket):

    def sentMsg(self, client, data):
        msg = data + "\r\n"
        for x in clients.values():
            msg += x + "\n"
        client.sendMessage(msg)
        f.write(msg.encode("utf-8"))

    def handleMessage(self):
        data = json.loads(self.data)
        if data.has_key("name"):
            clients[self] = data["name"]
            for client in clients:
                self.sentMsg(client, "system: " + clients[self] + ' - connected')
        elif data.has_key("msg"):
            for client in clients:
                if client != self:
                    self.sentMsg(client, clients[self] + ": " + data["msg"])

    def handleConnected(self):
        print (self.address, 'connected')
        clients[self] = ""

    def handleClose(self):
        print (self.address, 'closed')
        clients[self] = ""
        for client in clients:
            if client != self:
                self.sentMsg(client, "system: " + clients[self] + ' - disconnected')
        del clients[self]

if __name__ == "__main__":
    parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
    parser.add_option("--host", default='', type='string', action="store", dest="host", help="hostname (localhost)")
    parser.add_option("--port", default=8000, type='int', action="store", dest="port", help="port (8000)")
    (options, args) = parser.parse_args()
    try:
        server = SimpleWebSocketServer(options.host, options.port, SimpleChat)
        server.serveforever()
    except KeyboardInterrupt as e:
        print "bye!"