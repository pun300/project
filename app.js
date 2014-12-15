
require('./lib/db.js');

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var article = require('./routes/article');
var http = require('http');
var path = require('path');
var app = express();

app.set('port',process.env.PORT || 4500);
app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.configure(function(){

	app.use(express.cookieParser());

	app.use(express.cookieSession({
	    key:'node',
	    secret:'helloExpressSESSION'
	}));

	app.use(express.bodyParser());
});

app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));

if('development' == app.get('env')){
	app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/register', user.register);
app.get('/signin', user.signin);
app.get('/signout', user.signout);
app.get('/forget', user.forget);
app.get('/add_article', article.add_article);
app.get('/profile', user.getProfile);
app.get('/update_article/:id', article.update_article);
//app.get('/profile',user.profile);

app.post('/apis/login',user.login);
app.post('/apis/user/update/:id', user.update); 
app.post('/apis/user/add', user.add); 
app.post('/apis/article/add', article.add);
app.post('/apis/article/:id', article.update);


// app.post('/apis/comment/:id', user.comment);
// app.get('/profile', user.profile);
// app.get('/modify/:id', user.modify);
// app.get('/message/:id', user.message);
// app.get('/apis/delete/:id', user.del_article);




http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listen on port' + app.get('port'));
});
