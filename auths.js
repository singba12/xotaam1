
window.onload = function(){
	let connect = localStorage.getItem("isConnected");
	if(connect==1){
		let data = localStorage.getItem("xotaam-user").split("/");
		let role = data[4];
		window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
	}
}
window.onload = function(){
	let connect = localStorage.getItem("isConnected");
	if(connect==1){
		let data = localStorage.getItem("xotaam-user").split("/");
		let role = data[4];
		window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
	}
}
window.onload = function(){
	let connect = localStorage.getItem("isConnected");
	if(connect==1){
		let data = localStorage.getItem("xotaam-user").split("/");
		let role = data[4];
		window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
	}
}