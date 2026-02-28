import http.server
import socketserver
import os

PORT = 8000

class NoBSHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        
        # Əgər fayl birbaşa mövcuddursa — ver
        if os.path.isfile(path):
            return super().do_GET()
        
        # Əgər qovluqdursa — index.html axtarır
        if os.path.isdir(path):
            return super().do_GET()
        
        # .html əlavə edib yoxla
        if os.path.isfile(path + ".html"):
            self.path = self.path.rstrip("/") + ".html"
            return super().do_GET()
        
        # Tapılmadı
        return super().do_GET()

    def log_message(self, format, *args):
        print(f"{self.address_string()} → {args[0]} {args[1]}")

with socketserver.TCPServer(("", PORT), NoBSHandler) as httpd:
    print(f"Server işləyir: http://localhost:{PORT}")
    print("Dayandırmaq üçün Ctrl+C")
    httpd.serve_forever()