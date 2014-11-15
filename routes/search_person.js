/*
	{
		"action": "/search_person",
		"param": {
			"token": "String",
			"person_uid": "String"
		},
		"return": {
			"status": "Number"
			"person": {
				"uid": "person uid",
				"avatar": "person avatar",
				"location": "person location",
				"sex": "person sex(Number)"
			}
		}
	}
*/
module.exports = function(app, models){

	var jwt = require('jwt-simple');
	var moment = require('moment');

	app.post('/search_person', function(req, res,next){
		console.log('url---->/search_person');

		var token = req.body.token;
		var person_uid = req.body.person_uid;

		if (token) {

			try{
				var decoded = jwt.decode(token,app.get('jwtTokenSecret'));

				if (decoded.exp > Date.now()) {
					//Add code after here to process
					models.User.findByUid(person_uid,function(user){
						if (user) {
							console.log('Succ to find uid');
							return res.json({
								status: 0,
								person: {
									uid: user.uid,
									avatar: user.avatar,
									location: user.location,
									sex: user.sex
								}
							});
						}else{
							console.log('你找的人回火星了');
							return res.json({
								status: 1,
								person: {}
							});
						}
					})
				}else{
					return res.json({
						status: 2,
						person: {}
					});
				}

			}catch(err){
				console.log('error:=---->' + err);
				return res.json({
					status: 1,
					person: {}
				});
			}

		}else{
			console.log('token == null');
			return res.json({
				status: 1,
				person: {}
			});
		}
	});
}