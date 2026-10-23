import os
import http.server
import socketserver

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class GitHubPagesHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # 1. Clean URL resolution (e.g. /404 -> /404.html, /solutions -> /solutions.html)
        path = self.path.split('?')[0].lstrip('/')
        if path and not os.path.exists(os.path.join(DIRECTORY, path)):
            if os.path.exists(os.path.join(DIRECTORY, path + '.html')):
                self.path = '/' + path + '.html'

        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            custom_404 = os.path.join(DIRECTORY, '404.html')
            if os.path.exists(custom_404):
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                with open(custom_404, 'rb') as f:
                    content = f.read()
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
        super().send_error(code, message, explain)

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('', PORT), GitHubPagesHandler) as httpd:
        print(f"Serving STACKLY FinTech on port {PORT} with GitHub Pages rules...")
        httpd.serve_forever()
