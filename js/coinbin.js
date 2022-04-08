var profile_data = "";
var debug = false;
var bip39 = new BIP39('en');
/*

	//multisig wallet options
	function multisigMselect(event) {
  //var x = document.getElementById("multisigMnumber").value;
  //document.getElementById("demo").innerHTML = "You selected: " + x;
  
  
  
  var el = event.target;
  var val = el.value;
  alert('tst:  '+val);
  
  
  //re-init the "m-of-N key" select options
  var multisigNSelect = document.getElementById("multisigWalletNnumber");
  multisigNSelect.innerHTML = '';
    //we accept maximum 16 keys for multisig!
  for(i=val; i<=16; i++) {
    var option = document.createElement("option");
    option.text = i;
    multisigNSelect.add(option);
  }
}

*/


/*

var values = [];
$("input[name='openPassTest']").each(function() {
    values.push(($(this).val()).trim());
});


var values = [];
var passFields = document.getElementsByName("openPassTest");
for(var i = 0; i < passFields.length; i++) {
    values.push((passFields[i].value).trim());
}


		var passwordsArr = [];
		for (i=0; ;i++) {
			passwordsArr.push("password" : pass);
		}
		*/






$(document).ready(function() {

  /*get Dynamic Peg info */
  pegInfo();
  /*get Price and Volume info */
  coinData();
  

/*
m-of-n address login, deprecated for the moment
  // multisig wallet login 
  document.getElementById('multisigWalletMnumber').addEventListener('change', function() {
  
  //var x = document.getElementById("multisigMnumber").value;
  //document.getElementById("demo").innerHTML = "You selected: " + x;
  
  
  
  
  var mVal = parseInt(this.value);
  console.log('m: ' + mVal);
  
  
  //re-init the "m-of-N key" select options
  var multisigNSelect = document.getElementById("multisigWalletNnumber");
  var oldNval = parseInt(multisigNSelect.value);
  
  console.log('n: ' + multisigNSelect.value);
  
  
    
    multisigNSelect.innerHTML = '';
  
    var walletLoginEl = document.getElementById("wallet")
    walletLoginEl.innerHTML = "";
    multisigNSelect.innerHTML = "";
    var inputPass, inputEmail;
    var j=1;
    
  //we accept maximum 16 keys for multisig wallets!  
  for(i=0; i<=16; i++) {
    
    //n should not be more then 16!
    if(mVal+i <=16){
      //add select options for X multisig keys
      var option = document.createElement("option");
      option.text = (mVal+i);
      
      //set n address to selected if set by user
      if(parseInt(mVal+i) == oldNval) {
        option.selected = 'selected';
        console.log('if selected: ' + multisigNSelect.value);
       }else{
         console.log('else selected: ' + parseInt(multisigNSelect.value));
         console.log('else option.text: ' + parseInt(mVal+i));
       }

      multisigNSelect.add(option);
     }
    
    
    //append multisig input fields 
    if(j <= oldNval || j <= mVal ) {
      //create input elements for X multisig keys
      inputPass = document.createElement("input");
      inputPass.name ="openEmail";
      inputPass.placeholder = "Password "+ j;
      
      inputEmail = document.createElement("input");
      inputEmail.name ="openEmail";
      inputEmail.placeholder = "E-mail address "+ j;
    
      walletLoginEl.append(inputEmail);
      walletLoginEl.append(inputPass);
    }
    j++;

  }

});

document.getElementById('multisigWalletNnumber').addEventListener('change', function() {
  console.log('N value: ', this.value);
  
  var walletLoginEl = document.getElementById("wallet")
  walletLoginEl.innerHTML = "";
  
  for(i=1; i<=this.value; i++) {
    
    inputPass = document.createElement("input");
    inputPass.name ="openEmail";
    inputPass.placeholder = "Password "+ i;
    
    inputEmail = document.createElement("input");
    inputEmail.name ="openEmail";
    inputEmail.placeholder = "E-mail address "+ i;
    
    walletLoginEl.append(inputEmail);
    walletLoginEl.append(inputPass);
    
  }
  
});
*/


document.getElementById('openBtn').addEventListener('click', function () {
  console.log("You finally clicked without jQuery");
  
  
  //get passwords
  var loginPass = [];
  var loginPassEl = document.getElementsByName("openPass");
  for(var i = 0; i < loginPassEl.length; i++) {
    loginPass.push({"password": (loginPassEl[i].value).trim()});
    
  }
  
  console.log('loginPass: ', loginPass);
  
  console.log('loginPass: ' + loginPass[0]["password"]);
  console.log('loginPass: ' + loginPass[1]["password"]);
  
  
  //get confirmed passwords 
  var loginPassConfirm = [];
  var loginPassConfirmEl = document.getElementsByName("openPass-confirm");
  for(var i = 0; i < loginPassConfirmEl.length; i++) {
    loginPassConfirm.push({"password": (loginPassConfirmEl[i].value).trim()});
    
  }
  
  console.log('loginPassConfirm: ', loginPassConfirm);
  
  console.log('loginPassConfirm: ' + loginPassConfirm[0]["password"]);
  console.log('loginPassConfirm: ' + loginPassConfirm[1]["password"]);
  
  
});


	/* open wallet code */

	var explorer_tx = "https://coinb.in/tx/"
	var explorer_addr = "https://coinb.in/addr/"
	var explorer_block = "https://coinb.in/block/"



	$("#openBtn").click(function(){
		var pass = $("#openPass").val();
		var pass2 = $("#openPass2").val();
		var remember_me = $("#rememberMe").val();
		var email = $("#openEmail").val().toLowerCase();
		var email = email.trim();
		var walletType = $("#regularwallet").hasClass("active") ? "regular" : "multisig";
		

		profile_data = { 
		"email" : email,
		"wallet_type" : walletType,	//regular (login normal address), multisig (login multisig address), key (login with private key)
		"remember_me" : remember_me,
		"signatures" : 1,
		"passwords" : [
				{
					"password" : pass,
				}
			]
		};

		//save the second key 
		if(pass2 != "") {
			profile_data.passwords.push({"password" : pass2});
			profile_data.signatures = 2;
		}


/*
profile_data = { 
		"address" : "",
		"email" : email,
		"login_type" : "", //"password" (email, password login), "key" login, "mnemonic" login
		"wallet_type" : walletType,	//regular (login normal address), multisig (login multisig address), key (login with private key), mnemonic (Mnemonic words login)
		"remember_me" : remember_me,
		"signatures" : 1,
		"passwords" : [
				{
					"password" : pass,
				},
				{
					"password" : pass2
				}
			],
		"keys" : [
				{"key" : ""}, 
				{"key" : ""}
			]
		};




		profile_data = { 
		"email" : email,
		"wallet_type" : walletType,	//regular (login normal address), multisig (login multisig address), key (login with private key), mnemonic (Mnemonic words login)
		"remember_me" : remember_me,
		"signatures" : 1,
		"passwords" : [
				{
					"password" : pass,
				},
				{
					"password" : pass2
				}
			],
		"keys" : [
				{"key" : ""}, 
				{"key" : ""}
			]
		};
		*/
		//checkUserLogin(JSON.parse(profile_data));
		checkUserLogin(profile_data);
	});

	//copy walletKeys so sensitive info stay in the backup tab
	function copyWalletInfo(){
		if (debug) {
			console.log("copyWalletInfo");
		}
		$("#walletKeysCopy").empty();
		$("#walletKeys .share-yes").clone().appendTo("#walletKeysCopy");
	}

	//$(".walletLogout").click(function(sessionDestroy = false){
	$(".walletLogout").click(function(e){
		$("#openEmail").val("");
		$("#openEmail-confirm").val("");
		$("#openPass").val("");
		$("#openPass-confirm").val("");
		$("#openPass2").val("");
		$("#openPass2-confirm").val("");
		
		//Menu Account Info
		$(".walletEmail").text("");
    $(".walletEmail").attr("data-original-title", "");
		$(".walletBalance").text("");
		$(".topPanel .walletBalance").text("You are not logged in");
		$(".walletBalanceLiquid").text("");
		$(".walletBalanceReserve").text("");
		$(".walletBalanceFrozen").text("");
		$(".accountSessionLogout").addClass("hidden");
		$(".accountSessionLogin").removeClass("hidden");
    
    $(".topPanel .glyphicon.glyphicon-log-out").addClass("hide");
    
		
		$("#openLogin").show();
		$("#openWallet").addClass("hidden").show();

		$("#walletAddress").html("");
		$("#walletHistory").attr('href',explorer_addr);

		$("#walletQrCode").html("");
		var qrcode = new QRCode("walletQrCode");
		qrcode.makeCode("bitbay:");

		$("#walletKeys .privkey").val("");
		$("#walletKeys .pubkey").val("");
		$("#walletKeys .privkeyaes").val("");
		
		$("#walletKeys .privkey2").val("");
		$("#walletKeys .pubkey2").val("");
		$("#walletKeys .privkeyaes2").val("");
		
		//Remove HTML5 Sessions
		//if (sessionDestroy)
			HTML5.sessionStorage('profile_data').remove();
		
		//Remove NotifiesSessions
		PNotify_remove();
		//giorgosk
		$("body").removeClass("loggedin").addClass("loggedout");

	});

	$("#walletShowKeys").click(function(){
		$("#walletKeys").removeClass("hidden");
		$("#walletSpend").removeClass("hidden").addClass("hidden");
	});

	$("#walletBalance").click(function(){
		walletBalance();
	});
	$("#walletBalanceLiquid").click(function(){
		walletBalance();
	});
	$("#walletBalanceReserve").click(function(){
		walletBalance();
	});
	$("#walletBalanceFrozen").click(function(){
		walletBalance();
	});

	$("#walletConfirmSend").click(async function(){
		var thisbtn = $(this);
		var tx = coinjs.transaction();
		var txfee = $("#txFee");
		var devaddr = coinjs.developer;
		var devamount = $("#developerDonation");

		var devamountVal = devamount.val()*1;

		//Update timestamp
		$("#nTime").val(Date.now() / 1000 | 0);
		if(($("#nTime").val()).match(/^[0-9]+$/g)){
			tx.nTime = $("#nTime").val()*1;
		}
		
		var total = (devamountVal) + (txfee.val()*1);
		var payees = 0;

		$.each($("#walletSpendTo .output"), function(i,o){
			var addr = $('.addressTo',o);
			var amount = $('.amount',o);
			if(amount.val()*1>0){
				total += amount.val()*1;
				payees++;
			}
		});
		if((devamountVal)>0){
			payees++;
		}
					
					
		thisbtn.attr('disabled',true);
		$("#walletConfirmSend").html('<span class="glyphicon glyphicon-repeat glyphicon-spin"></span> Send');

		var send_liquid = $("#walletSpendTypeLiquid").prop("checked");
		var send_reserve = $("#walletSpendTypeReserve").prop("checked");

		tx.addUnspent($("#walletAddress").html(), async function(data){

			var dreserve = (data.reserve/100000000).toFixed(8) * 1;
			var dliquid = (data.liquid/100000000).toFixed(8) * 1;
			var dvalue = (data.value/100000000).toFixed(8) * 1;
			total = (total*1).toFixed(8) * 1;
			
			var total_txinputs = tx.ins.length;
			
			if (send_liquid) {
				
				
				if(dliquid>=total){
					
					$.each($("#walletSpendTo .output"), function(i,o){
						var addr = $('.addressTo',o);
						var amount = $('.amount',o);
						if(amount.val()*1>0){
							tx.addoutput(addr.val(), amount.val()*1);
						}
					});
					
					if((devamountVal)>0){
						tx.addoutput(devaddr, devamountVal);
					}
					
					var change = dvalue-total;
					if((change*1)>0){
						tx.addoutput($("#walletAddress").html(), change);
					}
					
					
					if (debug) {
						console.log("===Start of Liquid signatures.");
						console.log('DEBUG Txinputs total: ', total_txinputs);
					}
					// clone the transaction with out using coinjs.clone() function as it gives us trouble
					var tx2 = coinjs.transaction(); 
					var txunspent = tx2.deserialize(tx.serialize()); 
	
					// then sign, regular wallet
					if (debug) {
						console.log("==Regular wallet sign START==");
					}
					//for progress bar
					await init_broadcast_progress_bar(total_txinputs, 0);
					//document.querySelector(".bar_privkey_sign_current").innerText = 1;
					$('.bar_privkey_sign_current').text(1);
					console.log()
					

					var signed = await txunspent.sign($("#walletKeys .privkey").val());
	
					// then sign again, if multisig wallet
					if (debug) {
						console.log("==Regular wallet sign END==");
						console.log("==Multisig sign again START==");
					}
					
					//for progress bar
					//document.querySelector(".bar_privkey_sign_current").innerText = 2;
					$('.bar_privkey_sign_current').text(2);
					
					if ($("#walletKeys .privkey2").val() != "") {
						txunspent = tx2.deserialize(signed); 
						signed = await txunspent.sign($("#walletKeys .privkey2").val());
					}
					if (debug) {
						console.log("===END of Liquid signatures.");
					}
					
					if (debug) {
						console.log("==Multisig sign again END==");
						console.log("===End of Reserve signatures.");
						console.log("RAWtx signed:" + signed);
					}
					
					//check if address is multisig, then sign with second private key
					/*
					var profile_data;
					profile_data = HTML5.sessionStorage('profile_data').get();
					if (profile_data.wallet_type == "multisig")
						alert("multisig address");
					else
						alert("regular address");
					*/
					console.log('broadcast Liquid started!!');
					

					reset_broadcast_progress_bar();
					
					// and finally broadcast!
					tx2.broadcast(function(data){
						dataJSON = JSON.parse(data);
						if (debug) {					
							console.log(dataJSON);
						}
						if(dataJSON.api_status=="success" || dataJSON.status){
							callback_result =  dataJSON.result
							var success = false;
							if(coinjs.block_processor == 'bp'){
								if(dataJSON.result.status == "success"){
									success = true;
									callback_result = dataJSON.result.tx;
								}else{
									callback_result = dataJSON.result.msg;
								}
							}
							
							//reset broadcasting progress bar animation
							reset_broadcast_progress_bar();
							
							if(success || callback_result.match(/^[a-f0-9]+$/)){
								var mess = 'Your transaction was successfully sent: <br />'
								 +'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
								// +'<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
								$("#walletSendConfirmStatus").removeClass("hidden").removeClass('alert-danger').addClass('alert-success').html(mess);
	
								if (devamountVal > 0)
									$("#walletSendConfirmStatus").html( $("#walletSendConfirmStatus").html() + '<br /> <span class="glyphicon glyphicon-heart"></span> Thank you very much for your donation');
								$("#walletConfirmSend").html("Send");
								$("#walletConfirmSend").addClass("hidden");
							} else {	//$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
								$("#walletSendConfirmStatus").removeClass("hidden").removeClass('alert-success').addClass('alert-danger').html(unescape(callback_result));
								$("#walletSendFailTransaction").removeClass("hidden");
								$("#walletSendFailTransaction textarea").val(signed);
								$("#walletConfirmSend").html("Send");
								thisbtn.attr('disabled',false);
							}
						}
						/*	
						if($(data).find("result").text()=="1"){
							$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-success').html("txid: "+$(data).find("txid").text());
						} else {
							$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape($(data).find("response").text()).replace(/\+/g,' '));
							$("#walletSendFailTransaction").removeClass("hidden");
							$("#walletSendFailTransaction textarea").val(signed);
							thisbtn.attr('disabled',false);
						}
						*/
	
						// update wallet balance
						walletBalance();
	
					}, signed);
				} else {
					reset_broadcast_progress_bar();
					$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("You have a confirmed liquid balance of "+dliquid+" "+coinjs.symbol+", unable to send "+total+" "+coinjs.symbol+"").fadeOut().fadeIn();
					$("#walletConfirmSend").html("Send");
					thisbtn.attr('disabled',false);
				}
			}
			else if (send_reserve) {
				if(dreserve>=total){
					
					

					// make F notations
					var out_indexes = "";
					if (payees == 1) { // trick to have triple to use sort
							var out_index = String(0+total_txinputs);
							out_indexes = out_index+":"+out_index+":"+out_index;
					}
					else if (payees == 2) { // trick to have triple to use sort
							var out_index1 = String(0+total_txinputs);
							var out_index2 = String(1+total_txinputs);
							out_indexes = out_index1+":"+out_index1+":"+out_index2+":"+out_index2;
					}
					else {
							for(var i=0; i<payees; i++) {
									if (out_indexes != "")
											out_indexes += ":";
									out_indexes += String(i+total_txinputs);
							}
					}
					
					
					if (debug) {
						console.log("===Start of Reserve signatures.");
						console.log('DEBUG Txinputs total: ', total_txinputs);
						console.log('==F-note START ==');
					}

					for(var i=0; i<total_txinputs; i++) {
						var fnote = "**F**"+out_indexes;
						var fnoteb = Crypto.charenc.UTF8.stringToBytes(fnote);
						if (debug) {
							console.log("fnote:" + fnote);
							console.log("fnotehex:" + Crypto.util.bytesToHex(fnoteb));
						}
						tx.adddata(Crypto.util.bytesToHex(fnoteb), 5590);
					};
					
					if (debug) {
						console.log('==F-note END ==');
					}
					
					if (debug) {
						console.log("==sendto START==");
					}
					// sendto
					$.each($("#walletSpendTo .output"), function(i,o){
						var addr = $('.addressTo',o);
						var amount = $('.amount',o);
						if(amount.val()*1>0){
							tx.addoutput(addr.val(), amount.val()*1);
						}
					});
					
					if (debug) {
						console.log("==sendto END==");
					}
					
					if((devamountVal)>0){
						tx.addoutput(devaddr, devamountVal);
					}
					
					var change = dvalue-total;
					if((change*1)>0){
						tx.addoutput($("#walletAddress").html(), change);
					}
	
					if (debug) {
						console.log("==Clone Transaction tx2 START==");
					}
					// clone the transaction with out using coinjs.clone() function as it gives us trouble
					var tx2 = coinjs.transaction(); 
					var txunspent = tx2.deserialize(tx.serialize()); 
	
					if (debug) {
						console.log("==Clone Transaction tx2 END==");
					}
					
					if (debug) {
						console.log("==Regular wallet sign START==");
					}
					
					//for progress bar
					await init_broadcast_progress_bar(total_txinputs, 0);
					//document.querySelector(".bar_privkey_sign_current").innerText = 1;
					$('.bar_privkey_sign_current').text(1);
					
					
					console.log('sign_progressbar1:', sign_progressbar);
					// then sign, regular wallet
					var signed = await txunspent.sign($("#walletKeys .privkey").val());
					
				
	
					// then sign again, if multisig wallet
					if (debug) {
						console.log("==Regular wallet sign END==");
						console.log("==Multisig sign again START==");
					}
					//for progress bar
					//document.querySelector(".bar_privkey_sign_current").innerText = 2;
					$('.bar_privkey_sign_current').text(2);
					
					if ($("#walletKeys .privkey2").val() != "") {
						txunspent = tx2.deserialize(signed); 
						signed = await txunspent.sign($("#walletKeys .privkey2").val());
					}
					
					
					if (debug) {
						console.log("==Multisig sign again END==");
						console.log("===End of Reserve signatures.");
						console.log("RAWtx signed:" + signed);
					}
					//check if address is multisig, then sign with second private key
					/*
					var profile_data;
					profile_data = HTML5.sessionStorage('profile_data').get();
					if (profile_data.wallet_type == "multisig")
						alert("multisig address");
					else
						alert("regular address");
					*/
          
          
					reset_broadcast_progress_bar();
	
					// and finally broadcast!
					tx2.broadcast(function(data){
						if (debug) {					
							console.log('broadcast: ', dataJSON);
						}
						
						dataJSON = JSON.parse(data);
						if (debug) {					
							console.log('dataJSON: ', dataJSON);
						}
						if(dataJSON.api_status=="success" || dataJSON.status){
							callback_result =  dataJSON.result
							var success = false;
							if(coinjs.block_processor == 'bp'){
								if(dataJSON.result.status == "success"){
									success = true;
									callback_result = dataJSON.result.tx;
								}else{
									callback_result = dataJSON.result.msg;
								}
							}
              
							reset_broadcast_progress_bar();
              
							if(success || callback_result.match(/^[a-f0-9]+$/)){
								
                
                var mess = 'Your transaction was successfully sent: <br />'
								 +'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
								// +'<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
								$("#walletSendConfirmStatus").removeClass("hidden").removeClass('alert-danger').addClass('alert-success').html(mess);
	
								if (devamountVal > 0)
									$("#walletSendConfirmStatus").html( $("#walletSendConfirmStatus").html() + '<br /> <span class="glyphicon glyphicon-heart"></span> Thank you very much for your donation');

								$("#walletConfirmSend").html("Send");
								$("#walletConfirmSend").addClass("hidden");
								$("#modalWalletConfirm .modal-body p").css('display','none');
							} else {
								//$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
								$("#walletSendConfirmStatus").removeClass("hidden").removeClass('alert-success').addClass('alert-danger').html(unescape(callback_result)).append("<br>You should perhaps try to raise the Transaction Fee?");
								$("#walletSendFailTransaction").removeClass("hidden");
								$("#walletSendFailTransaction textarea").val(signed);
								$("#walletConfirmSend").html("Send");
								thisbtn.attr('disabled',false);
							}
						}
						/*	
						if($(data).find("result").text()=="1"){
							$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-success').html("txid: "+$(data).find("txid").text());
						} else {
							$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape($(data).find("response").text()).replace(/\+/g,' '));
							$("#walletSendFailTransaction").removeClass("hidden");
							$("#walletSendFailTransaction textarea").val(signed);
							thisbtn.attr('disabled',false);
						}
						*/
	
						// update wallet balance
						walletBalance();
	
					}, signed);
				} else {
					reset_broadcast_progress_bar();
					$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("You have a confirmed reserve balance of "+dreserve+" "+coinjs.symbol+", unable to send "+total+" "+coinjs.symbol+"").fadeOut().fadeIn();
					$("#walletConfirmSend").html("Send");
					thisbtn.attr('disabled',false);
				}
			} else {
					reset_broadcast_progress_bar();
					$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("Unknown send type").fadeOut().fadeIn();
					$("#walletConfirmSend").html("Send");
					thisbtn.attr('disabled',false);
			}

			$("#walletLoader").addClass("hidden");
		});
	});
  
 
	//Function to Handle Progress Bar for Broadcasting
	//$(document).on('broadcast_progress_bar_changed', function() {
	$(document).on('broadcast_progress_bar_changed', async() => {
				
		var parentElement;

		//check if we are making a manual signing or logged in signing
		if ($('#sign').hasClass('active')) {
			parentElement = 0; //'signedDataProgress';
			  //var parentElement = document.querySelector('#signedDataProgress');
			console.log('signedDataProgress: ', parentElement);
		}else {
			parentElement = 1; //'loggedInSignedDataProgress';
			console.log('loggedInSignedDataProgress: ', parentElement);
		}
		var totalSignsNeeded = document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.total_txinputs_sign_needed; 
		var currentTXsigned = document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_total_txinputs_signed;
		var signsDone = document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_txinputs_signed_count;


		console.log('parentElement: ', parentElement);
		console.log('totalSignsNeeded: ', totalSignsNeeded);
		console.log('currentTXsigned: ', currentTXsigned);
		console.log('signsDone: ', signsDone);

		if(!signsDone)
			signsDone = 0;

		var i = parseInt(signsDone)+1;
		
		//increment signsDone 
		document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_txinputs_signed_count = i;
		//$('.broadcast-process-bar').data('bar_txinputs_signed_count', i);
		


				// decrease with 1% so when signing is finished we need to broadcast and get a result!
				//var percent_done = parseInt(i / (totalSignsNeeded) * 100) - 1;
				var percent_done = parseInt(i / (totalSignsNeeded) * 100);
				
				
				if (debug) {
					console.log('signsDone: ', (i));
					console.log('totalSignsNeeded: ', totalSignsNeeded);
					console.log('percent_done: ', percent_done);
				}

				$('.bar_total_txinputs_signed').text(currentTXsigned);
				$('.broadcast-process-bar span').text(percent_done + "%");
		
	});
	
  
  
function reset_broadcast_progress_bar() {
	$(".broadcast-process").addClass("hidden");
	$(".broadcast-process-bar span").text("0%");

	
	$(".bar_privkey_sign_current").text(0);
	$(".bar_privkey_sign_needed").text(0);
	$(".bar_total_txinputs_signed").text(0);
	$(".bar_total_txinputs_needed").text(0);

	$("#signedDataProgress").addClass("hidden");
	coinjs.mTransactionProgress['current'] = 0;
	sign_progressbar.go(100);
							
}
async function init_broadcast_progress_bar(txinputs_total, manualTransaction=1) {
	
	if ($('#sign').hasClass('active')){
		sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress-manual')});
		console.log('nanobar-progress-manual');
	}
	else{
		sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress')});
		console.log('nanobar-progress');
	}

	coinjs.mTransactionProgress['current'] = 0;

	console.log('START - init_broadcast_progress_bar')
	$("#walletSendConfirmStatus").addClass("hidden").removeClass('alert-success').removeClass('alert-danger').html("");
	$("#walletSendFailTransaction").addClass("hidden");
	$("#walletSendFailTransaction textarea").val("");
								
	$(".broadcast-process").removeClass("hidden");
	var totalSignatures;

	if(manualTransaction == 1){
		totalSignatures = 1;
		parentElement = 0; //'signedDataProgress';
		console.log('totalSignatures: ', totalSignatures);
	} else {
		totalSignatures = (profile_data.passwords).length;
		console.log('(profile_data.passwords).length: ', (profile_data.passwords).length);
		parentElement = 1;
	}

	//calc amount of ALL TXinput signatures needed before broadcasting
	//var total_txinputs_sign_needed = txinputs_total * totalSignatures;
	
	
	//$(".broadcast-process-bar").data('bar_txinputs_signed_count', 0);
	//$(".broadcast-process-bar").data('total_txinputs_sign_needed', total_txinputs_sign_needed);
	//$(".broadcast-process-bar").data('bar_privkey_sign_needed', totalSignatures);
	//$(".broadcast-process-bar").data('bar_total_txinputs_needed', txinputs_total);
	//$(".bar_privkey_sign_needed").text(totalSignatures);
	//$(".bar_total_txinputs_needed").text(totalSignatures);
	
	console.log('totalSignatures: ', totalSignatures);
	console.log('txinputs_total: ', txinputs_total);
	
	
	document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_txinputs_signed_count = 0;
	document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.total_txinputs_sign_needed = (txinputs_total * totalSignatures);
	//$('.broadcast-process-bar').data('bar_txinputs_signed_count', 0);
	//$('.broadcast-process-bar').data('total_txinputs_sign_needed', (txinputs_total * totalSignatures) );
	
	coinjs.mTransactionProgress['step'] =  100/(txinputs_total * totalSignatures);
	console.log('coinjs.mTransactionProgress.step', coinjs.mTransactionProgress['step']);

	document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_privkey_sign_needed = totalSignatures;
	document.querySelectorAll('.broadcast-process-bar')[parentElement].dataset.bar_total_txinputs_needed = txinputs_total;
	//$('.broadcast-process-bar').data('bar_privkey_sign_needed', totalSignatures);
	//$('.broadcast-process-bar').data('bar_total_txinputs_needed', txinputs_total)

	
	document.querySelectorAll('.bar_privkey_sign_needed')[parentElement].innerText = totalSignatures;
	document.querySelectorAll('.bar_total_txinputs_needed')[parentElement].innerText = txinputs_total;
	//$('.bar_privkey_sign_needed').text(totalSignatures);
	//$('.bar_total_txinputs_needed').text(txinputs_total);
					 
		
	console.log('STOP - init_broadcast_progress_bar');
	
}

	$("#walletSendBtn").click(function(){

		$("#walletSendFailTransaction").addClass("hidden");
		$("#walletSendStatus").addClass("hidden").html("");

		$("#walletConfirmSend").removeClass("hidden");
		var thisbtn = $(this);
		var txfee = $("#txFee");
		var devamount = $("#developerDonation");

		if((!isNaN(devamount.val())) && devamount.val()>=0){
			$(devamount).parent().removeClass('has-error');
		} else {
			$(devamount).parent().addClass('has-error')
		}

		if((!isNaN(txfee.val())) && txfee.val()>=0){
			$(txfee).parent().removeClass('has-error');
		} else {
			$(txfee).parent().addClass('has-error');
		}

		var total = (devamount.val()*1) + (txfee.val()*1);

		$.each($("#walletSpendTo .output"), function(i,o){
			var amount = $('.amount',o);
			var address = $('.addressTo',o);

			total += amount.val()*1;

			if((!isNaN($(amount).val())) && $(amount).val()>0){
				$(amount).parent().removeClass('has-error');
			} else {
				$(amount).parent().addClass('has-error');			
			}

			if(coinjs.addressDecode($(address).val())){
				$(address).parent().removeClass('has-error');
			} else {
				$(address).parent().addClass('has-error');
			}
		});

		total = total.toFixed(8);

		if($("#walletSpend .has-error").length==0){
			var balance = ($("#walletBalance").html()).replace(/[^0-9\.]+/g,'')*1;
			if(total<=balance){
				$("#walletSendConfirmStatus").addClass("hidden").removeClass('alert-success').removeClass('alert-danger').html("");
				$("#spendAmount").html(total);
				$("#modalWalletConfirm").modal("show");
				$("#walletConfirmSend").attr('disabled',false);
				
				//init the broadcasting progress bar!
			} else {
				$("#walletSendStatus").removeClass("hidden").html("You are trying to spend "+total+' but have a balance of '+balance);
			}
		} else {
			$("#walletSpend .has-error").fadeOut().fadeIn();
			$("#walletSendStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> One or more input has an error');
		}
	});

	$("#walletShowSpend").click(function(){
		$("#walletSpend").removeClass("hidden");
		$("#walletKeys").removeClass("hidden").addClass("hidden");
	});

	$("#walletSpendTo .addressAdd").click(function(){
    
    
		var clone = '<div class="form-horizontal output">'+$(this).parent().html()+'</div>';
    $("#walletSpendTo").append(clone);
		$("#walletSpendTo .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
		$("#walletSpendTo .glyphicon-minus:last").parent().removeClass('addressAdd').addClass('addressRemove');
    
    //hide and unbind the old tooltips, bind the new one
		$("#walletSpendTo .tooltip").hide();
    $("#walletSpendTo .addressRemove").find(".tooltip").remove().unbind("");
    
    $('.addressRemove').attr("title", "Remove recipient's address");
    $('.addressRemove').tooltip();
    
		$("#walletSpendTo .addressRemove").click(function(){
			$(this).parent().fadeOut().remove();
		});

	});

  function coinData(){
    coinjs.coinData(function(data){
			data = $.parseJSON(data);
			if (debug) {console.log('coinData: ', data); console.log('BAY price', data['BAY']['price']);}
      
      //$("#coin_price").text("");
	  $(".coin_price .glyphicon-spin").hide();
	  
      //loop through the json array and get only BAY/BAYR market data
      var marketFound = 0;
      
      if(data['BAY']['price'])
      	marketFound = 1;


      $(".coin_price .bayLPrice p.price_track").text("").append( "<span>"  + data['BAY']['price'] + " USD  </span>");

      /*
      for(var i = 0; i < data.length; i++) {
        
        if(data[i].symbol == "BAY/BTC" || data[i].symbol == "BAY/USDT" || data[i].symbol == "BAYR/BTC"  || data[i].symbol == "BAYR/USDT") {
          console.log('=================================');
          console.log('symbol: ', data[i].symbol);
          console.log('symbol data: ', data[i]);
          
          if(data[i].symbol == "BAY/BTC" || data[i].symbol == "BAY/USDT")
          	$(".coin_price .bayLPrice p.price_track").text("").append( "<span>"  + data[i].lastPrice + " " + data[i].symbol + " (" + parseFloat(data[i].change24h).toFixed(1) + "%) </span>");
		  		
		  		if(data[i].symbol == "BAYR/BTC" || data[i].symbol == "BAYR/USDT")
		  			$(".coin_price .bayRPrice p.price_track").text("").append( "<span>"  + data[i].lastPrice + " " + data[i].symbol + " (" + parseFloat(data[i].change24h).toFixed(1) + "%) </span>");

          //$("#coin_price").append( "<p>"  + data[i].lastPrice + " " + data[i].symbol + " (" + parseFloat(data[i].change24h).toFixed(1) + "%) </p>");
          marketFound = 1;
        }
      }
    
    	console.log('marketFound: ', marketFound);
      //since market seems to be under maintenance mode get the latest prices from Latoken.
      if(!marketFound){

        coinjs.coinData(function(data){
        	//$(".coin_price p.price_track").text("");
          data = $.parseJSON(data);
          console.log('bay_usdt', data);
          $(".coin_price .bayLPrice p.price_track").html( "<span>"  + data.lastPrice + " " + data.symbol + " (" + parseFloat(data.change24h).toFixed(1) + "%) </span>");
        }, "bay_usdt");

        coinjs.coinData(function(data){
          data = $.parseJSON(data);
          console.log('bayr_usdt', data);
          $(".coin_price .bayRPrice p.price_track").html( "<span>"  + data.lastPrice + " " + data.symbol + " (" + parseFloat(data.change24h).toFixed(1) + "%) </span>");
        }, "bayr_usdt");
        
        //if(!$(".coinPrice > p span").hasClass("glyphicon-wrench"))
        	$(".coinPrice > p span").text("").html( ' <span class="glyphicon glyphicon-wrench"></span>').attr("data-original-title", "Sorry, it seems like market is under maintenance :/");
      }
      */
    });
  }
  
  function pegInfo(){
    coinjs.pegInfo(function(data){
			data = $.parseJSON(data);
			if (debug) {console.log('peginfo: ', data);}
      
      if(data.api_status=="success"){
        $(".currentPegIndex").text( data.result.peg );
        $(".nextPegIndex").text( "Next Peg index is " + data.result.pegnext + " and then " + data.result.pegnextnext);
        
        $(".pegCycleId").text(data.result.cycle );
        $(".pegCycle p").attr("data-original-title", "A total of " + data.result.cycle + " Peg cycles has occurred");
        
        if(data.result.pegnext > data.result.peg){
          $(".pegIndex h4").attr("data-original-title", "Peg-Index seems to increase lately...");
          $(".pegIndex h4 span.glyphicon:nth-child(3)").removeClass("glyphicon-arrow-down").addClass("glyphicon-arrow-up");
        }else if(data.result.pegnext == data.result.peg){
        
        $(".pegIndex h4").attr("data-original-title", "Peg-Index is unchanged");
          $(".pegIndex h4 span.glyphicon:nth-child(3)").removeClass("glyphicon-arrow-up").removeClass("glyphicon-arrow-down").addClass("glyphicon glyphicon-arrow-right");
        }else{
          $(".pegIndex h4").attr("data-original-title", "Peg-Index seems to decrease lately...");
          $(".pegIndex h4 span.glyphicon:nth-child(3)").removeClass("glyphicon-arrow-up").addClass("glyphicon-arrow-down");
        }
      }
    });
  }
  
	function walletBalance(){
		var tx = coinjs.transaction();
		$("#walletLoader").removeClass("hidden");
		coinjs.addressBalance($("#walletAddress").html(),function(data){
			data = $.parseJSON(data);
			if (debug) {console.log(data)};
		
			if(data.api_status=="success" && data.err != "Unknown address"){
				//var v = data.result.confirmed/("1e"+coinjs.decimalPlaces);
				
				
				var newBalance = parseFloat((data.result.amount*1./100000000.));
				var newLiquid = parseFloat((data.result.liquid*1./100000000.));
				var newReserve = parseFloat((data.result.reserve*1./100000000.));
				var newFrozen = parseFloat((data.result.frozen*1./100000000.));
				var balance = parseFloat($("#walletBalance").html());

				if(balance == newBalance){
				} else if ( newBalance <  balance) {
					PNotify_helper('New Withdraw', 'A withdrawal was made, new Balance: '+newBalance, 'error');
				} else if ( newBalance >  balance ){
					PNotify_helper('Balance', 'Your total balance is: '+newBalance+ ' '+coinjs.symbol, 'success');
				} else{
					PNotify_helper('Balance', 'Your current Balance is: '+newBalance, 'error');
				}
				$(".walletBalance").html(newBalance+" "+coinjs.symbol).attr('rel',newBalance).fadeOut().fadeIn();
				$(".topPanel .walletBalance").text("Balance ("+coinjs.symbol+"): " + newBalance).attr('rel',newBalance).fadeOut().fadeIn();
				$(".topPanel .glyphicon.glyphicon-log-out").removeClass("hide");
				$(".walletBalanceLiquid").html(newLiquid+" "+coinjs.symbol).attr('rel',newLiquid);
				$(".walletBalanceReserve").html(newReserve+" "+coinjs.symbol+'R').attr('rel',newReserve);
				$(".walletBalanceFrozen").html(newFrozen+" "+coinjs.symbol).attr('rel',newFrozen);
			} else {
				$(".walletBalance").html("0.00 "+coinjs.symbol).attr('rel','0.00').fadeOut().fadeIn();
				$(".walletBalanceLiquid").html("0.00 "+coinjs.symbol).attr('rel','0.00');
				$(".walletBalanceReserve").html("0.00 "+coinjs.symbol+'R').attr('rel','0.00');
				$(".walletBalanceFrozen").html("0.00 "+coinjs.symbol).attr('rel','0.00');
				PNotify_helper('Welcome!', 'Why not deposit some '+coinjs.symbol+'?', 'info');
				//Error getting API info
			}
			
			
			$("#walletLoader").addClass("hidden");
			if (debug) { console.log('pegBalanceData: ', pegBalanceData); }
			
			//Calc Balance in percent for Pie Chart, only when client has balance
			if(newBalance > 0) {
				document.getElementById("pieChart").classList.remove("hidden");
				
				pegBalanceData = [ 100*(newLiquid/newBalance), 100*(newReserve/newBalance), 100*(newFrozen/newBalance)];
				if (pegBalanceData[0]<=2 && pegBalanceData[0] != 0)	pegBalanceData[0] = 1;
				if (pegBalanceData[1]<=2 && pegBalanceData[1] != 0)	pegBalanceData[1] = 1;
				if (pegBalanceData[2]<=2 && pegBalanceData[2] != 0)	pegBalanceData[2] = 1;
				
				//Calc Amount and Percentage for Pie-chart
				pegBalanceDataAmountPercent = [ pegBalanceData[0], newLiquid, 100*(newLiquid/newBalance), 
				pegBalanceData[1], newReserve, 100*(newReserve/newBalance), 
				pegBalanceData[2], newFrozen, 100*(newFrozen/newBalance)];
				pegBalanceDataStr = "["+pegBalanceData[0]+", "+pegBalanceData[1]+", "+pegBalanceData[2]+"]";
				if (debug) { console.log('pegBalanceData2: ', pegBalanceData); }
				
				
				 $("#pieBalance").attr('data-values', pegBalanceDataStr);
				
				// update the Balance pieChart
				drawPieChart( document.getElementById('pieBalance'), pegBalanceDataAmountPercent );
				// The Pie Chart drawing
				//document.querySelectorAll(".pie-chart-CSS").forEach(piechart => drawPieChart(piechart));
			}else
				document.getElementById("pieChart").classList.add("hidden");

		});
	}

	function checkBalanceLoop(){
		setTimeout(function(){
			walletBalance();
			checkBalanceLoop();
      pegInfo();
      coinData();
		},200000);
	}

//START - Dynamic Pie Chart functions	
var pegPieColor = ["#2da5e0", "#f0c330", "#808080"];
var pegBalanceData = [0, 0, 0];
var pegBalanceDataAmountPercent;
var pegLabels = ["Liquid","Reserve","Frozen"];

function drawPieChart(piechart, pegBalanceData) {
  if (!piechart.dataset.values) return;

  let values = JSON.parse(piechart.dataset.values);
  //let colors = ["#2da5e0", "#f0c330", "#808080"];
  let colors = pegPieColor;
  let acum = 0,
    count = 0;

  let styles = values.map(
    segment => `${colors[count++ % colors.length]} 0 ${(acum += segment)}%`
  );
  piechart.style.background = `conic-gradient( ${styles.join(",")} )`;
	
	
	
	
	
	$(function(){
		$("#pieChart").drawPieChart([
			{ title: "Liquid",         value : pegBalanceData[0],  precisely: pegBalanceData[1], percent: pegBalanceData[2], color: "#2da5e0", ticker: coinjs.symbol },
			{ title: "Reserve", value:  pegBalanceData[3], precisely: pegBalanceData[4], percent: pegBalanceData[5],  color: "#f0c330", ticker: coinjs.symbolReserve },
			{ title: "Frozen",        value : pegBalanceData[6], precisely: pegBalanceData[7],  percent: pegBalanceData[8], color: "#808080", ticker: '' }
		]);
	});

/*!
 * jquery.drawPieChart.js
 * Version: 0.3(Beta)
 * Inspired by Chart.js(http://www.chartjs.org/)
 *
 * Copyright 2013 hiro
 * https://github.com/githiro/drawPieChart
 * Released under the MIT license.
 */
(function($, undefined) {
  $.fn.drawPieChart = function(data, options) {
    var $this = this,
      W = $this.width(),
      H = $this.height(),
      centerX = W/2,
      centerY = H/2,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      settings = $.extend({
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 1,
        baseColor: "#fff",
        baseOffset: 15,
        edgeOffset: 30,//offset from edge of $this
        pieSegmentGroupClass: "pieSegmentGroup",
        pieSegmentClass: "pieSegment",
        lightPiesOffset: 12,//lighten pie's width
        lightPiesOpacity: .3,//lighten pie's default opacity
        lightPieClass: "lightPie",
        animation : true,
        animationSteps : 90,
        animationEasing : "easeInOutExpo",
        tipOffsetX: -15,
        tipOffsetY: -45,
        tipClass: "pieTip",
        beforeDraw: function(){  },
        afterDrawed : function(){  },
        onPieMouseenter : function(e,data){  },
        onPieMouseleave : function(e,data){  },
        onPieClick : function(e,data){  }
      }, options),
      animationOptions = {
        linear : function (t){
          return t;
        },
        easeInOutExpo: function (t) {
          var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
          return (v>1) ? 1 : v;
        }
      },
      requestAnimFrame = function(){
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
      }();

		$this.html('');
		$(settings.tipClass).html('');
		$('.'+settings.tipClass).remove();
		
		
    var $wrapper = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this);
    var $groups = [],
        $pies = [],
        $lightPies = [],
        easingFunction = animationOptions[settings.animationEasing],
        pieRadius = Min([H/2,W/2]) - settings.edgeOffset,
        segmentTotal = 0;

    //Draw base circle
    var drawBasePie = function(){
      var base = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      var $base = $(base).appendTo($wrapper);
      base.setAttribute("cx", centerX);
      base.setAttribute("cy", centerY);
      base.setAttribute("r", pieRadius+settings.baseOffset);
      base.setAttribute("fill", settings.baseColor);
    }();

    //Set up pie segments wrapper
    var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var $pathGroup = $(pathGroup).appendTo($wrapper);
    $pathGroup[0].setAttribute("opacity",0);

    //Set up tooltip
    var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
      tipW = $tip.width(),
      tipH = $tip.height();

    for (var i = 0, len = data.length; i < len; i++){
      segmentTotal += data[i].value;
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute("data-order", i);
      g.setAttribute("class", settings.pieSegmentGroupClass);
      $groups[i] = $(g).appendTo($pathGroup);
      $groups[i]
        .on("mouseenter", pathMouseEnter)
        .on("mouseleave", pathMouseLeave)
        .on("mousemove", pathMouseMove)
        .on("click", pathClick);

      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute("stroke-width", settings.segmentStrokeWidth);
      p.setAttribute("stroke", settings.segmentStrokeColor);
      p.setAttribute("stroke-miterlimit", 2);
      p.setAttribute("fill", data[i].color);
      p.setAttribute("class", settings.pieSegmentClass);
      $pies[i] = $(p).appendTo($groups[i]);

      var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      lp.setAttribute("stroke-width", settings.segmentStrokeWidth);
      lp.setAttribute("stroke", settings.segmentStrokeColor);
      lp.setAttribute("stroke-miterlimit", 2);
      lp.setAttribute("fill", data[i].color);
      lp.setAttribute("opacity", settings.lightPiesOpacity);
      lp.setAttribute("class", settings.lightPieClass);
      $lightPies[i] = $(lp).appendTo($groups[i]);
    }

    settings.beforeDraw.call($this);
    //Animation start
    triggerAnimation();

    function pathMouseEnter(e){
      var index = $(this).data().order;
      $tip.html(data[index].title + ": (~" + parseFloat(data[index].percent).toFixed(3) + "%)<br>" + data[index].precisely + " " + data[index].ticker).fadeIn(200);
      if ($groups[index][0].getAttribute("data-active") !== "active"){
        $lightPies[index].animate({opacity: .8}, 180);
      }
      settings.onPieMouseenter.apply($(this),[e,data]);
    }
    function pathMouseLeave(e){
      var index = $(this).data().order;
      $tip.hide();
      if ($groups[index][0].getAttribute("data-active") !== "active"){
        $lightPies[index].animate({opacity: settings.lightPiesOpacity}, 100);
      }
      settings.onPieMouseleave.apply($(this),[e,data]);
    }
    function pathMouseMove(e){
      $tip.css({
        top: e.pageY + settings.tipOffsetY-15,
        left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
      });
    }
    function pathClick(e){
      var index = $(this).data().order;
      var targetGroup = $groups[index][0];
      for (var i = 0, len = data.length; i < len; i++){
        if (i === index) continue;
        $groups[i][0].setAttribute("data-active","");
        $lightPies[i].css({opacity: settings.lightPiesOpacity});
      }
      if (targetGroup.getAttribute("data-active") === "active"){
        targetGroup.setAttribute("data-active","");
        $lightPies[index].css({opacity: .8});
      } else {
        targetGroup.setAttribute("data-active","active");
        $lightPies[index].css({opacity: 1});
      }
      settings.onPieClick.apply($(this),[e,data]);
    }
    function drawPieSegments (animationDecimal){
      var startRadius = -PI/2,//-90 degree
          rotateAnimation = 1;
      if (settings.animation) {
        rotateAnimation = animationDecimal;//count up between0~1
      }

      $pathGroup[0].setAttribute("opacity",animationDecimal);

      //draw each path
      for (var i = 0, len = data.length; i < len; i++){
        var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (PI*2)),//start radian
            endRadius = startRadius + segmentAngle,
            largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
            startX = centerX + cos(startRadius) * pieRadius,
            startY = centerY + sin(startRadius) * pieRadius,
            endX = centerX + cos(endRadius) * pieRadius,
            endY = centerY + sin(endRadius) * pieRadius,
            startX2 = centerX + cos(startRadius) * (pieRadius + settings.lightPiesOffset),
            startY2 = centerY + sin(startRadius) * (pieRadius + settings.lightPiesOffset),
            endX2 = centerX + cos(endRadius) * (pieRadius + settings.lightPiesOffset),
            endY2 = centerY + sin(endRadius) * (pieRadius + settings.lightPiesOffset);
        var cmd = [
          'M', startX, startY,//Move pointer
          'A', pieRadius, pieRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
          'L', centerX, centerY,//Draw line to the center.
          'Z'//Cloth path
        ];
        var cmd2 = [
          'M', startX2, startY2,
          'A', pieRadius + settings.lightPiesOffset, pieRadius + settings.lightPiesOffset, 0, largeArc, 1, endX2, endY2,//Draw outer arc path
          'L', centerX, centerY,
          'Z'
        ];
        $pies[i][0].setAttribute("d",cmd.join(' '));
        $lightPies[i][0].setAttribute("d", cmd2.join(' '));
        startRadius += segmentAngle;
      }
    }

    var animFrameAmount = (settings.animation)? 1/settings.animationSteps : 1,//if settings.animationSteps is 10, animFrameAmount is 0.1
        animCount =(settings.animation)? 0 : 1;
    function triggerAnimation(){
      if (settings.animation) {
        requestAnimFrame(animationLoop);
      } else {
        drawPieSegments(1);
      }
    }
    function animationLoop(){
      animCount += animFrameAmount;//animCount start from 0, after "settings.animationSteps"-times executed, animCount reaches 1.
      drawPieSegments(easingFunction(animCount));
      if (animCount < 1){
        requestAnimFrame(arguments.callee);
      } else {
        settings.afterDrawed.call($this);
      }
    }
    function Max(arr){
      return Math.max.apply(null, arr);
    }
    function Min(arr){
      return Math.min.apply(null, arr);
    }
    return $this;
  };
})(jQuery);



}




//END - Dynamic Pie Chart functions	


	/* new -> address code */

	$("#newKeysBtn").click(function(){
		coinjs.compressed = false;
		if($("#newCompressed").is(":checked")){
			coinjs.compressed = true;
		}
		var s = ($("#newBrainwallet").is(":checked")) ? $("#brainwallet").val() : null;
		var coin = coinjs.newKeys(s);
		$("#newBitcoinAddress").val(coin.address);
		$("#newPubKey").val(coin.pubkey);
		$("#newPrivKey").val(coin.wif);

		/* encrypted key code */
		if((!$("#encryptKey").is(":checked")) || $("#aes256pass").val()==$("#aes256pass_confirm").val()){
			$("#aes256passStatus").addClass("hidden");
			if($("#encryptKey").is(":checked")){
				$("#aes256wifkey").removeClass("hidden");
			}
		} else {
			$("#aes256passStatus").removeClass("hidden");
		}

		$("#newPrivKeyEnc").val(CryptoJS.AES.encrypt(coin.wif, $("#aes256pass").val())+'');

	});

	$("#newBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#brainwallet").removeClass("hidden");
		} else {
			$("#brainwallet").addClass("hidden");
		}
	});

	$("#newSegWitBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#brainwalletSegWit").removeClass("hidden");
		} else {
			$("#brainwalletSegWit").addClass("hidden");
		}
	});

	$("#encryptKey").click(function(){
		if($(this).is(":checked")){
			$("#aes256passform").removeClass("hidden");
		} else {
			$("#aes256wifkey, #aes256passform, #aes256passStatus").addClass("hidden");
		}
	});

	/* new -> segwit code */
	$("#newSegWitKeysBtn").click(function(){
		var compressed = coinjs.compressed;
		coinjs.compressed = true;
		var s = ($("#newSegWitBrainwallet").is(":checked")) ? $("#brainwalletSegWit").val() : null;
		var coin = coinjs.newKeys(s);
		var sw = coinjs.segwitAddress(coin.pubkey);
		$("#newSegWitAddress").val(sw.address);
		$("#newSegWitRedeemScript").val(sw.redeemscript);
		$("#newSegWitPubKey").val(coin.pubkey);
		$("#newSegWitPrivKey").val(coin.wif);
		coinjs.compressed = compressed;
	});


	/* new -> multisig code */

	$("#newMultiSigAddress").click(function(){

		$("#multiSigData").removeClass('show').addClass("hidden").fadeOut();
		$("#multisigPubKeys .pubkey").parent().removeClass('has-error');
		$("#releaseCoins").parent().removeClass('has-error');
		$("#multiSigErrorMsg").hide();

		if((isNaN($("#releaseCoins option:selected").html())) || ((!isNaN($("#releaseCoins option:selected").html())) && ($("#releaseCoins option:selected").html()>$("#multisigPubKeys .pubkey").length || $("#releaseCoins option:selected").html()*1<=0 || $("#releaseCoins option:selected").html()*1>8))){
			$("#releaseCoins").parent().addClass('has-error');
			$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Minimum signatures required is greater than the amount of public keys provided').fadeIn();
			return false;
		}

		var keys = [];
		$.each($("#multisigPubKeys .pubkey"), function(i,o){
			if(coinjs.pubkeydecompress($(o).val())){
				keys.push($(o).val());
				$(o).parent().removeClass('has-error');
			} else {
				$(o).parent().addClass('has-error');
			}
		});

		if(($("#multisigPubKeys .pubkey").parent().hasClass('has-error')==false) && $("#releaseCoins").parent().hasClass('has-error')==false){
			var sigsNeeded = $("#releaseCoins option:selected").html();
			var multisig =  coinjs.pubkeys2MultisigAddress(keys, sigsNeeded);
			$("#multiSigData .address").val(multisig['address']);
			$("#multiSigData .script").val(multisig['redeemScript']);
			$("#multiSigData .scriptUrl").val(document.location.origin+''+document.location.pathname+'?verify='+multisig['redeemScript']+'#verify');
			$("#multiSigData").removeClass("hidden").addClass('show').fadeIn();
			$("#releaseCoins").removeClass('has-error');
		} else {
			$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> One or more public key is invalid!').fadeIn();
		}
	});

	$("#multisigPubKeys .pubkeyAdd").click(function(){
		if($("#multisigPubKeys .pubkeyRemove").length<14){
			var clone = '<div class="form-horizontal">'+$(this).parent().html()+'</div>';
			$("#multisigPubKeys").append(clone);
			$("#multisigPubKeys .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
			$("#multisigPubKeys .glyphicon-minus:last").parent().removeClass('pubkeyAdd').addClass('pubkeyRemove');
			$("#multisigPubKeys .pubkeyRemove").unbind("");
			$("#multisigPubKeys .pubkeyRemove").click(function(){
				$(this).parent().fadeOut().remove();
			});
		}
	});

	$("#mediatorList").change(function(){
		var data = ($(this).val()).split(";");
		$("#mediatorPubkey").val(data[0]);
		$("#mediatorEmail").val(data[1]);
		$("#mediatorFee").val(data[2]);
	}).change();

	$("#mediatorAddKey").click(function(){
		var count = 0;
		var len = $(".pubkeyRemove").length;
		if(len<14){
			$.each($("#multisigPubKeys .pubkey"),function(i,o){
				if($(o).val()==''){
					$(o).val($("#mediatorPubkey").val()).fadeOut().fadeIn();
					$("#mediatorClose").click();
					return false;
				} else if(count==len){
					$("#multisigPubKeys .pubkeyAdd").click();
					$("#mediatorAddKey").click();
					return false;
				}
				count++;
			});

			$("#mediatorClose").click();
		}
	});

	/* new -> time locked code */

	$('#timeLockedDateTimePicker').datetimepicker({
		format: "MM/DD/YYYY HH:mm",
	});
	
	$('#timeLockedRbTypeBox input').change(function(){
		if ($('#timeLockedRbTypeDate').is(':checked')){
			$('#timeLockedDateTimePicker').show();
			$('#timeLockedBlockHeight').hide();
		} else {
			$('#timeLockedDateTimePicker').hide();
			$('#timeLockedBlockHeight').removeClass("hidden").show();
		}
	});

	//BUG-time
	function getUnixTimeNowWithTimezoneOffset(){
		//var d = Date();
		//console.log(date);
		var offset = new Date().getTimezoneOffset();//minutes
		if (debug) {
			console.log(offset);
		}
		//var offset = (-1) * offset * 60000;		//milliseconds
		//console.log(offset);
		//return Math.round(new Date(date + offset).getTime() / 1000);
	}
	function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
	}
	function convertDateToUTC(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
	}
	function dateTimePickerToUTCUnix(input) {
		//get date from datepicker
		var date = new Date($(input).val());
    //get Date as UTC
		var dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
		//get unix time
		return dateUTC.getTime() / 1000; 
	}
	
    $("#newTimeLockedAddress").click(function(){

        $("#timeLockedData").removeClass('show').addClass("hidden").fadeOut();
        $("#timeLockedPubKey").parent().removeClass('has-error');
        $("#timeLockedDateTimePicker").parent().removeClass('has-error');
        $("#timeLockedErrorMsg").hide();

        if(!coinjs.pubkeydecompress($("#timeLockedPubKey").val())) {
        	$('#timeLockedPubKey').parent().addClass('has-error');
        }

        var nLockTime = -1;

        if ($('#timeLockedRbTypeDate').is(':checked')){
        	// by date
					var date = $('#timeLockedDateTimePicker').data("DateTimePicker").date();
	        if(!date || !date.isValid()) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        }
	        nLockTime = date.unix();
					//BUG-time GIORGOSK descrepancy with UTC time becoming local time
					nLockTime2 = dateTimePickerToUTCUnix('#timeLockedDateTimePicker input');
	        if (nLockTime < 500000000) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        }
        } else {
					nLockTime = parseInt($('#timeLockedBlockHeightVal').val(), 10);
	        if (nLockTime >= 500000000) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        }
        }

        if(($("#timeLockedPubKey").parent().hasClass('has-error')==false) && $("#timeLockedDateTimePicker").parent().hasClass('has-error')==false){
        	try {
	            var hodl = coinjs.simpleHodlAddress($("#timeLockedPubKey").val(), nLockTime);
	            $("#timeLockedData .address").val(hodl['address']);
	            $("#timeLockedData .script").val(hodl['redeemScript']);
	            $("#timeLockedData .scriptUrl").val(document.location.origin+''+document.location.pathname+'?verify='+hodl['redeemScript']+'#verify');
	            $("#timeLockedData").removeClass("hidden").addClass('show').fadeIn();
	        } catch(e) {
	        	$("#timeLockedErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> ' + e).fadeIn();
	        }
        } else {
            $("#timeLockedErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Public key and/or date is invalid!').fadeIn();
        }
    });

	/* new -> Hd address code */

	$(".deriveHDbtn").click(function(){
		$("#verifyScript").val($("input[type='text']",$(this).parent().parent()).val());
		window.location = "#verify";
		$("#verifyBtn").click();
	});

	$("#newHDKeysBtn").click(function(){
		coinjs.compressed = true;
		var s = ($("#newHDBrainwallet").is(":checked")) ? $("#HDBrainwallet").val() : null;
		var hd = coinjs.hd();
		var pair = hd.master(s);
		$("#newHDxpub").val(pair.pubkey);
		$("#newHDxprv").val(pair.privkey);

	});

	$("#newHDBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#HDBrainwallet").removeClass("hidden");
		} else {
			$("#HDBrainwallet").addClass("hidden");
		}
	});

	
	/* new -> Mnemonic address code */

	$("#newMnemonicGenerate").click(function(){
		$("#newMnemonicxpub").val("");
		$("#newMnemonicxprv").val("");
		var s = bip39.generateMnemonic((24/3)*32);	//24 mnemonic words!
		$("#newMnemonicWords").val(s);
		$("#newMnemonicWords").parent().removeClass("has-warning").removeAttr('title').attr('title', '').attr("data-original-title", '');
	});

	$("#newMnemonicKeysBtn").click(function(){

		//console.log('checked? ', $("#newMnemonicBrainwalletCheck").is(":checked"));
		coinjs.compressed = true;
		var s  = $("#newMnemonicWords").val();	//seed

		//validate bip39 mnemonic
		if(!bip39.validate(s)){
        $("#newMnemonicxpub").val("");
				$("#newMnemonicxprv").val("");
        $("#newMnemonicWords").parent().addClass("has-warning").attr('title', 'Incorrect BIP39 Phrase').attr("data-original-title", 'Incorrect BIP39 Phrase').tooltip();


        return ;
		} else {
			$("#newMnemonicWords").parent().removeClass("has-warning").removeAttr('title');

			$("#newMnemonicWords .tooltip").remove();
    //$("#walletSpendTo .addressRemove").find(".tooltip").remove().unbind("");
		}


		var p  = ($("#newMnemonicBrainwalletCheck").is(":checked")) ? $("#MnemonicBrainwallet").val() : null;	//user pass

		var hd = coinjs.hd();
		var pair = hd.masterMnemonic(s, p);
		$("#newMnemonicxpub").val(pair.pubkey).fadeIn();
		$("#newMnemonicxprv").val(pair.privkey).fadeIn();
		
	});

	$("#newMnemonicBrainwalletCheck").click(function(){
		if($(this).is(":checked")){
			$("#MnemonicBrainwallet").removeClass("hidden");
			$("#MnemonicBrainwallet").next().removeClass("hidden")

		} else {
			$("#MnemonicBrainwallet").addClass("hidden");
			$("#MnemonicBrainwallet").next().addClass("hidden")
		}
	});

	

	

	/* new -> transaction code */
	$("#recipients .addressAddTo").click(function(){

		if($("#recipients .addressRemoveTo").length<199){
			console.log('addressAddTo clicked');

			var clone = '<div class="row recipient"><br>'+$(this).parent().parent().html()+'</div>';
			$("#recipients").append(clone);
			$("#recipients .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
			$("#recipients .glyphicon-minus:last").parent().removeClass('addressAdd').addClass('addressRemoveTo');
			$("#recipients .addressRemoveTo").unbind("");
			$("#recipients .addressRemoveTo").click(function(){
				$(this).parent().parent().fadeOut().remove();
				validateOutputAmount();
			});
			validateOutputAmount();
		}
	});
	
	//bind select box for moving Liquid/Reserve
/*	
	$("#inputs .txIdMoveType").on('change', function() {
		if ($(this).val() == 'liquid'){
			alert("liquid");
		} else {
			alert("reserve");
		}
	});
*/

	//Manual Transactions: check for changes in the oN input/destination output index
	//if oN is changed, either add to Output tab or remove/(change?) from Output tab
	$(document).on("change", '.txIdoN', function(e){
      
      //$("#result").text(n + ':  '+$(this).val());
      
      var oNvalue = parseInt($(this).val());
      console.log('===============================================');

      console.log('oNvalue: ', oNvalue);

      //we should have blank outputs prior to the oN
      //also we should set the index relative to the chosen value of oN!

      //count total outputs
      /*var total_outputs = 0;
      $("#txoutputs #recipients > .row.recipient").each(function(){
      	total_outputs++;
      });
      */

  		var thisRow =  $(this).parent().parent();
			var thisRowParent =  thisRow.parent();
			var changedTxInputRow = parseInt(thisRowParent.index());


			console.log('thisRow', thisRow);
			console.log('thisRowParent', thisRowParent);
			console.log('thisRowParent.index', changedTxInputRow);	//get rowIndex!




			var oNhasError = false;


			if(!isNaN(oNvalue)) {	//we only want numbers for oN!
				//validate the oNs destination so it is not busy
				//check if the stored the value in object is busy as well!
				//if (changedTxInputRow == oNvalue || coinjs.mTransactionoNList[oNvalue] !== undefined || (Object.values(coinjs.mTransactionoNList).indexOf(changedTxInputRow) > -1) || (Object.values(coinjs.mTransactionoNList).indexOf(oNvalue) > -1)){
				
				//if (changedTxInputRow == oNvalue || (Object.values(coinjs.mTransactionoNList).indexOf(changedTxInputRow) > -1) || (Object.values(coinjs.mTransactionoNList).indexOf(oNvalue) > -1) || coinjs.mTransactionoNList.hasOwnProperty(oNvalue)){
					if (changedTxInputRow == oNvalue || (Object.values(coinjs.mTransactionoNList).indexOf(changedTxInputRow) > -1) ){

					console.log('oN is busy, please try another oN index!');
					thisRowParent.addClass('has-error');
					
					//PNotify_helper('oN index Error!', 'oN index cannot be the same as input index (it is used by F-notations)!', 'error');
					
					PNotify_helper('oN index Error!', 'oN is busy, please choose another Output index!', 'error');
					oNhasError = true;
				} else {
					//all good, we have validated so no key nor value inputs exists in the object for the upcoming Outputs
					//set the oN to our manualTransactions array (mTransactionoNList)
					coinjs.mTransactionoNList[changedTxInputRow] = oNvalue;
					thisRowParent.removeClass('has-error');
				}

				//coinjs.mTransactionoNList[changedTxInputRow] = oNvalue;
			}


			
			
			if(debug)
				console.log('coinjs.mTransactionoNList', coinjs.mTransactionoNList);

			//get last key name/highest number!
			lastKey = Object.keys(coinjs.mTransactionoNList)[Object.keys(coinjs.mTransactionoNList).length-1];
			console.log('lastKey = ', lastKey);

			//if(!thisRowParent.hasClass('has-error')) {
			if(!oNhasError ) {
			//if(!oNhasError && (lastKey !== undefined) ) {
				/*if (Object.values(coinjs.mTransactionoNList).indexOf(changedTxInputRow) > -1)
					console.log('oN is busy, please try another oN index!');*/

				
				console.log('oNhasError: ', oNhasError);

				

	      //TODO
	      //1. Clear all Outputs, and remove its rows except for the first row!
	      //2. Loop through the Outputs and add the oN's to the desired input (Inputs Tab),
	      // blank outputs should only exist between the desired oN's, with any amount and address!

	      //1. Clear all Outputs, and remove its rows except for the first row! - DONE!
	      		//somehow this doesnt work, does these three lines belows need new binding?
				/*
				$("#txoutputs #recipients .row.recipient").not(':first').remove();	//doesnt work
				$("#txoutputs .row.recipient:first input").val('');	//doesnt work
				$("#txoutputs .row.recipient .input-group").removeClass('has-error');	//doesnt work
				*/
				validateOutputAmount();



				//2. Loop through the Outputs and add the oN's (in the Output tab) to the desired input (Inputs Tab),
	      	// blank outputs should only exist between the desired oN's, with any amount and address! - NOT FINISHED!
				

      

				//create an array with blank values as well as add oN's(TX destination) instructions
				var iOnIndex = 0;
				
				$('#txoutputs #recipients .row.recipient:not(:first)' ).remove();
				//$('#txoutputs #recipients').children( '.row.recipient:not(:first)' ).remove();
				for (iOnIndex=0; iOnIndex<= lastKey; iOnIndex++) {
					

					var clone = '<div class="row recipient"><br>'+$('#recipients > .row.recipient').html()+'</div>';
					$("#recipients").append(clone);

					//$('#txoutputs #recipients').children().first().remove();

					$("#recipients .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
					$("#recipients .glyphicon-minus:last").parent().removeClass('addressAdd').addClass('addressRemoveTo');
					$("#recipients .addressRemoveTo").unbind("");
					$("#recipients .addressRemoveTo").click(function(){
						$(this).parent().parent().fadeOut().remove();
						validateOutputAmount();
					});



					// Check for the keys, add to output if oN is found
					if (coinjs.mTransactionoNList.hasOwnProperty(iOnIndex)) {
						console.log('add oN to output i = ', iOnIndex);
						console.log('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input');

						//get the oN index from the saved variable!
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input.address').val('6a **F** '+coinjs.mTransactionoNList[iOnIndex]);
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input.amount').val(coinjs.burn_fee);
						//$('#txoutputs .row.recipient:nth-child('+(i+1)+') input.amount').val(coinjs.cachedInputs[i].oreserve);
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input').attr('disabled', true);


						
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button.qrcodeScanner').attr('disabled', true);
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button').removeAttr('data-target');
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button').removeAttr('data-toggle');
						

						
						
						//$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input').attr('title', 'Contains F-notations (instructions) which you have made in the Inputs tab ('+(iOnIndex)+')');

						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button').removeClass('qrcodeScanner');
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button span').removeClass('glyphicon-camera').addClass('glyphicon-transfer');




					}else {
						//oN destination is empty, add blank inputs
						console.log('add blank output i = ', iOnIndex);

						//$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input.address').val('');
						//$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input.amount').val();
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') input').val('').attr('disabled', false);
						//$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button.qrcodeScanner').attr('disabled', false);
						$('#txoutputs .row.recipient:nth-child('+(iOnIndex+1)+') button span.glyphicon-transfer').attr('disabled', false).addClass('qrcodeScanner');
						

					}
				}
				
				if( $('#txoutputs #recipients').last().length > 1 ){
					//$('#txoutputs #recipients').children().last().remove();
					console.log('there are more outputs!');
				}else {
					
					

					//"reset and clear the output tabs!""
					console.log('this is the last output!');
					if(typeof lastKey ===  'undefined') {
						console.log('//if there is no oN destinations left after a selectbox "change" (to Liquid) , just clear the input fields in the output tabs!');
						$('#txoutputs .row.recipient input').val('').attr('disabled', false).removeAttr('title');

						$('#txoutputs .row.recipient button span').removeClass('glyphicon-transfer').addClass('glyphicon-camera');
						$('#txoutputs .row.recipient button').attr('disabled', false);

						$('#txoutputs .row.recipient button').attr('data-target', '#modalQrcodeScanner');
						$('#txoutputs .row.recipient button').attr('data-toggle', 'modal');


						
					}else
						console.log('type is not undefined!');
				}

				console.log('outputs indexes count: ', $('#txoutputs #recipients').last().length);

				validateOutputAmount();
				

				//add extra input indexes for "higher" oN values
				var maxInputoNIndex = Object.values(coinjs.mTransactionoNList);
				for (i=iOnIndex; i<= Math.max(...maxInputoNIndex); i++) {
					var clone = '<div class="row recipient"><br>'+$('#recipients > .row.recipient').html()+'</div>';
					$("#recipients").append(clone);

					//$('#txoutputs #recipients').children().first().remove();
					$('#recipients .row.recipient:nth-child('+(i+1)+') input').attr('disabled', false);

					$("#recipients .row.recipient .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
					$("#recipients .row.recipient .glyphicon-minus:last").parent().removeClass('addressAdd').addClass('addressRemoveTo');
					$("#recipients .row.recipient .addressRemoveTo").unbind("");
					$("#recipients .row.recipient .addressRemoveTo").click(function(){
						$(this).parent().parent().fadeOut().remove();
						validateOutputAmount();
					});

					console.log('"higher oN values added"');
				}


				//keep tracking of same oId data
				var oIdsumReserve = 0;
				var maxAmountofReserveToSend;

				//add data to input fields for max amount of Reserve to send
				for (var [key, value] of Object.entries(coinjs.mTransactionoNList)) {
				  maxAmountofReserveToSend = 0;

				  //sum up same oId Reserve amount
				  for (var [key2, value2] of Object.entries(coinjs.mTransactionoNList)) {
					  console.log('key: ', key2);
					  console.log('value: ', value2);
					  if(value == value2)
					  	maxAmountofReserveToSend = maxAmountofReserveToSend + coinjs.cachedInputs[key2].oreserve;
					}

				  //maxAmountofReserveToSend = coinjs.cachedInputs[key].oreserve;
				  $('#txoutputs .row.recipient:nth-child('+(value+1)+') .input-group').addClass('has-warning');
				  $('#txoutputs .row.recipient:nth-child('+(value+1)+') input.amount').attr('max-amount', maxAmountofReserveToSend);
				  $('#txoutputs .row.recipient:nth-child('+(value+1)+') input.amount').attr('title', 'Max amount of Reserve to send: '+maxAmountofReserveToSend);

				  $('#txoutputs .row.recipient:nth-child('+(value+1)+') input.address').attr('title', 'Contains F-notations (instructions: OI['+key+'] -> OI['+value+']) which you have made in the Inputs tab ('+(key)+')');

					$('#txoutputs .row.recipient:nth-child('+(value+1)+') button').attr('disabled', false).addClass('qrcodeScanner');
					$('#txoutputs .row.recipient:nth-child('+(value+1)+') button span').removeClass('glyphicon-transfer').addClass('glyphicon-camera');

					$('#txoutputs .row.recipient:nth-child('+(value+1)+') button').attr('data-target', '#modalQrcodeScanner');
						$('#txoutputs .row.recipient:nth-child('+(value+1)+') button').attr('data-toggle', 'modal');


				  //$('#txoutputs .row.recipient:nth-child('+(value+1)+') button span.glyphicon-transfer').attr('disabled', false).addClass('qrcodeScanner');



				  console.log(`Output: ${key} -> goes to input index: ${value}`);
				}

				//enable last input, somehow it is disabled only if the oN in the first input index is changed.
				$("#txoutputs #recipients .row.recipient:last input").attr('disabled',false);
			}



/*
      //check if we have enough of outputs
      if(oNvalue <= total_outputs){

      }else {
      	}
      	//create new rows until we are desired!
      	//$("#recipients .addressAddTo").click();
      	

      	var clone = '<div class="row recipient"><br>'+$('#recipients > .row.recipient').html()+'</div>';
				$("#recipients").append(clone);

				//$('#txoutputs #recipients').children().first().remove();

				$("#recipients .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
				$("#recipients .glyphicon-minus:last").parent().removeClass('addressAdd').addClass('addressRemoveTo');
				$("#recipients .addressRemoveTo").unbind("");
				$("#recipients .addressRemoveTo").click(function(){
					$(this).parent().parent().fadeOut().remove();
					validateOutputAmount();
				});
				validateOutputAmount();
				
				//make it short script like (OP_RETURN) 6a**F**3 
			//6a means burn!, So it goes 6a followed by bytes to push to stack follow by hex of what you want. all in HEX, 2 chars represents a char!

				//--> BUT when reserve outputs are broken up we need longer script, like burning from input holding 100k to multiple outputs like 20k
			$("#recipients .address:last").val('(OP_RETURN) 6a **F**'+$(this).val());
			$("#recipients .amount:last").val(coinjs.burn_fee);

			$('#recipients .row.recipient:last input').attr('disabled', true).attr('title', 'Locked for sending Reserve to specific Output!');

			$('#recipients .row.recipient:last .qrcodeScanner').attr('disabled', true);
			*/


      
      
      

			

    });

	//Manual Transactions: bind select box for moving Liquid/Reserve
	$(document).on('change', '#inputs select.txIdMoveType', function(e) {
		var thisRow =  $(this).parent().parent();
		var thisRowParent =  thisRow.parent();
		
		console.log('===============================================');
		console.log('selectbox thisRow', thisRow);
		console.log('selectbox thisRowParent', thisRowParent);
		console.log('selectbox thisRowParent.index', thisRowParent.index());	//get rowIndex!
		console.log('selectbox parent txId', thisRowParent.find('.txId').val());



		if ($(this).val() == 'liquid'){
			
			if (coinjs.mTransactionoNList.hasOwnProperty(thisRowParent.index()))
				delete coinjs.mTransactionoNList[thisRowParent.index()];
			if(debug){
				console.log('selectbox Liquid -> coinjs.mTransactionoNList: ', coinjs.mTransactionoNList);
			}

			//disable oN when sending Liquid
			thisRow.find(".txIdoN").val('').trigger( "change" );
			thisRow.find(".txIdoN").attr('disabled', true).removeAttr('title');
			thisRowParent.removeClass('has-error');
		} else {
			
			//oN is only needed when sending reserve
			//enable oN, for destination output 
			 thisRow.find(".txIdoN").attr('disabled', false).attr('title', 'Destination Index in Output is necessary!');
		}
	});

	$("#txinputs .txidAdd").click(function(){
		
		//var clone = '<div class="row inputs">'+$(this).parent().parent().parent().html()+'</div>';
		var clone = '<div class="row inputs">'+$('#inputs .row.inputs:nth-child(1)').html()+'</div>';
		$("#inputs").append(clone);
		
		
		//$("#inputs .txidClear:last").remove();
		//$("#inputs .row:last div:last").append('<a href="javascript:;" class="txidClear" title="Remove TXid input" ><span class="glyphicon glyphicon-minus"></span></a>');

		//$("#inputs .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
		$("#inputs .glyphicon-minus:last").parent().removeClass('txidClear').addClass('txidRemove').attr("title", "Remove TXid input");

		//$("#inputs .glyphicon-plus:last").addClass('hidden');
		//$("#inputs .glyphicon-minus:last").parent().removeClass('txidAdd').addClass('txidRemove').attr("title", "Remove TXid input");

		$("#inputs .tooltip:last").remove();
		$("#inputs .txidRemove").click(function(){
			$(this).parent().parent().parent().fadeOut().remove();
			totalInputAmount();
		});
		$("#inputs .row:last input").attr('disabled',false);

		$("#inputs .row:last .txIdoN").attr('disabled', true);
		
		//hide and unbind the old tooltips, bind the new one
		$('#inputs .txidRemove').tooltip();

		$("#inputs .txIdAmount").unbind("").change(function(){
			totalInputAmount();
		}).keyup(function(){
			totalInputAmount();
		});

	

	});

	$("#transactionBtn").click(function(){
		var tx = coinjs.transaction();
		var estimatedTxSize = 10; // <4:version><1:txInCount><1:txOutCount><4:nLockTime>

		$("#transactionCreate, #transactionCreateStatus").addClass("hidden");

		if(($("#nLockTime").val()).match(/^[0-9]+$/g)){
			tx.lock_time = $("#nLockTime").val()*1;
			//console.log(tx.lock_time);
		}

		if(($("#nTime").val()).match(/^[0-9]+$/g)){
			//BUG-time transaction time taken when creating transaction
			tx.nTime = $("#nTime").val()*1;
		}
		
		$("#inputs .row").removeClass('has-error');

		$('#putTabs a[href="#txinputs"], #putTabs a[href="#txoutputs"]').attr('style','');

		$.each($("#inputs .row"), function(i,o){
			if(!($(".txId",o).val()).match(/^[a-f0-9]+$/i)){
				$(o).addClass("has-error");
			} else if((!($(".txIdScript",o).val()).match(/^[a-f0-9]+$/i)) && $(".txIdScript",o).val()!=""){
				$(o).addClass("has-error");
			} else if (!($(".txIdN",o).val()).match(/^[0-9]+$/i)){
				$(o).addClass("has-error");
			}

			if(!$(o).hasClass("has-error")){
				var seq = null;
				/*if($("#txRBF").is(":checked")){
					seq = 0xffffffff-2;
				}
				*/

				var currentScript = $(".txIdScript",o).val();
				if (currentScript.match(/^76a914[0-9a-f]{40}88ac$/)) {
					estimatedTxSize += 147
				} else if (currentScript.match(/^5[1-9a-f](?:210[23][0-9a-f]{64}){1,15}5[1-9a-f]ae$/)) {
					// <74:persig <1:push><72:sig><1:sighash> ><34:perpubkey <1:push><33:pubkey> > <32:prevhash><4:index><4:nSequence><1:m><1:n><1:OP>
					var scriptSigSize = (parseInt(currentScript.slice(1,2),16) * 74) + (parseInt(currentScript.slice(-3,-2),16) * 34) + 43
					// varint 2 bytes if scriptSig is > 252
					estimatedTxSize += scriptSigSize + (scriptSigSize > 252 ? 2 : 1)
				} else {
					// underestimating won't hurt. Just showing a warning window anyways.
					estimatedTxSize += 147
				}

				tx.addinput($(".txId",o).val(), $(".txIdN",o).val(), $(".txIdScript",o).val(), seq);
			} else {
				$('#putTabs a[href="#txinputs"]').attr('style','color:#a94442;');
			}
		});

		$("#recipients .row").removeClass('has-error');

		$.each($("#recipients .row"), function(i,o){
			var a = ($(".address",o).val());
			var ad = coinjs.addressDecode(a);
			if(((a!="") && (ad.version == coinjs.pub || ad.version == coinjs.multisig)) && $(".amount",o).val()!=""){ // address
				// P2SH output is 32, P2PKH is 34
				estimatedTxSize += (ad.version == coinjs.pub ? 34 : 32)
				tx.addoutput(a, $(".amount",o).val());
			} else if (((a!="") && ad.version === 42) && $(".amount",o).val()!=""){ // stealth address
				// 1 P2PKH and 1 OP_RETURN with 36 bytes, OP byte, and 8 byte value
				estimatedTxSize += 78
				tx.addstealth(ad, $(".amount",o).val());
			} else if (((($("#opReturn").is(":checked")) && a.match(/^[a-f0-9]+$/ig)) && a.length<160) && (a.length%2)==0) { // data
				estimatedTxSize += (a.length / 2) + 1 + 8
				tx.adddata(a);
			} else if(a.indexOf("**F**") !== -1 || a.indexOf("6a") !== -1) {	//allow F-notations for manual transactions

						/*
						var fnotereplace = a.replace('6a','');
						fnotereplace = fnotereplace.replace('**F**','').trim();
						
						var out_indexes = String(fnotereplace.trim());
						console.log('out_indexes: ', out_indexes);

						//var fnote = "6a **F**"+out_indexes;
						var fnote = "**F**"+out_indexes;
						*/
						
						console.log('a:', a);
						var getoN = a.split(" ");
						console.log('getoN: ', getoN);

						getoN[2].replace(/\s/g, '');

						var fnote = "**F**"+String(getoN[2]);
						/*
						var fnote = a;
						fnote = fnote.replace(/\s/g, '');
						*/
						var fnote = "**F**"+String(getoN[2]);
						var fnoteb = Crypto.charenc.UTF8.stringToBytes(fnote);
						if (debug) {
							console.log("fnote:" + fnote);
							console.log("fnotehex:" + Crypto.util.bytesToHex(fnoteb));
						}

						tx.adddata(Crypto.util.bytesToHex(fnoteb), 5590);


						/*
						var fnote = "**F**"+out_indexes;
						var fnoteb = Crypto.charenc.UTF8.stringToBytes(fnote);
						if (debug) {
							console.log("fnote:" + fnote);
							console.log("fnotehex:" + Crypto.util.bytesToHex(fnoteb));
						}
						tx.adddata(Crypto.util.bytesToHex(fnoteb), 5590);
						*/


			} else { // neither address nor data
				$(o).addClass('has-error');
				$('#putTabs a[href="#txoutputs"]').attr('style','color:#a94442;');
			}
		});

		//check if the Reserve (oNs) has covered all the amount, if not add it as an extra output and give the user a notification about it!


		if(Object.keys(coinjs.mTransactionoNList).length){

			console.log('coinjs.mTransactionoNList.length: ', Object.keys(coinjs.mTransactionoNList).length);
			var sumReserveToSend = 0;
			var getRemainingReserveToSendBackAsChange;
		
			for (var [key, value] of Object.entries(coinjs.mTransactionoNList)) {
			  
			  $('#recipients .row.recipient:nth-child('+(value+1)+') .input-group').addClass('has-success');
			  getRemainingReserveToSendBackAsChange = $('#recipients .row.recipient:nth-child('+(value+1)+')  input.amount').val();
			  getRemainingReserveToSendBackAsChange = getRemainingReserveToSendBackAsChange
			  

			  //if Reserve to send is lesser, sum them all up and add as an extra output
			  if(getRemainingReserveToSendBackAsChange < coinjs.cachedInputs[key].oreserve) {
			  	sumReserveToSend += ( coinjs.cachedInputs[key].oreserve - getRemainingReserveToSendBackAsChange);
					if (debug) {
			  		console.log('Inputs (' + key + ') Reserve amount left: '+ coinjs.cachedInputs[key].oreserve + ', user wants to send: ' +parseFloat(coinjs.cachedInputs[key].oreserve - getRemainingReserveToSendBackAsChange).toFixed(8));
			  	}
			  }
			}

			//add an extra output and send it back to the user as change back
			if(sumReserveToSend){

				//var userAddress = $('#redeemFrom').val();
				var userAddress = $('#redeemFromAddress a').text();

				sumReserveToSend = parseFloat(sumReserveToSend).toFixed(8);

				if (debug) {
					console.log('Reserve Change back to the user is: ', sumReserveToSend);
				}


				if(!$("#recipients .row").hasClass('send-back-reserve-as-change')){
					var clone = '<div class="row recipient send-back-reserve-as-change"><br>'+$('#recipients > .row.recipient').html()+'</div>';
					$("#recipients").append(clone);
				}

				

				$('#recipients .row.recipient.send-back-reserve-as-change .input-group').addClass('has-warning').attr('title', 'Change back to the user');;
				$('#recipients .row.recipient.send-back-reserve-as-change input.address').val(userAddress);

				//if the user edits the change back amount of reserve, then dont touch it!				
				if (!$('#recipients .row.recipient.send-back-reserve-as-change input.amount').val())
					$('#recipients .row.recipient.send-back-reserve-as-change input.amount').val(sumReserveToSend);

				$('#recipients .row.recipient.send-back-reserve-as-change button').removeClass('qrcodeScanner');
				$('#recipients .row.recipient.send-back-reserve-as-change button span').removeClass('glyphicon-camera').addClass('glyphicon-lock').attr('disabled', true);

				$('#recipients .row.recipient.send-back-reserve-as-change input').attr('title', 'Change back to the user!');

				$('#recipients .row.recipient.send-back-reserve-as-change input').attr('disabled', false);
				$('#recipients .row.recipient.send-back-reserve-as-change button').attr('disabled', true);
				


				$("#recipients .row.recipient.send-back-reserve-as-change .glyphicon-plus").removeClass('glyphicon-plus').addClass('glyphicon-minus');
				$("#recipients .row.recipient.send-back-reserve-as-change .glyphicon-minus").parent().removeClass('addressAdd').addClass('addressRemoveTo');
				$("#recipients .addressRemoveTo").unbind("");
				$("#recipients .addressRemoveTo").click(function(){
					$(this).parent().parent().fadeOut().remove();
					validateOutputAmount();
				});

				validateOutputAmount();
			}else
				$('#recipients .row.recipient.send-back-reserve-as-change').remove();
		}


		//give a warning about low transaction fees, should not be below 0.002
		if($("#transactionFee").val()<0.002){
			$("#transactionCreateStatus").removeClass("hidden").html("<p>ERROR: You are advised to adjust the amount(s) so that a transaction fee is 0.002 or greater, otherwise the transcation might be rejected by the network</p>").fadeOut().fadeIn();
		}else {

			if(!$("#recipients .row, #inputs .row").hasClass('has-error')){
				$("#transactionCreate textarea").val(tx.serialize());
				$("#transactionCreate .txSize").html(tx.size());

				$("#transactionCreate").removeClass("hidden");

				// Check if there is any change back to the user!
				var changeBackAddr = $('#recipients .row.recipient.send-back-reserve-as-change input.address').val();
				var changeBackAmount = $('#recipients .row.recipient.send-back-reserve-as-change input.amount').val();
				var changeBackMsg = '';

				if(changeBackAmount > 0 && changeBackAddr)
					changeBackMsg = '<p><strong>Did you miss something? We just added a change back to your address!<strong><p>';

				// Check fee against hard 0.01 as well as fluid 200 satoshis per byte calculation.
				//if($("#transactionFee").val()>=0.01 || $("#transactionFee").val()>= estimatedTxSize * 200 * 1e-8){
				if($("#transactionFee").val()>=0.002){
					var warning = "<p>Please be aware that you have created a transaction with what seems to be a very high fee of "+$("#transactionFee").val()+" BAY!</p>"
						+ "<p>A fee above 0.001 is usually OK!";
						warning += changeBackMsg;
					$("#modalWarningFee .modal-body").html(warning);
					$("#modalWarningFee").modal("show");
				}	else if($("#transactionFee").val()<0.001){
					var warning = "<p>Please be aware that you have created a transaction with what seems to be a very low fee of "+$("#transactionFee").val()+" BAY!</p>"
					warning += changeBackMsg;
						+ "<p>You are advised to adjust the amount(s) so that a transaction fee is 0.001 or greater, otherwise the transcation might be rejected by the network!</p>";
					$("#modalWarningFee .modal-body").html(warning);
					$("#modalWarningFee").modal("show");
				}

			} else {
				$("#transactionCreateStatus").removeClass("hidden").html("One or more input or output is invalid").fadeOut().fadeIn();
			}
		}
	});

	$(".txidClear").click(function(){
		
		//remove first line if we have multiple inputs
		if($('#inputs .row.inputs').length > 1) {
			console.log('removed first Input');

			//$('#inputs .row.inputs:nth-child(1)').remove();
			
			//add the txIdAdd to the first input
			/*
			$('#inputs .row.inputs:nth-child(1) div:last').addClass('has-success').prepend('<a href="javascript:;" class="txidAdd" title="Add new TXid input"><span class="glyphicon glyphicon-plus"></span></a>');
			//$("#inputs .txId:first").prepend('<a href="javascript:;" class="txidAdd" title="Add new TXid input"><span class="glyphicon glyphicon-plus"></span></a>');

			//$("#inputs .row.inputs:nth-child(1) div:last .txidAdd").removeClass("hidden");
			
			$("#inputs .row.inputs:nth-child(1) div:last .txidAdd").unbind("");
			$("#inputs .row.inputs:nth-child(1) div:last .txidAdd").click(function(){
				$("#inputs .txidAdd").click();
				console.log('rebind TxIdAdd')
			});
			*/
			

		}else {
			console.log('didnt remove first Input');
			$("#inputs .row:first input").attr('disabled',false);
			$("#inputs .row:first input").val("");

			$("#txoutputs .row.recipient:first input").val('');
			$("#txoutputs .row.recipient .input-group").removeClass('has-error');

		}





		

		totalInputAmount();
	});

	$("#inputs .txIdAmount").unbind("").change(function(){
		totalInputAmount();
	}).keyup(function(){
		totalInputAmount();
	});

	$("#donateTxBtn").click(function(){

		var exists = false;

		$.each($("#recipients .address"), function(i,o){
			if($(o).val() == coinjs.developer){
				exists = true;
				$(o).fadeOut().fadeIn();
				return true;
			}
		});

		if(!exists){
			if($("#recipients .recipient:last .address:last").val() != ""){
				$("#recipients .addressAddTo:first").click();
			};

			$("#recipients .recipient:last .address:last").val(coinjs.developer).fadeOut().fadeIn();
			$("#recipients .recipient:last .amount:last").val("10.00000000").fadeOut().fadeIn();

			return true;
		}
	});
	
	/*
	Get Bootstrap Modal invoker/triggered element
	*/
	$(document).on('shown.bs.modal', '#modalQrcodeScanner', function (event) {
     var triggerElement = $(event.relatedTarget); // Button that triggered 
		 
		 //Start QR code scanner/reader
			var resultContainer = document.getElementById('qr-reader-results');
			resultContainer.innerHTML = "";
			//var redeemFromContainer = document.getElementById('redeemFrom');
			var walletInputContainer = triggerElement.closest('.input-group').find('input');
			
			
			// handle the scanned code as you like
			function onScanSuccess(qrCodeMessage) {
				
				// Validate the scanned Bitbay address!
				//https://stackoverflow.com/questions/21683680/regex-to-match-bitcoin-addresses
				var qrCodeReplaced = qrCodeMessage.replace("bitbay:", ""); 
				var walletQRAddress = qrCodeReplaced.match(/^[bB][a-km-zA-HJ-NP-Z0-9]{26,33}$/);
				
				if (walletQRAddress != null){
					walletInputContainer.val(walletQRAddress);
					document.getElementById("qr-reader-results").innerHTML = '<div class="alert alert-success"> Result: ' + walletQRAddress + "</div>"; 
					
					$("#qrScanClose").click();
				}else
					onScanFailure("Not Valid Bitbay address (" + walletQRAddress + ")");
				
				
			}
			
			// handle scan failure, usually better to ignore and keep scanning
			function onScanFailure(qrCodeMessage) {
				Html5Qrcode.stop();
				
				document.getElementById("qr-reader-results").innerHTML = '<div class="alert alert-danger"> Error: ' + qrCodeMessage + "</div>"; 
			}

			var html5QrcodeScanner = new Html5QrcodeScanner(
					"qr-reader", { fps: 10, qrbox: 250 });
			html5QrcodeScanner.render(onScanSuccess);
			
			
			
});
	//MutationObserver for Camera (QR Scanner)
	
var target = document.querySelector('#qr-reader');

var observer = new MutationObserver(function(mutations) {

  mutations.forEach(function(mutation) {
    //Check if Camera is loaded
    if( mutation.target.id == "qr-reader__dashboard_section_csr") {
      
      //get camera select options and set back camera as default if there is any!
      var cameraElement = mutation.target.firstChild.lastChild;
      if(cameraElement.id == "qr-reader__camera_selection") {
        
        var i = 0;
        for (var option of cameraElement.options) {
          //console.log(option.text + ': ' +option.value);
          
          if (option.text.match(/back/i)) {
            cameraElement.selectedIndex = i;
					  //observer.disconnect();
					}
          
          i++;
        }

      }
      
    }
  });
  
});

var config = {
  childList: true,
  subtree : true
};

observer.observe(target, config);


	/* redeem from button code */

	$("#redeemFromBtn").click(function(){
		var redeem = redeemingFrom($("#redeemFrom").val());

		$("#redeemFromStatus, #redeemFromAddress").addClass("hidden");

		if(redeem.from=='multisigAddress'){
			$("#redeemFromStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> You should use the redeem script, not the multisig address!');
			return false;
		}

		if(redeem.from=='other'){
			$("#redeemFromStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> The address or multisig redeem script you have entered is invalid');
			return false;
		}

		if($("#clearInputsOnLoad").is(":checked")){
			$("#inputs .txidRemove, #inputs .txidClear").click();
			$("#txoutputs .addressRemoveTo").click();
		}

		$("#redeemFromBtn").html("Please wait, loading...").attr('disabled',true);

		var host = $(this).attr('rel');

		listUnspentExplorer_Bitbay(redeem);
		//listUnspentDefault(redeem);
		

		if($("#redeemFromStatus").hasClass("hidden")) {
			// An ethical dilemma: Should we automatically set nLockTime?
			//if(redeem.from == 'redeemScript' && redeem.decodedRs.type == "hodl__") {
			//if(redeem.from == 'redeemScript' && redeem.decodescript.type == "hodl__") {
			if(redeem.from == 'redeemScript' && redeem.type == "hodl__") {
				$("#nLockTime").val(redeem.decodedRs.checklocktimeverify);
			} else {
				$("#nLockTime").val(0);
			}
		}
		//BUG-TIME ? GIORGOS update script time
		$("#nTime").val(Date.now() / 1000 | 0);
	});

	/* function to determine what we are redeeming from */
	function redeemingFrom(string){
		var r = {};
		var decode = coinjs.addressDecode(string);
		if(decode.version == coinjs.pub){ // regular address
			r.addr = string;
			r.from = 'address';
			r.redeemscript = false;
		} else if (decode.version == coinjs.priv){ // wif key
			var a = coinjs.wif2address(string);
			r.addr = a['address'];
			r.from = 'wif';
			r.redeemscript = false;
		} else if (decode.version == coinjs.multisig){ // mulisig address
			r.addr = '';
			r.from = 'multisigAddress';
			r.redeemscript = false;
		} else if(decode.type == 'bech32'){
			r.addr = string;
			r.from = 'bech32';
			r.decodedRs = decode.redeemscript;
			r.redeemscript = true;
		} else {
			var script = coinjs.script();
			var decodeRs = script.decodeRedeemScript(string);
			if(decodeRs){ // redeem script
				r.addr = decodeRs['address'];
				r.from = 'redeemScript';
				r.decodedRs = decodeRs.redeemscript;
				r.type = decodeRs['type'];
				r.redeemscript = true;
				r.decodescript = decodeRs;
			} else { // something else
				if(string.match(/^[a-f0-9]{64}$/i)){
					r.addr = string;
					r.from = 'txid';
					r.redeemscript = false;
				} else {
					r.addr = '';
					r.from = 'other';
					r.redeemscript = false;
				}
			}
		}
		return r;
	}

	/* mediator payment code for when you used a public key */
	function mediatorPayment(redeem){

		if(redeem.from=="redeemScript"){

			$('#recipients .row[rel="'+redeem.addr+'"]').parent().remove();

			$.each(redeem.decodedRs.pubkeys, function(i, o){
				$.each($("#mediatorList option"), function(mi, mo){

					var ms = ($(mo).val()).split(";");

					var pubkey = ms[0]; // mediators pubkey
					var fee = ms[2]*1; // fee in a percentage
					var payto = coinjs.pubkey2address(pubkey); // pay to mediators address

					if(o==pubkey){ // matched a mediators pubkey?

						var clone = '<span><div class="row recipients mediator mediator_'+pubkey+'" rel="'+redeem.addr+'">'+$("#recipients .addressAddTo").parent().parent().html()+'</div><br></span>';
						$("#recipients").prepend(clone);

						$("#recipients .mediator_"+pubkey+" .glyphicon-plus:first").removeClass('glyphicon-plus');
						$("#recipients .mediator_"+pubkey+" .address:first").val(payto).attr('disabled', true).attr('readonly',true).attr('title','Medation fee for '+$(mo).html());

						var amount = ((fee*$("#totalInput").html())/100).toFixed(8);
						$("#recipients .mediator_"+pubkey+" .amount:first").attr('disabled',(((amount*1)==0)?false:true)).val(amount).attr('title','Medation fee for '+$(mo).html());
					}
				});
			});

			validateOutputAmount();
		}
	}

	/* global function to add outputs to page */
	function addOutput(tx, n, script, amount, amountLiquid, amountReserve) {
		if(tx){
			if($("#inputs .txId:last").val()!=""){
				$("#txinputs .txidAdd").click();
			}

			$("#inputs .row:last input").attr('disabled',true);

			//var txid = ((tx).match(/.{1,2}/g).reverse()).join("")+'';
			var txid = tx;

			
			$("#inputs .txId:last").val(txid);
			$("#inputs .txIdN:last").val(n);
			$("#inputs .txIdAmountLiquid:last").val(amountLiquid);
			$("#inputs .txIdAmountReserve:last").val(amountReserve);

			$("#inputs .txIdoN:last").attr('disabled',true);
			$("#inputs .txIdMoveType:last").val('liquid');

			if(script.match(/^00/) && script.length==44){
				s = coinjs.script();
				s.writeBytes(Crypto.util.hexToBytes(script));
				s.writeOp(0);
				s.writeBytes(coinjs.numToBytes((amount*100000000).toFixed(0), 8));
				script = Crypto.util.bytesToHex(s.buffer);
			}

			$("#inputs .txIdScript:last").val(script);
			
			
		}
	}

	/* default function to retreive unspent outputs*/	
	function listUnspentDefault(redeem){
		var tx = coinjs.transaction();
		tx.listUnspent(redeem.addr, function(data){
			if(redeem.addr) {
				$("#redeemFromAddress").removeClass("hidden").html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

				$.each($(data).find("unspent").children(), function(i,o){
					var tx = $(o).find("tx_hash").text();
					var n = $(o).find("tx_output_n").text();
					var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : $(o).find("script").text();
					var amount = (($(o).find("value").text()*1)/100000000).toFixed(8);

					addOutput(tx, n, script, amount);
				});
			}

			$("#redeemFromBtn").html("Load").attr('disabled',false);
			totalInputAmount();

			mediatorPayment(redeem);
		});
	}







/* retrieve unspent data from chain.so for Bitbay */
	function listUnspentExplorer_Bitbay(redeem){
		
		
		if (debug) {
			for (var k in redeem){
				if (redeem.hasOwnProperty(k)) {
					 console.log("['" + k + "'] = " + redeem[k]);
				}
			}

			console.log('redeem: ', redeem);
		}

		coinjs.cachedInputs = [];

		
		
		$.ajax ({
			type: "GET",
			//url: "http://195.181.242.206:9998/api?method=blockchain.address.listunspent",
			url:  coinjs.host + "/listunspent/" + redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				
				if (coinjs.debug) {
					console.log('data: ', data);
				}
				if((data.api_status  == "success") ){
					if (Object.keys(data['result']).length > 0){

						var reserve = 0;
						var liquid = 0;
						var value = 0;
						var total = 0;
						var x = {};

						var n;
						var tx
						var inputScript;
						var oreserve;
						var oliquid;
						var amount;

						//$("#redeemFromAddress").removeClass("hidden").html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
						$("#redeemFromAddress").removeClass("hidden").html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+coinjs.host+'/listunspent/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>.');

						//Get scriptPubKey, public key for regular address and redeemscript for multisig wallet
						if(redeem.from == "address"){	//regular address script
							//Get scriptPubKey
							var s = coinjs.script();
							var scriptPubKey = s.pubkeyHash(redeem.addr);
							
							//Check for Locked time address
							var scriptPubKey_buffer = Crypto.util.bytesToHex(scriptPubKey.buffer);
							inputScript = scriptPubKey_buffer;

						}else if(redeem.from == "redeemScript") {	//multisig address script
								inputScript = $("#redeemFrom").val();
						}

						console.log('inputScript: ', inputScript);

							//if((data.tx) && data.tx.hash){
							for(var i in data.result){
								
								var o = data.result[i];
								if (o.txid){
									tx = o.txid;
									n = o.vout;
									//var tx = ((""+tx).match(/.{1,2}/g).reverse()).join("")+'';
									//if(tx.match(/^[a-f0-9]+$/) && scriptPubKey_buffer == script){
									if(tx.match(/^[a-f0-9]+$/)){
										if (coinjs.debug) {
											console.log('unspent: ', o);
										}

										
										//var script = scriptPubKey_buffer;
										oreserve = o.reserve;
										oliquid = o.liquid;
										amount = o.amount;
										
										// sum up the Liquid and Reserve balances
										reserve += oreserve*1;
										liquid += oliquid*1;
										value += amount*1;
										total++;

										//var amount = (o.value/100000000).toFixed(8);
										addOutput(tx, n, inputScript, amount, oliquid, oreserve);

										//add loaded wallet inputs to a cached variable
										coinjs.cachedInputs[i] = {'tx': tx, 'n': n, 'inputScript': inputScript, 'amount': amount, 'oliquid': oliquid, 'oreserve': oreserve};



										
									}
								}
							}
							//add date to the cached variable, so we update the inputs in intervals without new requests to the nodes!
							coinjs.cachedInputs['timeCached'] = Date.now();
							console.log('coinjs.cachedInputs: ', coinjs.cachedInputs);

							x.unspent = data.result;
							x.reserve = reserve;
							x.liquid = liquid;
							x.value = value;
							x.total = total;

							if (coinjs.debug) {
								console.log('x.unspent = data.result: '+x.unspent);
								console.log('x.reserve = data.reserve: '+x.reserve);
								console.log('x.liquid = data.liquid: '+x.liquid);
								console.log('x.value = data.value: '+x.value);
								console.log('x.total = data.total: '+x.total);
							}

							
							console.log('redeem', redeem);
							//Inform about Time Locked Address if found
							if( redeem.from == 'redeemScript' && ((typeof redeem.decodedRs !== 'undefined') && redeem.decodedRs.type == "hodl__" )) {
								//This is a Time locked address with release date
								var checkLocktimeBlockdDate = ( redeem.decodedRs.checklocktimeverify >= 500000000 )? (new Date(redeem.decodedRs.checklocktimeverify*1000).toUTCString()) : ("Block height "+redeem.decodedRs.checklocktimeverify);
								
								$("#redeemFromAddress").html( $("#redeemFromAddress").html() + ' <div class="alert alert-danger" id="redeemFromAddressLocktime">This is a Time Locked Address, unlock the funds after this Date/Block: <strong>' + checkLocktimeBlockdDate+'</strong></div>');
							}
							
							
					} else {
						$("#redeemFromStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, there are no unspent outputs.');
					}
				} else {
					$("#redeemFromStatus").removeClass("hidden").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}
	
	/* math to calculate the inputs and outputs */

	function totalInputAmount(){
		$("#totalInput").html('0.00');
		$.each($("#inputs .txIdAmountLiquid, #inputs .txIdAmountReserve "), function(i,o){
			if(isNaN($(o).val())){
				$(o).parent().addClass('has-error');
			} else {
				$(o).parent().removeClass('has-error');
				var f = 0;
				if(!isNaN($(o).val())){
					f += $(o).val()*1;
				}
				$("#totalInput").html((($("#totalInput").html()*1) + (f*1)).toFixed(8));
			}
		});
		totalFee();
	}

	function validateOutputAmount(){
		$("#recipients .amount").unbind('');
		$("#recipients .amount").keyup(function(){
			if(isNaN($(this).val())){
				$(this).parent().addClass('has-error');
			} else {
				$(this).parent().removeClass('has-error');
				var f = 0;
				$.each($("#recipients .amount"),function(i,o){
					if(!isNaN($(o).val())){
						f += $(o).val()*1;
					}
				});
				$("#totalOutput").html((f).toFixed(8));
			}
			totalFee();
		}).keyup();
	}

	function totalFee(){
		var fee = (($("#totalInput").html()*1) - ($("#totalOutput").html()*1)).toFixed(8);
		$("#transactionFee").val((fee>0)?fee:'0.00');
	}

	$("#optionsCollapse").click(function(){
		if($("#optionsAdvanced").hasClass("hidden")){
			$("#glyphcollapse").removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#optionsAdvanced").removeClass("hidden");
		} else {
			$("#glyphcollapse").removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#optionsAdvanced").addClass("hidden");
		}
	});

	/* broadcast a transaction */

	$("#rawSubmitBtn").click(function(){
		rawSubmitExplorer_Bitbay(this);
	});


// broadcast transaction via chain.so (mainnet)
	function rawSubmitExplorer_Bitbay(btn){ 
	
		var thisbtn = btn;		
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);


		var decodingError = false;

		// check first if the rawTX can be decoded, if not throw error!!
			if(!decodeRedeemScript()){
				if(!decodeTransactionScript()){
					if(!decodePrivKey()){
						if(!decodePubKey()){
							if(!decodeHDaddress()){
								decodingError = true;
								
							}
						}
					}
				}
			}

			if (decodingError) {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unable to decode the Raw Transaction! ').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				$(thisbtn).val('Submit').attr('disabled',false);
				return ;
			}
			
			
		
			//all good, make a broadcast request!

			var tx = coinjs.transaction(); 
			tx.broadcast(function(data){
						if (debug) {					
							console.log('broadcast: ', data);
						}
						
						dataJSON = JSON.parse(data);
						if (debug) {					
							console.log('dataJSON: ', dataJSON);
						}
						if(dataJSON.api_status=="success" || dataJSON.status){
							callback_result =  dataJSON.result
							var success = false;
							if(coinjs.block_processor == 'bp'){
								if(dataJSON.result.status == "success"){
									success = true;
									callback_result = dataJSON.result.tx;
								}else{
									callback_result = dataJSON.result.msg;
								}
							}
              
							reset_broadcast_progress_bar();
              
							if(success || callback_result.match(/^[a-f0-9]+$/) && dataJSON.result.status != "failed"){
								
                
                var mess = 'Your transaction was successfully sent: <br />'
								+'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
								//+ '<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
								$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(mess);

								$("#rawTransactionStatus").fadeOut().fadeIn();
								$(thisbtn).val('Submit').attr('disabled',false);


							} else {
								//$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
								$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(unescape(callback_result)).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>').append("<br>You should perhaps try to raise the Transaction Fee?");;
								$(thisbtn).val('Submit').attr('disabled',false);
							}
						}else{
							$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html('Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
						}				

	
					}, $("#rawTransaction").val());
					

		
		/*
		$.ajax ({
			type: "POST",
			//url: "http://195.181.242.206:9998/api?method=blockchain.transaction.broadcast",
			url: coinjs.host + "/broadcast/" + $("#rawTransaction").val(),
			dataType: "json",
			error: function(data) {
				if(data.status == "500"){
					var obj = $.parseJSON(data.responseText);
					r = ' Error occured: ' + obj.msg;
					$("#rawTransactionStatus")
						.removeClass('alert-success')
						.addClass('alert-danger')
						.removeClass("hidden").html(r)
						.prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');	
				}else{
					var obj = $.parseJSON(data.result);
					var r = ' ';
					r += (obj.data.tx_hex) ? obj.data.tx_hex : '';
					r = (r!='') ? r : ' Failed to broadcast'; // build response 
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');	
				}
			},
      		success: function(data) {
				if(data.status == "success"){
					var mess = 'Your transaction was successfully sent: <br />'
					+'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+data.tx+'.htm" target="_blank" >Txid: ' + data.tx + '</a>';
					//+ '<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(mess);
				}
				else if(data.api_status=="success"){
					
					callback_result =  data.result;
					var success = false;
					if(coinjs.block_processor == 'bp'){
						if(data.result.status == "success"){
							success = true;
							callback_result = data.result.tx;
						}else{
							callback_result = data.result.msg;
						}
					}
              
					reset_broadcast_progress_bar();
              
					if(success || callback_result.match(/^[a-f0-9]+$/)){

						var mess = 'Your transaction was successfully sent: <br />'
						+'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
						//+ '<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
						$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(mess);
					} else {
						//$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
						$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(unescape(callback_result)).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>').append("<br>You should perhaps try to raise the Transaction Fee?");;
					}
-
				}else{
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);
			}
		});
		*/
		
	}




	/* verify script code */

	$("#verifyBtn").click(function(){
		$(".verifyData").addClass("hidden");
		$("#verifyStatus").hide();
		if(!decodeRedeemScript()){
			if(!decodeTransactionScript()){
				if(!decodePrivKey()){
					if(!decodePubKey()){
						if(!decodeHDaddress()){
							$("#verifyStatus").removeClass("hidden").fadeOut().fadeIn();
						}
					}
				}
			}
		}

	});

	function decodeRedeemScript(){
		var script = coinjs.script();
		var decode = script.decodeRedeemScript($("#verifyScript").val());
		if(decode){
			$("#verifyRsDataMultisig").addClass("hidden");
			$("#verifyRsDataHodl").addClass("hidden");
			$("#verifyRsDataSegWit").addClass("hidden");
			$("#verifyRsData").addClass("hidden");


			if(decode.type == "multisig__") {
				$("#verifyRsDataMultisig .multisigAddress").val(decode['address']);
				$("#verifyRsDataMultisig .signaturesRequired").html(decode['signaturesRequired']);
				$("#verifyRsDataMultisig table tbody").html("");
				for(var i=0;i<decode.pubkeys.length;i++){
					var pubkey = decode.pubkeys[i];
					var address = coinjs.pubkey2address(pubkey);
					$('<tr><td width="30%"><input type="text" class="form-control" value="'+address+'" readonly></td><td><input type="text" class="form-control" value="'+pubkey+'" readonly></td></tr>').appendTo("#verifyRsDataMultisig table tbody");
				}
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataMultisig").removeClass("hidden");
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} else if(decode.type == "segwit__"){
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataSegWit .segWitAddress").val(decode['address']);
				$("#verifyRsDataSegWit").removeClass("hidden");
				return true;
			} else if(decode.type == "hodl__") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val(decode['address']);							//Hodl Address field
				$("#verifyRsDataHodl .pubkey").val(coinjs.pubkey2address(decode['pubkey']));	//Required Singature field

				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass("hidden");
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} else if(decode.type == "hodl__p2sh") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val((decode['pubkey']));	//Hodl Address field
				$("#verifyRsDataHodl .pubkey").val(decode['address']);		//Required Singature field

				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass("hidden");
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			}
		}
		return false;
	}

	function decodeTransactionScript(){
		var tx = coinjs.transaction();
		try {
			var decode = tx.deserialize($("#verifyScript").val());
		//	console.log(decode);
			$("#verifyTransactionData .transactionVersion").html(decode['version']);
			$("#verifyTransactionData .transactionTime").html(new Date(decode['nTime']*1000).toUTCString());
			$("#verifyTransactionData .transactionSize").html(decode.size()+' <i>bytes</i>');
			//$("#verifyTransactionData .transactionLockTime").html(decode['lock_time']);
			$("#verifyTransactionData .transactionLockTime").html((decode['lock_time'] >= 500000000)? (new Date(decode['lock_time']*1000).toUTCString()) : ("Block height "+decode['lock_time']) );
			
			//add lock time information to the user
			if(decode['lock_time'] != 0)
				$("#verifyTransactionData .transactionLockTime").html($("#verifyTransactionData .transactionLockTime").html() + '<br><div class="alert alert-danger">This is a Time Locked Address, unlock the funds after this Date/Block.</div>' );

			$("#verifyTransactionData .transactionRBF").hide();
			$("#verifyTransactionData .transactionSegWit").hide();
			if (decode.witness.length>=1) {
				$("#verifyTransactionData .transactionSegWit").show();
			}
			$("#verifyTransactionData").removeClass("hidden");
			$("#verifyTransactionData tbody").html("");

			var h = '';
			$.each(decode.ins, function(i,o){
				var s = decode.extractScriptKey(i);
				h += '<tr>';
				h += '<td><input class="form-control" type="text" value="'+o.outpoint.hash+'" readonly></td>';
				h += '<td class="col-xs-1">'+o.outpoint.index+'</td>';
				h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
				h += '<td class="col-xs-1"> <span class="glyphicon glyphicon-'+((s.signed=='true' || (decode.witness[i] && decode.witness[i].length==2))?'ok':'remove')+'-circle"></span>';
				if(s['type']=='multisig' && s['signatures']>=1){
					h += ' '+s['signatures'];
				}
				h += '</td>';
				h += '<td class="col-xs-1">';
				if(s['type']=='multisig'){
					var script = coinjs.script();
					var rs = script.decodeRedeemScript(s.script);
					h += rs['signaturesRequired']+' of '+rs['pubkeys'].length;
				} else {
					h += '<span class="glyphicon glyphicon-remove-circle"></span>';
				}
				h += '</td>';
				h += '</tr>';

				//debug
				if(parseInt(o.sequence)<(0xFFFFFFFF-1)){
					$("#verifyTransactionData .transactionRBF").show();
				}
			});

			$(h).appendTo("#verifyTransactionData .ins tbody");

			h = '';
			$.each(decode.outs, function(i,o){

				if(o.script.chunks.length==2 && o.script.chunks[0]==106){ // OP_RETURN

					var data = Crypto.util.bytesToHex(o.script.chunks[1]);
					var dataascii = hex2ascii(data);

					if(dataascii.match(/^[\s\d\w]+$/ig)){
						data = dataascii;
					}
					//add PEG data
					// add F notations
					if(dataascii.indexOf("**F**") !== -1 || (dataascii.indexOf("6a") !== -1)) {
						data = dataascii + " " + data;
					}

					h += '<tr>';
					h += '<td><input type="text" class="form-control" value="(OP_RETURN) '+data+'" readonly></td>';
					//h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
					h += '<td class="col-xs-2"><div class="input-group"><input class="form-control form-control-div" type="text" value="'+(o.value/100000000).toFixed(8)+'" readonly> <span class="input-group-addon amountCoinSymbol">'+coinjs.symbol+'</span></div></td>';
					h += '<td class="col-xs-5"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				} else {

					var addr = '';
					if(o.script.chunks.length==5){
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[2]));
					} else {
						var pub = coinjs.pub;
						coinjs.pub = coinjs.multisig;
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[1]));
						coinjs.pub = pub;
					}

					h += '<tr>';
					h += '<td><input class="form-control" type="text" value="'+addr+'" readonly></td>';
					//h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
					h += '<td class="col-xs-2"><div class="input-group"><input class="form-control form-control-div" type="text" value="'+(o.value/100000000).toFixed(8)+'" readonly> <span class="input-group-addon amountCoinSymbol">'+coinjs.symbol+'</span></div></td>';
					h += '<td class="col-xs-5"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				}
				//01000000833cc05901b56812b3cf9748cfea9141c78697cd63fa454e1bb4d7a84b3f4cced0bdf1e32a010000002a04c025c059b1752102232fc2d410f686637b22da3914878fe4a71f53daf7cfdf7ebf02ecff015f08a9ac0000000001e00f9700000000001976a914afeafd767d84aaa0cebc335eeeb5886734e88d9988acc025c059
			});
			$(h).appendTo("#verifyTransactionData .outs tbody");

			$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
			return true;
		} catch(e) {
			return false;
		}
	}

	function hex2ascii(hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}

	function decodePrivKey(){
		var wif = $("#verifyScript").val();
		if(wif.length==51 || wif.length==52){
			try {
				var w2address = coinjs.wif2address(wif);
				var w2pubkey = coinjs.wif2pubkey(wif);
				var w2privkey = coinjs.wif2privkey(wif);

				$("#verifyPrivKey .address").val(w2address['address']);
				$("#verifyPrivKey .pubkey").val(w2pubkey['pubkey']);
				$("#verifyPrivKey .privkey").val(w2privkey['privkey']);
				$("#verifyPrivKey .iscompressed").html(w2address['compressed']?'true':'false');

				$("#verifyPrivKey").removeClass("hidden");
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}

	function decodePubKey(){
		var pubkey = $("#verifyScript").val();
		if(pubkey.length==66 || pubkey.length==130){
			try {
				$("#verifyPubKey .address").val(coinjs.pubkey2address(pubkey));
				$("#verifyPubKey").removeClass("hidden");
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}

	function decodeHDaddress(){
		coinjs.compressed = true;
		var s = $("#verifyScript").val();
		try {
			var hex = Crypto.util.bytesToHex((coinjs.base58decode(s)).slice(0,4));
			var hex_cmp_prv = Crypto.util.bytesToHex((coinjs.numToBytes(coinjs.hdkey.prv,4)).reverse());
			var hex_cmp_pub = Crypto.util.bytesToHex((coinjs.numToBytes(coinjs.hdkey.pub,4)).reverse());
			if(hex == hex_cmp_prv || hex == hex_cmp_pub){
				var hd = coinjs.hd(s);
				$("#verifyHDaddress .hdKey").html(s);
				$("#verifyHDaddress .chain_code").val(Crypto.util.bytesToHex(hd.chain_code));
				$("#verifyHDaddress .depth").val(hd.depth);
				$("#verifyHDaddress .version").val('0x'+(hd.version).toString(16));
				$("#verifyHDaddress .child_index").val(hd.child_index);
				$("#verifyHDaddress .hdwifkey").val((hd.keys.wif)?hd.keys.wif:'');
				$("#verifyHDaddress .key_type").html((((hd.depth==0 && hd.child_index==0)?'Master':'Derived')+' '+hd.type).toLowerCase());
				$("#verifyHDaddress .parent_fingerprint").val(Crypto.util.bytesToHex(hd.parent_fingerprint));
				$("#verifyHDaddress .derived_data table tbody").html("");
				deriveHDaddress();
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				$("#verifyHDaddress").removeClass("hidden");
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	function deriveHDaddress() {
		var hd = coinjs.hd($("#verifyHDaddress .hdKey").html());
		var index_start = $("#verifyHDaddress .derivation_index_start").val()*1;
		var index_end = $("#verifyHDaddress .derivation_index_end").val()*1;
		var html = '';
		$("#verifyHDaddress .derived_data table tbody").html("");
		for(var i=index_start;i<=index_end;i++){
			if($("#hdpathtype option:selected").val()=='simple'){
				var derived = hd.derive(i);
			} else {
				var derived = hd.derive_path(($("#hdpath input").val().replace(/\/+$/, ""))+'/'+i);
			}
			html += '<tr>';
			html += '<td>'+i+'</td>';
			html += '<td><input type="text" class="form-control" value="'+derived.keys.address+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+((derived.keys.wif)?derived.keys.wif:'')+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+derived.keys_extended.pubkey+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+((derived.keys_extended.privkey)?derived.keys_extended.privkey:'')+'" readonly></td>';
			html += '</tr>';
		}
		$(html).appendTo("#verifyHDaddress .derived_data table tbody");
	}

	$("#hdpathtype").change(function(){
		if($(this).val()=='simple'){
			$("#hdpath").removeClass().addClass("hidden");
		} else {
			$("#hdpath").removeClass();
		}
	});

	/* sign code */
	$("#signPrivateKey").change(function(){
		var signedPrivKey = $(this);
		if(signedPrivKey){

			$(signedPrivKey).parent().removeClass('has-error').removeClass('has-success');

			if((signedPrivKey.val()).search('U2') == 0) {

				var aesPassphrase = $("#signPrivateKeyAESPassword");
				var decrypted = CryptoJS.AES.decrypt(signedPrivKey.val(), aesPassphrase.val()).toString(CryptoJS.enc.Utf8);

				$(aesPassphrase).parent().removeClass("hidden");
				console.log('decrypted: ', decrypted);

				if(coinjs.addressDecode(decrypted)){
					$(aesPassphrase).parent().removeClass('has-error').addClass('has-success');
					signedPrivKey.val(decrypted);
				} else {
					$(aesPassphrase).parent().addClass('has-error').removeClass('has-success');
				}

			} else{
				$("#signPrivateKeyAESPassword").parent().addClass("hidden");
				console.log('there is no aes encryption!')
			}
			
		}
	});


	$("#signBtn").click(async function(){
		$(this).attr('disabled',true);

		var wifkey = $("#signPrivateKey");
		var aesPassphrase = $("#signPrivateKeyAESPassword");
		var script = $("#signTransaction");

		//check if user has set AES password and decrypt it!
		if(aesPassphrase.val()!=""){
			
			try {
				var decrypted = CryptoJS.AES.decrypt(wifkey.val(), aesPassphrase.val()).toString(CryptoJS.enc.Utf8);
				if(coinjs.addressDecode(decrypted)){
					$(aesPassphrase).parent().removeClass('has-error').addClass('has-success');
					wifkey.val(decrypted);
					$(wifkey).parent().removeClass('has-error').addClass('has-success');
				} else {
					$(aesPassphrase).parent().addClass('has-error').removeClass('has-success');
				}
			} catch(e) {
				 console.log(e);
				$(aesPassphrase).parent().addClass('has-error').removeClass('has-success');
			}
		}else {
			if(coinjs.addressDecode(wifkey.val())){
				$(wifkey).parent().removeClass('has-error');
			} else {
				$(wifkey).parent().addClass('has-error');
			}
		}

		if((script.val()).match(/^[a-f0-9]+$/ig)){
			$(script).parent().removeClass('has-error');
		} else {
			$(script).parent().addClass('has-error');
		}

		if($("#sign .has-error").length==0){
			
			
			$("#signedDataError").addClass("hidden");
			try {
				var tx = coinjs.transaction();
				var t = tx.deserialize(script.val());
				
				//for progress bar
				$("#signedDataProgress").removeClass("hidden");
				//init_broadcast_progress_bar(t.ins.length);
				//init_broadcast_progress_bar(t.outs.length, 1);	//only 1 signature is needed
				await init_broadcast_progress_bar(t.ins.length, 1);
				console.log('t: ', t);
				console.log('t.ins.length: ', t.ins.length);
				console.log('t.outs.length: ', t.outs.length);
				document.querySelector(".bar_privkey_sign_current").innerText = 1;

				console.log('t: ', t);



				var signed = await t.sign(wifkey.val(), $("#sighashType option:selected").val());

				console.log('signed: ', signed);
				$("#signedData textarea").val(signed);
				$("#signedData .txSize").html(t.size());
				$("#signedData").removeClass("hidden").fadeIn();
				reset_broadcast_progress_bar();
			} catch(e) {
				// console.log(e);
			}
		} else {
			$("#signedDataError").removeClass("hidden");
			$("#signedData").addClass("hidden");
		}
		$(this).attr('disabled',false);
	});

	$("#sighashType").change(function(){
		$("#sighashTypeInfo").html($("option:selected",this).attr('rel')).fadeOut().fadeIn();
	});

	$("#signAdvancedCollapse").click(function(){
		if($("#signAdvanced").hasClass("hidden")){
			$("span",this).removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#signAdvanced").removeClass("hidden");
		} else {
			$("span",this).removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#signAdvanced").addClass("hidden");
		}
	});

	/* page load code */

	function _get(value) {
		var dataArray = (document.location.search).match(/(([a-z0-9\_\[\]]+\=[a-z0-9\_\.\%\@]+))/gi);
		var r = [];
		if(dataArray) {
			for(var x in dataArray) {
				if((dataArray[x]) && typeof(dataArray[x])=='string') {
					if((dataArray[x].split('=')[0].toLowerCase()).replace(/\[\]$/ig,'') == value.toLowerCase()) {
						r.push(unescape(dataArray[x].split('=')[1]));
					}
				}
			}
		}
		return r;
	}

	var _getBroadcast = _get("broadcast");
	if(_getBroadcast[0]){
		$("#rawTransaction").val(_getBroadcast[0]);
		$("#rawSubmitBtn").click();
		window.location.hash = "#broadcast";
	}

	var _getVerify = _get("verify");
	if(_getVerify[0]){
		$("#verifyScript").val(_getVerify[0]);
		$("#verifyBtn").click();
		window.location.hash = "#verify";
	}

	$(".qrcodeBtn").click(function(){
		$("#qrcode").html("");
		var thisbtn = $(this).parent().parent();
		var qrstr = false;
		var ta = $("textarea",thisbtn);

		if(ta.length>0){
			var w = (screen.availWidth > screen.availHeight ? screen.availWidth : screen.availHeight)/3;
			var qrcode = new QRCode("qrcode", {width:w, height:w});
			qrstr = $(ta).val();
			if(qrstr.length > 1024){
				$("#qrcode").html("<p>Sorry the data is too long for the QR generator.</p>");
			}
		} else {
			var qrcode = new QRCode("qrcode");
			qrstr = "bitbay:"+$('.address',thisbtn).val();
		}

		if(qrstr){
			qrcode.makeCode(qrstr);
		}
	});

	$('input[title!=""], abbr[title!=""]').tooltip({'placement':'bottom'});
	$('*[title!=""], abbr[title!=""]').tooltip({'placement':'bottom'});
	$('#inputs *[title!=""], #inputs abbr[title!=""]').tooltip({'placement':'left'});

	if (location.hash !== ''){
		$('a[href="' + location.hash + '"]').tab('show');
	}

	$(".showKey").click(function(){
		if ($(this).data("hidden") === false) {
			$("input[type='text']",$(this).parent().parent()).attr('type','password');
			$(this).data("hidden", true);
			$(this).text("Show");
		} else {
			$("input[type='password']",$(this).parent().parent()).attr('type','text');
			$(this).data("hidden", false);
			$(this).text("hidden");
		}
	});

	$("#homeBtn").click(function(e){
		e.preventDefault();
		history.pushState(null, null, '#home');
		$("#header .active, #content .tab-content").removeClass("active");
		$("#wallet").addClass("active");
	});

	$('a[data-toggle="tab"]').on('click', function(e) {
		e.preventDefault();
		if(e.target && $(e.target).attr('href')) {
			history.pushState(null, null, '#'+$(e.target).attr('href').substr(1));
		}
	});

	window.addEventListener("popstate", function(e) {
		var activeTab = $('[href="' + location.hash + '"]');
		if (activeTab.length) {
			activeTab.tab('show');
		} else {
			$('.nav-tabs a:first').tab('show');
		}
	});

	for(i=1;i<3;i++){
		$(".pubkeyAdd").click();
	}

	validateOutputAmount();

	/* settings page code */

	$("#coinjs_pub").val('0x'+(coinjs.pub).toString(16));
	$("#coinjs_priv").val('0x'+(coinjs.priv).toString(16));
	$("#coinjs_multisig").val('0x'+(coinjs.multisig).toString(16));

	$("#coinjs_hdpub").val('0x'+(coinjs.hdkey.pub).toString(16));
	$("#coinjs_hdprv").val('0x'+(coinjs.hdkey.prv).toString(16));	

	//$("#settingsBtn").click(function(sessionDestroy = false){
	$("#settingsBtn").click(function(e){

		//Set Coin Symbols
		$(".amountCoinSymbol").text(coinjs.symbol);
		
		// log out of openwallet
		//$(".walletLogout").click({sessionDestroy : true });

		$("#statusSettings").removeClass("alert-success").removeClass("alert-danger").addClass("hidden").html("");
		$("#settings .has-error").removeClass("has-error");

		$.each($(".coinjssetting"),function(i, o){
			
			
			if ($(o).hasClass("boolisvalid")) {
				if(!$(o).val().match(/^0x[0-9a-f]+|true|false$/)){
					$(o).parent().addClass("has-error");
					alert('Error: '+$(o).attr('id')+ ' : ' + $(o).val());
				}
			} else {
				if(!$(o).val().match(/^0x[0-9a-f]+$/)){
					$(o).parent().addClass("has-error");
					alert('Error: '+$(o).attr('id')+ ' : ' + $(o).val());
				}
			}
		});
		
		if($("#settings .has-error").length==0){

			coinjs.pub =  $("#coinjs_pub").val()*1;
			coinjs.priv =  $("#coinjs_priv").val()*1;
			coinjs.multisig =  $("#coinjs_multisig").val()*1;

			coinjs.hdkey.pub =  $("#coinjs_hdpub").val()*1;
			coinjs.hdkey.prv =  $("#coinjs_hdprv").val()*1;


			coinjs.txExtraTimeField = ($("#coinjs_extratimefield").val());
			
			if (coinjs.txExtraTimeField == "true") {
				//BUG ? GIORGOS //wrong time picked up when decoding script
				$("#nTime").val(Date.now() / 1000 | 0);
				//$("#nTime").val("");
				$("#txTimeOptional").show();
				$("#verifyTransactionData .txtime").show();
			} else {
				$("#txTimeOptional").hide();
				$("#verifyTransactionData .txtime").hide();
			}

			coinjs.decimalPlaces = $("#coinjs_decimalplaces").val()*1;
			coinjs.symbol = $("#coinjs_symbol").val();
			
			//configureBroadcast();
			configureGetUnspentTx();

			$("#statusSettings").addClass("alert-success").removeClass("hidden").html("<span class=\"glyphicon glyphicon-ok\"></span> Settings updates successfully").fadeOut().fadeIn();	
		} else {
			$("#statusSettings").addClass("alert-danger").removeClass("hidden").html("There is an error with one or more of your settings");	
		}
	});

	$("#coinjs_coin").change(function(){

		var o = ($("option:selected",this).attr("rel")).split(";");

		// deal with broadcasting settings
		if(o[5]=="false"){
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',true);
			$("#coinjs_broadcast").val("coinb.in");	
		} else {
			$("#coinjs_broadcast").val(o[5]);
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',false);
		}

		// deal with unspent output settings
		if(o[6]=="false"){
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',true);			
			$("#coinjs_utxo").val("coinb.in");
		} else {
			$("#coinjs_utxo").val(o[6]);
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',false);
		}

		// deal with the reset
		$("#coinjs_pub").val(o[0]);
		$("#coinjs_priv").val(o[1]);
		$("#coinjs_multisig").val(o[2]);
		$("#coinjs_hdpub").val(o[3]);
		$("#coinjs_hdprv").val(o[4]);

		$("#coinjs_extratimefield").val(o[7]);
		$("#coinjs_symbol").val(o[8]);
		
		// hide/show custom screen
		if($("option:selected",this).val()=="custom"){
			$("#settingsCustom").removeClass("hidden");
		} else {
			$("#settingsCustom").addClass("hidden");
		}
	});

	function configureBroadcast(){
		$("#rawSubmitBtn").unbind("");

		rawSubmitExplorer_Bitbay(this);
	}

	function configureGetUnspentTx(){
		$("#redeemFromBtn").attr('rel',$("#coinjs_utxo option:selected").val());
	}

	/* capture mouse movement to add entropy */
	var IE = document.all?true:false // Boolean, is browser IE?
	if (!IE) document.captureEvents(Event.MOUSEMOVE)
	document.onmousemove = getMouseXY;
	function getMouseXY(e) {
		var tempX = 0;
		var tempY = 0;
		if (IE) { // If browser is IE
			tempX = event.clientX + document.body.scrollLeft;
			tempY = event.clientY + document.body.scrollTop;
		} else {
			tempX = e.pageX;
			tempY = e.pageY;
		};

		if (tempX < 0){tempX = 0};
		if (tempY < 0){tempY = 0};
		var xEnt = Crypto.util.bytesToHex([tempX]).slice(-2);
		var yEnt = Crypto.util.bytesToHex([tempY]).slice(-2);
		var addEnt = xEnt.concat(yEnt);

		if ($("#entropybucket").html().indexOf(xEnt) == -1 && $("#entropybucket").html().indexOf(yEnt) == -1) {
			$("#entropybucket").html(addEnt + $("#entropybucket").html());
		};

		if ($("#entropybucket").html().length > 128) {
			$("#entropybucket").html($("#entropybucket").html().slice(0, 128))
		};

		return true;
	};
	
	/*Custom Settings*/
	/*
	 @ Check Password
	*/
		checkPassword = function (val) {
		var str = val;
		//var str = el.val();
		
		
		
		
			var msg = '';
			if (str.length < 12) {
				msg= ("too_short");
			} else if (str.length > 255) {
				msg= ("too_long");
			} else if (str.search(/\d/) == -1) {
				msg= ("no_num");
			} else if (str.search(/[a-z]/) == -1) {
				msg= ("no_lower_case");
			} else if (str.search(/[A-Z]/) == -1) {
				msg= ("no_upper_case");
			//} else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\=\,\;\:\!\-]/) != -1) {
			} else if (str.search(/[^a-zA-Z0-9\!\@\§\½\€\¤\£\`\´\#\$\"\'\%\^\&\*\(\)\_\+\.\=\~\¨\|\,\;\:\!\-\[\]\}\{\/\\\?\>\<\^]/) != -1) {
				msg= ("bad_char");
			}else {
				msg=("");
				//$('.checkInputsPassword').addClass("hidden")
			}
			
			// pattern to match : At least one number ,one letter and one special character
			//var regex = /^(((.*\d.*[A-Z].*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*))|(.*[A-Z].*\d.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*)|(.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*[A-Z].*\d.*)|(.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*\d.*[A-Z].*))$/i;
			//var regex = /.*\d.*\w.*\D.*/i;
			//if (!regex.test(str)) {msg= ("bad_char");}
			
			if (msg != '') {
				//$('.checkInputsError').removeClass("hidden");
				//$('.checkInputsPassword').removeClass("hidden").html('Password: '+msg);
				return false;
			}else{
				//$('.checkInputsPassword').addClass("hidden").html('');
				return true;
			}
		

		
	}
	
	passwordFun = function (email, pass) {
	var s = email;
		s += '|'+pass+'|';
		s += s.length+'|!@'+((pass.length*7)+email.length)*7;
		var regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
		var regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
		var regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
		s += ((regnums+regchars)+regupchars)*pass.length+'3571';
		s += (s+''+s);

		for(i=0;i<=50;i++){
			s = Crypto.SHA256(s);
		}
		return s;
	}

	
	//Load Settings for Coin
	$("#coinjs_coin").change();
	$("#settingsBtn").click();
	
	//Load upon Enter from Redeem
	$('#redeemFrom').keyup(function (e) {
		e.preventDefault();
		if (e.keyCode === 13) {
			$("#redeemFromBtn").click();
		}
	});

	
	//Reset Wallet Send Outputs
	$("#walletSendReset").click(function(){
		$("#txFee").val("0.002");
		$("#developerDonation").val("0");
		
		$("#walletSpendTo .addressRemove").parent().fadeOut().remove();
		$.each($("#walletSpendTo .output"), function(i,o){
			var amount = $('.amount',o).val("0.00000000");
			var address = $('.addressTo',o).val("");
		});
		

	});
	
	//Check if user is logged in
	/*
	 @ 'login/session'
	 @password
	 @password2
	 @email
	*/
	function checkUserLogin(profile_data) {
		//var profile_data = (typeof profile_data === 'undefined') ? "" : profile_data;
		profile_data = (typeof profile_data === 'undefined') ? "" : profile_data;
	/*
	var user_profile = { 
		"email" : "email",
		"wallet_type" : "regular",	//regular (login normal address), multisig (login multisig address), key (login with private key)
		"remember_me" : boolean		//true or false (to keep user logged in)
		"signatures" : 2		// total number of signatures required to spend, should be maximum the total objects of "passwords"
		"passwords" : [
			{
				"password" : "blabla",
			},
			{
				"password" : "blabla",
			},
			{
				"password" : "blabla",
			}
		]
	}

	
	//From Login
	
		"email" : email,
		"wallet_type" : "",	//regular (login normal address), multisig (login multisig address), key (login with private key)
		"remember_me" : remember_me,
		"passwords" : [
			{
				"password" : pass,
			},
			{
				"password" : pass2,
			}
		]
		
	*/
		var check_profile_data;
		var remember_me = false;
		//Check if Remember Me option is set to true, save to HTML5 sessionStorage
		if (typeof profile_data.passwords !== "undefined") {
			if( (typeof profile_data.remember_me !== "undefined") &&  profile_data.remember_me.match(/^1|true|checked|on$/)){
				remember_me = true;
			}else
				HTML5.sessionStorage('profile_data').remove();
		}

		
		//Check if Profile Data object keys is undefined
		if (typeof profile_data.passwords !== "undefined" && typeof profile_data.passwords[0].password !== "undefined" && ( typeof profile_data.email !== "undefined" && typeof profile_data.wallet_type !== "undefined" && typeof profile_data.signatures !== "undefined") ){
				
				var pass = profile_data.passwords[0].password;
				if( checkPassword(pass) ){
				
					var email = profile_data.email.toLowerCase();

					var s = passwordFun(email, pass);
								
					coinjs.compressed = true;
					var scriptPubKey = "";
					
					if (debug) {											
						console.log('profile_data 1');
						console.log(profile_data);
					}
					//Check Wallet Type
					//if ( typeof profile_data.passwords[1].password !== "undefined" && checkPassword(profile_data.passwords[1].password) && profile_data.passwords[1].password != "") 
					//if ( profile_data.passwords[1].password != "") 
					//	profile_data.wallet_type = "multisig";
					//else
					//	profile_data.wallet_type = "regular";
					
					if (debug) {
						console.log('profile_data 2');
						console.log(profile_data);
					}
					//Check for Multisig address and Regular address
					//if (profile_data.wallet_type == "multisig" && typeof profile_data.passwords[1].password !== "undefined") {
					if (profile_data.wallet_type == "multisig" ) {
						
						//Create Multisig address
						var pass2 = profile_data.passwords[1].password;
						if( checkPassword(pass2) ){
							
							//Disable the use of creation of a multisig wallet with same public keys
							if (pass != pass2) {
								var s2 = passwordFun(email, pass2);
								var keys = coinjs.newKeys(s);
								var keys2 = coinjs.newKeys(s2);
								var keys_combined = [keys.pubkey, keys2.pubkey];
								
								//console.log('keys_combined: '+keys_combined);
								
								//Check if pubkey is in correct format
								if(coinjs.pubkeydecompress(keys.pubkey) && coinjs.pubkeydecompress(keys2.pubkey)){
									//keys_.push(keys.pubkey); keys_.push(keys2.pubkey); console.log('keys_.push: '+keys_);
									var multisig =  coinjs.pubkeys2MultisigAddress(keys_combined, 2);
									//address, scriptHash, redeemScript
									address = multisig["address"];
									
									var privkeyaes = CryptoJS.AES.encrypt(keys.wif, s);
									//console.log('keys.wif: ', keys.wif);
									//console.log('s: ', s);

									var privkeyaes2 = CryptoJS.AES.encrypt(keys2.wif, s2);

									//console.log('keys2.wif: ', keys.wif);
									//console.log('s2: ', s2);
									
									$("#walletKeys .redeemScript_wallet").val(multisig["redeemScript"]);
									
									$("#walletKeys .privkey2").val(keys2.wif);
									$("#walletKeys .pubkey2").val(keys2.pubkey);
									$("#walletKeys .privkeyaes2").val(privkeyaes2);
									$("#walletKeys .wallet_multisig_keys").removeClass("hidden");
							

								}else{
									$("#openLoginStatus").html("Error while creating Multisig address").removeClass("hidden").fadeOut().fadeIn();
								}

							}else{
								$("#openLoginStatus").html("You must use 2 different passwords!").removeClass("hidden").fadeOut().fadeIn();
							}

						} else {
							$("#openLoginStatus").html("Your 2nd password must at least have 12 chars and must include minimum 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character from \"#$€%&\'()*+,-./:;<=>?@[\]^_`{|}~¤¨½§").removeClass("hidden").fadeOut().fadeIn();							
						}
						
					//Create Regular address
					}else{
						
						var keys = coinjs.newKeys(s);
						
						if(coinjs.pubkeydecompress(keys.pubkey)){

							var address = keys.address;
							var wif = keys.wif;
							var pubkey = keys.pubkey;
							var privkeyaes = CryptoJS.AES.encrypt(keys.wif, s);
							$("#walletKeys .wallet_multisig_keys").addClass("hidden");
							
							
						}else{
							$("#openLoginStatus").html("Error while creating Regular address").removeClass("hidden").fadeOut().fadeIn();
						}
					}
						if($("#walletSegwit").is(":checked")){
							var sw = coinjs.segwitAddress(pubkey);
							address = sw.address;
						}

						$(".amountCoinSymbol").text(coinjs.symbol);
						$("#walletMail").html(email);
						$("#walletAddress").html(address);
						$("#walletAddressExplorer").html(address);
						//$("#walletAddressExplorer").attr('href','http://explorer.bitbay.market/address/'+address);
						//$("#walletHistory").attr('href','http://explorer.bitbay.market/address/'+address);
						$("#walletAddressExplorer").attr('href','https://chainz.cryptoid.info/bay/address.dws?'+address+'.htm');
						$("#walletHistory").attr('href','https://chainz.cryptoid.info/bay/address.dws?'+address+'.htm');

						$("#walletQrCode").html("");
						var qrcode = new QRCode("walletQrCode");
						qrcode.makeCode("bitbay:"+address);


						console.log('keys: ', keys);
						$("#walletKeys .address").val(address);
						$("#walletKeys .privkey").val(keys.wif);
						$("#walletKeys .pubkey").val(keys.pubkey);
						$("#walletKeys .privkeyaes").val(privkeyaes);
						
						//Load Wallet for Client
						if(coinjs.pubkeydecompress(keys.pubkey) || (coinjs.pubkeydecompress(keys2.pubkey))){
							//Store the profile_data on the Client side with HTML5 sessionStorage
							if (remember_me)
								HTML5.sessionStorage('profile_data').set(profile_data);
							else
								HTML5.sessionStorage('profile_data').remove();
					
							if (profile_data.wallet_type == "multisig"){
								//BUG ? public keys not displayed on multisig wallet
								//$("#walletKeys .wallet_maybe_multisig_keys").addClass("hidden");
							}
							
							//Menu Account Info
							$(".accountSessionLogin").addClass("hidden");
							$(".accountSessionLogout").removeClass("hidden");
							$(".walletEmail").text(email);
              $(".walletEmail").attr("data-original-title", email);
								
							$("#openLogin").hide();
							$("#openWallet").removeClass("hidden").show();
							//giorgosk
							$("body").addClass("loggedin").removeClass("loggedout");

							//check if address is multisig, then sign with second private key
							//var profile_data;
							profile_data = HTML5.sessionStorage('profile_data').get();
				
							walletBalance();
							checkBalanceLoop();
              
							
							
						}else{
							$("#openLoginStatus").html("Error Unable to create Address").removeClass("hidden").fadeOut().fadeIn();
						}
					
				} else {
					$("#openLoginStatus").html("Your password must at least have 12 chars and must include minimum 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character from \"!#$€%&\'()*+,-./:;<=>?@[\]^_`{|}~¤¨½§").removeClass("hidden").fadeOut().fadeIn();
				}
				
			
		}
		

		$("#openLoginStatus").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');
		
		copyWalletInfo();	
	}
	//Check User Session
	checkUserLogin(HTML5.sessionStorage('profile_data').get());
	
	//Set correct Wallet type
	$("#openWalletType").change();


});
