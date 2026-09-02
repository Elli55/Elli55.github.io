import http.server
import socketserver
import os

PORT = 8000

class NoBSHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        
        if os.path.isfile(path):
            return super().do_GET()
        
        if os.path.isdir(path):
            return super().do_GET()
        
        if os.path.isfile(path + ".html"):
            self.path = self.path.rstrip("/") + ".html"
            return super().do_GET()
        
        return super().do_GET()

    def log_message(self, format, *args):
        print(f"{self.address_string()} → {args[0]} {args[1]}")

with socketserver.TCPServer(("", PORT), NoBSHandler) as httpd:
    print(f"Server: http://localhost:{PORT}")
    httpd.serve_forever()