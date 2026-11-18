const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    // Jika mengakses root '/', tampilkan index.html
    let filePath = req.url === '/' ? 'index.html' : req.url;
    let fullPath = path.join(__dirname, filePath);
    let ext = path.extname(fullPath);

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 - Halaman tidak ditemukan');
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain; charset=utf-8' });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server HTTP berjalan di http://localhost:${PORT}`);
});