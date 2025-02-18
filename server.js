//server.js
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const { createProxyServer } = require('http-proxy');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 인증서와 키 파일 로드
const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'), // 비공개 키
  cert: fs.readFileSync('./localhost.pem'), // 인증서
};

const proxy = createProxyServer();

app.prepare().then(() => {
  const server = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);

    if (parsedUrl.pathname.startsWith('/api/proxy')) {
      req.url = req.url.replace(/^\/api\/proxy/, '');
      proxy.web(req, res, {
        target: 'http://ec2-3-35-52-7.ap-northeast-2.compute.amazonaws.com',
        changeOrigin: true,
      });
      return;
    }

    handle(req, res, parsedUrl);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
