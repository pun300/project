
/*
 * GET users request.
 */

var db       = require('../lib/db.js');
var objectID = require('mongojs').ObjectId;



exports.add = function(req, res){

    db.cUser.save(
    	{
    		email : req.body.user,
    		password : req.body.passwd
    	},
    	function(err,result){
    		res.redirect('/signin');
    	}
    )
 
};

exports.login = function(req, res){

	db.cUser.findOne(
		{
			email : req.body.user,
			password : req.body.passwd
		},
		function(err,user){
			if(!err && user && user._id){
				req.session.userid = user._id;
				req.session.email = user.email;
				req.session.logined = true;
				res.redirect('/');
			}else{
				res.redirect('/signin');
			}
		}
 	);

};

exports.signout = function(req, res){
	delete req.session.name ;
	delete req.session.email ;
	delete req.session.userid ;
	req.session.logined = false;
	res.redirect('/');
	res.end();
};

exports.register = function(req, res){
	if (req.session.logined){
		res.redirect('/');
		return;
	}
    res.render('users/register');
};

exports.signin = function(req, res){
	if(req.session.logined){
		res.redirect('/');
		return;
	}
	res.render('users/signin');
};



exports.forget = function(req, res){
	if(req.session.logined){
		res.redirect('/');
		return;
	}
	res.render('users/forget');
};


exports.getProfile = function(req, res){
	console.log('============',req.session, req.user);
	if( (!req.session.logined) ){
		res.redirect('/');
		return;
	}
	res.locals.username = req.session.name;
	res.locals.authenticated = req.session.logined;

	db.cUser.findOne(
		{
			_id : objectID( req.session.userid )
		},
		function(err, data){

			res.render('users/profile', {
				title : 'Welcome to Chatroom',
				user: data
			});
		}
	);
};


exports.update = function(req, res){

	console.log('==========================================',req.body);

	// if( (!req.session.logined) ){
	// 	res.redirect('/');
	// 	return;
	// }
	// res.locals.username = req.session.name;
	// res.locals.authenticated = req.session.logined;

	db.cUser.update(
		{
			_id : objectID( req.session.userid )
		},
		{
			$set: req.body
		},
		function(err, data){

			res.redirect('/profile');

		}
	);
};






/************************************* tmp function ***********************************/



// exports.modify = function(req, res){
// 	if((!req.session.name) || (!req.session.logined)){
// 		res.redirect('/');
// 		return;
// 	}
// 	res.locals.username = req.session.name;
// 	res.locals.authenticated = req.session.logined;
// 	res.locals.messageID = req.params.id;
// 	Blog.find({ _id:req.params.id }, function( err, blogs, count ){
// 		res.render('users/modify', {
// 			blogs: blogs
// 		});
// 	});
// };

// exports.update = function(req, res){
// 	if(!req.params.id){
// 		res.redirect('/');
// 		return;
// 	}
// 	Blog.update({ _id: req.params.id }, {Article: req.body.Content}, function(err){
// 		if(err)
// 			console.log('Fail to update article.');
// 		else
// 			console.log('Done');
// 	});
// 	res.redirect('profile');
// };


// exports.message = function(req, res){
// 	res.locals.username = req.session.name;
// 	res.locals.authenticated = req.session.logined;
// 	res.locals.messageID = req.params.id;
// 	Blog.find({ _id: req.params.id }, function(err, blogs, count){
// 		Comment.find({ MessageID:req.params.id}, function(err, comments, count){
// 			res.render('users/message',{
// 				blogs:blogs,
// 				comments:comments
// 			});
// 		});
// 	});
// };

// exports.comment = function(req, res){
//     if(!req.params.id){
//     	res.redirect('/');
//     	return;
//     }
//     new Comment({
//     	Visitor: req.body.Visitor,
//     	Comment: req.body.Comment,
//     	MessageID: req.params.id,
//     	CreateDate: Date.now()
//     }).save(function(err){
//     	if(err){
//     		console.log('Fail to save to DB.');
//     		return;
//     	}
//     	console.log('Save to DB');
//     });
//     res.redirect('/message/'+req.params.id);
// };

// exports.profile = function(req, res){
// 	if((!req.session.name) || (!req.session.logined)){
// 		res.redirect('/');
// 		return;
// 	}
// 	res.locals.username = req.session.name;
// 	res.locals.authenticated = req.session.logined;
// 	Blog.find({Username:req.session.name},function(err, blogs,count){
// 		res.render('users/profile', {
// 			title : 'Welcome to Chatroom',
// 			blogs: blogs
// 		});
// 	});
// };