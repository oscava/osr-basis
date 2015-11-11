var Master = require("osr-master");
var Process = Master.Process;
var debug = require("debug")("osr-basis:main\t");
var redis = require("redis");

var Basis = Process.extends({
	onStart:function(){
		var _this = this;
		this.config = null;
		this.on("config",function( config, handle ){
			this.config = config;
			this.client = redis.createClient(this.config.mQ.url);
			this.client.on("error",function(e){
				_this.send("error",e.message);
			});
			this.client.on("connect",function(){
				_this.send(handle);
			});
		});
		this.on("start",function(){
			this.client.on("message",function( channel, data ){
				
			});
		});
	}
});

Basis.fork = function( config ){
	config = config || {};
	var child = master.fork( __dirname );
	child.send('config',config,function(){
		child.send('start');
	});
	child.on("error",function(err){
		debug("error",err);
	});
	child.on("exit",function(process){
		debug("exit",this.pid);
	});
	child.on("connect",function(process){
		debug("connect",this.pid);
	});
	child.on("disconnect",function(){
		debug("disconnect",this.pid);
	});
	child.on('close',function( process ){
		debug('close',this.pid);
	});
	return child;
}

var master = null;

module.exports = Basis;

global.Basis = Basis;

if(!module.parent){
	new Basis();
}else{
	master = new Master();
}