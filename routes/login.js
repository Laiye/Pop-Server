/*
	{
		"action": "/login",
		"param": {
			"uid": "String",
			"password": "String"
		},
		"return": {
			"status": "Number",
			"token": "String",
			"expires": "expires",
			"User": "Json Object"
		}
	}
*/
module.exports = function(app, models){

	var jwt = require('jwt-simple');
	var moment = require('moment');

	app.post('/login', function(req, res,next){
		console.log('url---->/login');

		var uid = req.body.uid;
		var password = req.body.password;

		if (null == uid || uid.length < 5
			|| null == password || password.length < 6) {
			console.log('你它喵的格式不对');
			return res.json({
				status: 1
			});
		};

		models.User.validPassword(uid,password,function(user){
			if (!user) {
				console.log('UID or password incorrect!');
				return res.json({
					status: 1
				});
			};

			var expires = moment().add(1,'days').valueOf();
			var token = jwt.encode({
				iss: user.uid,
				exp: expires
			},app.get('jwtTokenSecret'));

			res.json({
				status: 0,
				token: token,
				expires: expires,
				user: user.toJSON()
			});
		});
	});
}