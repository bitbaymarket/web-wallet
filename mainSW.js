var isOnline = true;														// Can be used to check if device is in offline/online mode
var isWebAPK = window.matchMedia('(display-mode: fullscreen)').matches;		// Can be used to check if browser or webapk currently running
console.log("[*] The app is running as a "+(isWebAPK?"WebAPK":"Browser-Page"));

function checkOnlineStatus(){
	isOnline = navigator.onLine;
	console.log("[*] Connection status: "+(isOnline?"online":"offline"));
	if (isOnline){
		console.log("You are online");
	}
	else {
		console.log("You are offline");
	}
}

function init(){
	// Register service worker
	if ('serviceWorker' in navigator) {
		console.log("[*] Register serviceWorker ...");
		navigator.serviceWorker.register('/sw.js').then(function(registration) {
			// Registration was successful
			console.log('[*] ServiceWorker registration successful with scope: ', registration.scope);
		}, function(err) {
			// registration failed :(
			console.log('[*] ServiceWorker registration failed: ', err);
		});
	}
	else console.log("[*] ServiceWorker not supported by your browser!");
	
	// Trigger install prompt for WebAPK
	window.addEventListener("beforeinstallprompt",function(event){
		console.log("[*] WebAPK install event fired!");
		var btn = $("<button>install</button>");
		$("body").append(btn);
		btn.click(function(e){
			event.prompt();
			btn.remove();
		});
	});
	
	// Initialize online/offline detection
	checkOnlineStatus();
	window.addEventListener("online",checkOnlineStatus);
	window.addEventListener("offline",checkOnlineStatus);
}

init();
