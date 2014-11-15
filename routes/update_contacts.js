/*
	{
		"action": "/update_contacts",
		"param": {
			"token": "String"
		},
		"return": {
			"status": "Number"
			"contacts": [{
				{
					"uid": "xxx",
					"avatar": "xxx"
				},{
					"uid": "yyy".
					"avatar": "yyy"
				}
			}]
		}
	}
*/
module.exports = function(app, models){

	var jwt = require('jwt-simple');
	var moment = require('moment');

	app.post('/update_contacts', function(req, res,next){
		console.log('url---->/update_contacts');

		var token = req.body.token;

		if (!token) {
			console.log('token = null');
			return res.json({
				status: 1,
				contacts: []
			});
		};

		try{
			var decoded = jwt.decode(token,app.get('jwtTokenSecret'));
			console.log(decoded);

			if (decoded.exp > Date.now()) {
				models.User.findByUid(decoded.iss,function(user){
				//	console.log(user);
					if (user) {
						return res.json({
							status: 0,
							contacts: user.contacts
						});
					}else{
						return res.json({
							status: 1,
							contacts: []
						});
					}
				});
			}else{
				return res.json({
					status: 2,
					contacts: []
				});
			}
		}catch(err){
			console.log(err);
			return res.json({
				status: 1,
				contacts: []
			});
		}
	});
}