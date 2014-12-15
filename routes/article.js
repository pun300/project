

/*
 * GET article request.
 */

var db       = require('../lib/db.js');
var objectID = require('mongojs').ObjectId;
var moment   = require('moment');


exports.add_article = function(req, res){
	if((!req.session.email) || (!req.session.logined)){
		res.redirect('/');
		return;
	}
	res.locals.email = req.session.email;
	res.locals.authenticated = req.session.logined;
	res.render('users/add_article');
};

exports.update_article = function(req, res){


	console.log('update data', req.body);
	if((!req.session.email) || (!req.session.logined)){
		res.redirect('/');
		return;
	}

	res.locals.email = req.session.email;
	res.locals.authenticated = req.session.logined;

	db.cArticle.findOne(
		{
			_id : objectID(req.params.id)
		},
		function(err,result){
			res.render('users/update_article',{
				article : result
			});
		}
	)

};

exports.add = function(req, res){

    if(!req.session.userid){
    	res.redirect('/');
    	return;
    }

    db.cArticle.save(
    	{
    		content : req.body.Content,
    		userid : req.session.userid,
    		date : moment().format('YYYY/MM/DD')
    	},
    	function(err,result){
    		res.redirect('/');
    	}
    )
};

exports.update = function(req, res){

    if(!req.session.userid){
    	res.redirect('/');
    	return;
    }

    db.cArticle.update(
    	{
    		_id : objectID(req.params.id)
    	},
    	{
    		$set:{
    			content : req.body.Content,
    		}
    	},
    	function(err,result){
    		res.redirect('/');
    	}
    )
};

// exports.del_article = function(req, res){
// 	Blog.remove({ _id: req.params.id }, function(err) {
// 		if (err)
// 	        console.log('Fail to delete article.');
// 	    else
// 	    	console.log('Done');
// 	});
// 	res.redirect('profile');
// };


