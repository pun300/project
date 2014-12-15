
var db       = require('../lib/db.js');


exports.index = function(req, res){


	console.log('seesion data',req.session);

    res.locals.email = req.session.email;
    res.locals.authenticated = req.session.logined;

    if(req.session.userid){

    	db.cArticle.find(
    		{
    			userid : req.session.userid
    		},
    		function(err,result){

    			console.log('blogs',result);

			    res.render('index', {
			    	title : 'Welcome to Chatroom',
			        blogs: result
			    });

    		}
    	)

    }else{
		res.render('index', {
	    	title : 'Welcome to Chatroom',
	        blogs: []
	    });
    }

};