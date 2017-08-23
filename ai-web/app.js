const PORT = 9999;

const path = require('path');
const ejs = require('ejs');
const app = require('express')();
const server = require('http').Server(app);
const router = require('./lib/router')

app.use('/dist', require('serve-static')('./dist/'));
app.use('/', require('serve-static')('./public/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('jss', path.join(__dirname, 'public/js'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(router);

server.listen(PORT);
console.log(`Listening at ${ PORT }...`);

