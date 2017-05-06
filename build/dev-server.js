require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')


// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express();

const router = express.Router();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const http = require('http');

const https = require('https');

var bodyParser = require('body-parser');
// var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

io.on('connection', (socket) => {


  // 群聊
  socket.on('sendGroupMsg', function (data) {
    socket.broadcast.emit('receiveGroupMsg', data);
  });

  // 上线
  socket.on('online', name => {
    socket.broadcast.emit('online', name)
  });

})

router.get('/ip', (req, res) => {

  let p = new Promise((resolve, reject) => {
    let info = '';
    https.get('https://api.map.baidu.com/location/ip?ak=ShnXqDMOm6Xkm3bO1KBhtIf3xsk7hdCd&coor=bd09ll', response => {
      response.on('data', data => info += data);
      response.on('end', () => resolve(info));
    })
  });

  p.then(info => res.json(JSON.parse(info)))

})

router.post('/AI', (req, res) => {
  let search = encodeURI(req.body.search) || 'Hello';
  let userid = encodeURI(req.body.userid) || '';
  let loc = encodeURI(req.body.loc) || ''
  let p = new Promise((resolve, reject) => {
    let info = '';

    http.get(`http://op.juhe.cn/robot/index?info=${search}&dtype=&loc=${loc}&lon=&lat=&userid=${userid}&key=f3aadfae6b4d884b615da2379cbce14e`, response => {
      response.on('data', data => info += data);
      response.on('end', () => {
        info = info.text && info.text.replace('聚合数据', 'microzz ') || '没有找到，看看我的个人网站吧👉https://microzz.com/'
        // result.data.result && result.data.result.text.replace('聚合数据', 'microzz ') || '没有找到，看看我的个人网站吧👉https://microzz.com/',
        resolve(info);
      })
    })
  });

  p.then(info => res.json(JSON.parse(info)))


})

app.use('/api', router);

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)



// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// var server = app.listen(port)

server.listen(8080);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
