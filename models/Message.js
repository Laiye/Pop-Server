module.exports = function(mongoose){

	var MessageSchema = new mongoose.Schema({
		send:		{ type: String },
		receiver:	{ type: String },
		date:		{ type: Date },
		content:	{ type: String },
	 	read:		{ type: Boolean }
	});

	var Message = mongoose.model('Message',MessageSchema);

	var saveMsg = function(P_send, P_receiver, P_content){

		console.log('Try to saveMsg: ' + 'send--> ' + P_send + ' receiver--> ' + P_receiver);
		
		var msg = new Message({
			send: P_send,
			receiver: P_receiver,
			date: new Date(),
			content: P_content,
			read: false
		});
		
		msg.save(function(err){
			if(err){
				return console.log(err);
			};
			return console.log('Msg has been saved. Detail: ' + msg);	  
		});
		
		console.log('saveMsg comment was send');
	};

	var findMsgUnread = function(P_receiver, callback){
		Message.find({ receiver: P_receiver, read: false }, function(err, doc){
			console.log('------------Message unRead--------------');
			console.log(doc);
			callback(doc);
		})
	};


	var deleteMsg = function(P__id,callback){
		Message.remove({ _id: P__id }, function(err,docs){
			console.log('deleteMsg:====>' + P__id);
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