module.exports = function(mongoose){

	var MessageSchema = new mongoose.Schema({
		send:		{ type: String },
		receiver:	{ type: String },
		date:		{ type: Date },
		content:	{ type: String },
	 	read:		{ type: Boolean }
	});

	var Message = mongoose.model('Message',MessageSchema);

	/*
		{
			"name": "saveMsg",
			"param": {
				"send": "send_uid",
				"receiver": "receiver_uid",
				"content": "message content"
			},
			"callback": {
				"isSucc": "true or false"
			}
		}
	*/
	var saveMsg = function(send, receiver, content,callback){

		console.log('Try to saveMsg: ' + 'send--> ' + send + ' receiver--> ' + receiver);
		
		var msg = new Message({
			send: send,
			receiver: receiver,
			date: new Date(),
			content: content,
			read: false
		});
		
		msg.save(function(err){
			if(err){
				console.log('fail to save Msg. err: ' + err);
				callback(false);
			}else{
				console.log('Msg has been saved. Detail: ' + msg);
				callback(true);
			}
				  
		});
		
		console.log('saveMsg comment was send');
	};


	/*
		{
			"name": "findMsgUnread",
			"param": {
				"receiver": "receiver_uid"
			},
			"callback": {
				"doc": "Message Unread"
			}
		}
	*/
	var findMsgUnread = function(receiver, callback){
		Message.find({ receiver: receiver, read: false }, function(err, doc){
			console.log('------------Message unRead--------------');
			console.log(doc);
			callback(doc);
		})
	};

	/*
		{
			"name": "deleteMsg",
			"param": {
				"_id": "Message primary key"
			},
			"callback": {
				"docs": "Msg has benn delete"
			}
		}
	*/
	var deleteMsg = function(_id,callback){
		Message.remove({ _id: _id }, function(err,docs){
			console.log('deleteMsg:====>' + _id);
			console.log(docs);
			callback(docs);
		})
	}

	return {
		saveMsg: saveMsg,
		deleteMsg: deleteMsg,
		findMsgUnread: findMsgUnread,
		Message: Message
	}
}