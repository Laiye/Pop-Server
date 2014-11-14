/*
	{
		"action": "/req",
		"param": {
			"uid": "String",
			"password": "String",
			"avatar": "String",
			"sex": "Number"
		},
		"return": {
			"status": "Number"
		}
	}
*/
module.exports = function(app, models){

	app.post('/reg', function(req, res,next){
		console.log('url---->/reg');

		var uid = req.body.uid;
		var password = req.body.password;
		var avatar = req.body.avatar;
		var location = req.body.location;
		var sex = req.body.sex;

		if (null == uid || uid.length < 5
			|| null == password || password.length < 6) {
			console.log('你它喵的格式不对');
			return res.json({
				status: 1
			});
		};

		models.User.isExist(uid,function(user){
			if (!user) {
				console.log("走狗屎运了，这个ID还没被注册！");
				models.User.regUid(uid,password,avatar,location,sex,function(isSucc){
					console.log('regUid' + isSucc);
					if (isSucc) {
						return res.json({
							status: 0
						});
					}else{
						return res.json({
							status: 1
						});
					}

				});

			}else{
				console.log('此ID已名花有主');
				return res.json({
					status: 2
				});
			}
		})

	});
}