var profile_data = "";
var debug = false;

$(document).ready(function() {

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
				},
				{
					"password" : pass2
				}
			]
		};
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

	//$("#walletLogout").click(function(sessionDestroy = false){
	$("#walletLogout").click(function(e){
		$("#openEmail").val("");
		$("#openEmail-confirm").val("");
		$("#openPass").val("");
		$("#openPass-confirm").val("");
		$("#openPass2").val("");
		$("#openPass2-confirm").val("");
		
		//Menu Account Info
		$(".walletEmail").text("");
		$(".walletBalance").text("");
		$(".walletBalanceLiquid").text("");
		$(".walletBalanceReserve").text("");
		$(".walletBalanceFrozen").text("");
		$(".accountSessionLogout").addClass("hide");
		$(".accountSessionLogin").removeClass("hide");
		
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

	$("#walletConfirmSend").click(function(){
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

		tx.addUnspent($("#walletAddress").html(), function(data){

			var dreserve = (data.reserve/100000000).toFixed(8) * 1;
			var dliquid = (data.liquid/100000000).toFixed(8) * 1;
			var dvalue = (data.value/100000000).toFixed(8) * 1;
			total = (total*1).toFixed(8) * 1;
			
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
	
					// clone the transaction with out using coinjs.clone() function as it gives us trouble
					var tx2 = coinjs.transaction(); 
					var txunspent = tx2.deserialize(tx.serialize()); 
	
					// then sign, regular wallet
					var signed = txunspent.sign($("#walletKeys .privkey").val());
	
					// then sign again, if multisig wallet
					if ($("#walletKeys .privkey2").val() != "") {
						txunspent = tx2.deserialize(signed); 
						signed = txunspent.sign($("#walletKeys .privkey2").val());
					}
					if (debug) {
						console.log("tx:" + signed);
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
							if(success || callback_result.match(/^[a-f0-9]+$/)){
								var mess = 'Your transaction was successfully sent: <br />'
								 +'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
								// +'<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
								$("#walletSendConfirmStatus").removeClass('hidden').removeClass('alert-danger').addClass('alert-success').html(mess);
	
								if (devamountVal > 0)
									$("#walletSendConfirmStatus").html( $("#walletSendConfirmStatus").html() + '<br /> <span class="glyphicon glyphicon-heart"></span> Thank you very much for your donation');
								$("#walletConfirmSend").html("Send");
								$("#walletConfirmSend").addClass("hide");
							} else {
								//$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
								$("#walletSendConfirmStatus").removeClass('hidden').removeClass('alert-success').addClass('alert-danger').html(unescape(callback_result));
								$("#walletSendFailTransaction").removeClass('hidden');
								$("#walletSendFailTransaction textarea").val(signed);
								$("#walletConfirmSend").html("Send");
								thisbtn.attr('disabled',false);
							}
						}
						/*	
						if($(data).find("result").text()=="1"){
							$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-success').html("txid: "+$(data).find("txid").text());
						} else {
							$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape($(data).find("response").text()).replace(/\+/g,' '));
							$("#walletSendFailTransaction").removeClass('hidden');
							$("#walletSendFailTransaction textarea").val(signed);
							thisbtn.attr('disabled',false);
						}
						*/
	
						// update wallet balance
						walletBalance();
	
					}, signed);
				} else {
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
							var out_index = String(0+tx.ins.length);
							out_indexes = out_index+":"+out_index+":"+out_index;
					}
					else if (payees == 2) { // trick to have triple to use sort
							var out_index1 = String(0+tx.ins.length);
							var out_index2 = String(1+tx.ins.length);
							out_indexes = out_index1+":"+out_index1+":"+out_index2+":"+out_index2;
					}
					else {
							for(var i=0; i<payees; i++) {
									if (out_indexes != "")
											out_indexes += ":";
									out_indexes += String(i+tx.ins.length);
							}
					}
					
					for(var i=0; i<tx.ins.length; i++) {
						var fnote = "**F**"+out_indexes;
						var fnoteb = Crypto.charenc.UTF8.stringToBytes(fnote);
						console.log("fnote:" + fnote);
						console.log("fnotehex:" + Crypto.util.bytesToHex(fnoteb));
						tx.adddata(Crypto.util.bytesToHex(fnoteb), 5590);
					};
					
					// sendto
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
	
					// clone the transaction with out using coinjs.clone() function as it gives us trouble
					var tx2 = coinjs.transaction(); 
					var txunspent = tx2.deserialize(tx.serialize()); 
	
					// then sign, regular wallet
					var signed = txunspent.sign($("#walletKeys .privkey").val());
	
					// then sign again, if multisig wallet
					if ($("#walletKeys .privkey2").val() != "") {
						txunspent = tx2.deserialize(signed); 
						signed = txunspent.sign($("#walletKeys .privkey2").val());
					}
					if (debug) {
						console.log("tx:" + signed);
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
							if(success || callback_result.match(/^[a-f0-9]+$/)){
								var mess = 'Your transaction was successfully sent: <br />'
								 +'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
								// +'<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
								$("#walletSendConfirmStatus").removeClass('hidden').removeClass('alert-danger').addClass('alert-success').html(mess);
	
								if (devamountVal > 0)
									$("#walletSendConfirmStatus").html( $("#walletSendConfirmStatus").html() + '<br /> <span class="glyphicon glyphicon-heart"></span> Thank you very much for your donation');
								$("#walletConfirmSend").html("Send");
								$("#walletConfirmSend").addClass("hide");
							} else {
								//$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
								$("#walletSendConfirmStatus").removeClass('hidden').removeClass('alert-success').addClass('alert-danger').html(unescape(callback_result));
								$("#walletSendFailTransaction").removeClass('hidden');
								$("#walletSendFailTransaction textarea").val(signed);
								$("#walletConfirmSend").html("Send");
								thisbtn.attr('disabled',false);
							}
						}
						/*	
						if($(data).find("result").text()=="1"){
							$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-success').html("txid: "+$(data).find("txid").text());
						} else {
							$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape($(data).find("response").text()).replace(/\+/g,' '));
							$("#walletSendFailTransaction").removeClass('hidden');
							$("#walletSendFailTransaction textarea").val(signed);
							thisbtn.attr('disabled',false);
						}
						*/
	
						// update wallet balance
						walletBalance();
	
					}, signed);
				} else {
					$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("You have a confirmed reserve balance of "+dreserve+" "+coinjs.symbol+", unable to send "+total+" "+coinjs.symbol+"").fadeOut().fadeIn();
					$("#walletConfirmSend").html("Send");
					thisbtn.attr('disabled',false);
				}
			} else {
					$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("Unknown send type").fadeOut().fadeIn();
					$("#walletConfirmSend").html("Send");
					thisbtn.attr('disabled',false);
			}

			$("#walletLoader").addClass("hidden");
		});
	});

	$("#walletSendBtn").click(function(){

		$("#walletSendFailTransaction").addClass('hidden');
		$("#walletSendStatus").addClass("hidden").html("");

		$("#walletConfirmSend").removeClass("hide");
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
		$("#walletSpendTo .addressRemove").unbind("");
		$("#walletSpendTo .addressRemove").click(function(){
			$(this).parent().fadeOut().remove();
		});
	});

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
				}else if ( newBalance <  balance) {
					PNotify_helper('New Withdraw', 'A withdrawal was made, new Balance: '+newBalance, 'error');
				}else if ( newBalance >  balance ){
					PNotify_helper('New Deposit', 'You got a new deposit, new Balance: '+newBalance, 'success');
				}else{
					PNotify_helper('Balance', 'Your current Balance is: '+newBalance, 'error');
				}
				$(".walletBalance").html(newBalance+" "+coinjs.symbol).attr('rel',newBalance).fadeOut().fadeIn();
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
		});
	}

	function checkBalanceLoop(){
		setTimeout(function(){
			walletBalance();
			checkBalanceLoop();
		},100000);
	}

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

		$("#multiSigData").removeClass('show').addClass('hidden').fadeOut();
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
			$("#multiSigData").removeClass('hidden').addClass('show').fadeIn();
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
			$('#timeLockedBlockHeight').removeClass('hidden').show();
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

        $("#timeLockedData").removeClass('show').addClass('hidden').fadeOut();
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
	            $("#timeLockedData").removeClass('hidden').addClass('show').fadeIn();
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

	/* new -> transaction code */

	$("#recipients .addressAddTo").click(function(){
		if($("#recipients .addressRemoveTo").length<19){
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

	$("#inputs .txidAdd").click(function(){
		var clone = '<div class="row inputs"><br>'+$(this).parent().parent().html()+'</div>';
		$("#inputs").append(clone);
		$("#inputs .txidClear:last").remove();
		$("#inputs .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
		$("#inputs .glyphicon-minus:last").parent().removeClass('txidAdd').addClass('txidRemove');
		$("#inputs .txidRemove").unbind("");
		$("#inputs .txidRemove").click(function(){
			$(this).parent().parent().fadeOut().remove();
			totalInputAmount();
		});
		$("#inputs .row:last input").attr('disabled',false);

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
				if($("#txRBF").is(":checked")){
					seq = 0xffffffff-2;
				}

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
			} else { // neither address nor data
				$(o).addClass('has-error');
				$('#putTabs a[href="#txoutputs"]').attr('style','color:#a94442;');
			}
		});


		if(!$("#recipients .row, #inputs .row").hasClass('has-error')){
			$("#transactionCreate textarea").val(tx.serialize());
			$("#transactionCreate .txSize").html(tx.size());

			$("#transactionCreate").removeClass("hidden");

			// Check fee against hard 0.01 as well as fluid 200 satoshis per byte calculation.
			//if($("#transactionFee").val()>=0.01 || $("#transactionFee").val()>= estimatedTxSize * 200 * 1e-8){
			if($("#transactionFee").val()>=0.002){
				var warning = "<p>Please be aware that you have created a transaction with what seems to be a very high fee of "+$("#transactionFee").val()+" BAY!</p>"
					+ "<p>A fee above 0.001 is usually OK";
				$("#modalWarningFee .modal-body").html(warning);
				$("#modalWarningFee").modal("show");
			}	else if($("#transactionFee").val()<0.001){
				var warning = "<p>Please be aware that you have created a transaction with what seems to be a very low fee of "+$("#transactionFee").val()+" BAY!</p>"
					+ "<p>You are advised to adjust the amount(s) so that a transaction fee is 0.001 or greater, otherwise the transcation almost certainly will be rejected by the network</p>";
				$("#modalWarningFee .modal-body").html(warning);
				$("#modalWarningFee").modal("show");
			}

		} else {
			$("#transactionCreateStatus").removeClass("hidden").html("One or more input or output is invalid").fadeOut().fadeIn();
		}
	});

	$(".txidClear").click(function(){
		$("#inputs .row:first input").attr('disabled',false);
		$("#inputs .row:first input").val("");
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

	/* code for the qr code scanner */

	$(".qrcodeScanner").click(function(){
		if ((typeof MediaStreamTrack === 'function') && typeof MediaStreamTrack.getSources === 'function'){
			MediaStreamTrack.getSources(function(sourceInfos){
				var f = 0;
				$("select#videoSource").html("");
				for (var i = 0; i !== sourceInfos.length; ++i) {
					var sourceInfo = sourceInfos[i];
					var option = document.createElement('option');
					option.value = sourceInfo.id;
					if (sourceInfo.kind === 'video') {
						option.text = sourceInfo.label || 'camera ' + ($("select#videoSource options").length + 1);
						$(option).appendTo("select#videoSource");
 					}
				}
			});

			$("#videoSource").unbind("change").change(function(){
				scannerStart()
			});

		} else {
			$("#videoSource").addClass("hidden");
		}
		scannerStart();
		$("#qrcode-scanner-callback-to").html($(this).attr('forward-result'));
	});

	function scannerStart(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || false;
		if(navigator.getUserMedia){
			if (!!window.stream) {
				$("video").attr('src',null);
				window.stream.stop();
  			}

			var videoSource = $("select#videoSource").val();
			var constraints = {
				video: {
					optional: [{sourceId: videoSource}]
				}
			};

			navigator.getUserMedia(constraints, function(stream){
				window.stream = stream; // make stream available to console
				var videoElement = document.querySelector('video');
				videoElement.src = window.URL.createObjectURL(stream);
				videoElement.play();
			}, function(error){ });

			QCodeDecoder().decodeFromCamera(document.getElementById('videoReader'), function(er,data){
				if(!er){
					var match = data.match(/^bitcoin\:([13][a-z0-9]{26,33})/i);
					var result = match ? match[1] : data;
					$(""+$("#qrcode-scanner-callback-to").html()).val(result);
					$("#qrScanClose").click();
				}
			});
		} else {
			$("#videoReaderError").removeClass("hidden");
			$("#videoReader, #videoSource").addClass("hidden");
		}
	}

	/* redeem from button code */

	$("#redeemFromBtn").click(function(){
		var redeem = redeemingFrom($("#redeemFrom").val());

		$("#redeemFromStatus, #redeemFromAddress").addClass('hidden');

		if(redeem.from=='multisigAddress'){
			$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> You should use the redeem script, not the multisig address!');
			return false;
		}

		if(redeem.from=='other'){
			$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> The address or multisig redeem script you have entered is invalid');
			return false;
		}

		if($("#clearInputsOnLoad").is(":checked")){
			$("#inputs .txidRemove, #inputs .txidClear").click();
		}

		$("#redeemFromBtn").html("Please wait, loading...").attr('disabled',true);

		var host = $(this).attr('rel');


		if(host=='chain.so_litecoin'){
			listUnspentChainso_Litecoin(redeem);
		} else if(host=='chain.so_dogecoin'){
			listUnspentChainso_Dogecoin(redeem);
		} else if(host=='cryptoid.info_carboncoin'){
			listUnspentCryptoidinfo_Carboncoin(redeem);
		} else if(host=='explorer.bitbay.market'){
			listUnspentExplorer_Bitbay(redeem);
		} else {
			listUnspentDefault(redeem);
		}

		if($("#redeemFromStatus").hasClass("hidden")) {
			// An ethical dilemma: Should we automatically set nLockTime?
			if(redeem.from == 'redeemScript' && redeem.decodedRs.type == "hodl__") {
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
			r.isMultisig = false;
		} else if (decode.version == coinjs.priv){ // wif key
			var a = coinjs.wif2address(string);
			r.addr = a['address'];
			r.from = 'wif';
			r.isMultisig = false;
		} else if (decode.version == coinjs.multisig){ // mulisig address
			r.addr = '';
			r.from = 'multisigAddress';
			r.isMultisig = false;
		} else {
			var script = coinjs.script();
			var decodeRs = script.decodeRedeemScript(string);
			if(decodeRs){ // redeem script
				r.addr = decodeRs['address'];
				r.from = 'redeemScript';
				r.decodedRs = decodeRs;
				r.isMultisig = true; // not quite, may be hodl
			} else { // something else
				r.addr = '';
				r.from = 'other';
				r.isMultisig = false;
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
	function addOutput(tx, n, script, amount) {
		if(tx){
			if($("#inputs .txId:last").val()!=""){
				$("#inputs .txidAdd").click();
			}

			$("#inputs .row:last input").attr('disabled',true);

			var txid = ((tx).match(/.{1,2}/g).reverse()).join("")+'';

			
			$("#inputs .txId:last").val(txid);
			$("#inputs .txIdN:last").val(n);
			$("#inputs .txIdAmount:last").val(amount);

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
				$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

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


	/* retrieve unspent data from chainso for litecoin */
	function listUnspentChainso_Litecoin(redeem){
		$.ajax ({
			type: "GET",
			url: "https://chain.so/api/v2/get_tx_unspent/ltc/"+redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if((data.status && data.data) && data.status=='success'){
					$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					for(var i in data.data.txs){
						var o = data.data.txs[i];
						var tx = ((o.txid).match(/.{1,2}/g).reverse()).join("")+'';
						var n = o.output_no;
						var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script_hex;
						var amount = o.value;
						addOutput(tx, n, script, amount);
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}


	/* retrieve unspent data from chain.so for carboncoin */
	function listUnspentCryptoidinfo_Carboncoin(redeem) {
		
		$.ajax ({
			type: "POST",
			url: "https://coinb.in/api/",
			data: 'uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=carboncoin&request=listunspent&address='+redeem.addr,
			dataType: "xml",
			error: function() {
				$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
                        success: function(data) {
				if($(data).find("result").text()==1){
					$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					$.each($(data).find("unspent").children(), function(i,o){
						var tx = $(o).find("tx_hash").text();
						var n = $(o).find("tx_output_n").text();
						var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script_hex;
						var amount = (($(o).find("value").text()*1)/100000000).toFixed(8);
						addOutput(tx, n, script, amount);
					});
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});

	}

	/* retrieve unspent data from chain.so for dogecoin */
	function listUnspentChainso_Dogecoin(redeem){
		$.ajax ({
			type: "GET",
			url: "https://chain.so/api/v2/get_tx_unspent/doge/"+redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if((data.status && data.data) && data.status=='success'){
					$("#redeemFromAddress").removeClass('hidden').html(
						'<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					for(var i in data.data.txs){
						var o = data.data.txs[i];
						var tx = ((""+o.txid).match(/.{1,2}/g).reverse()).join("")+'';
						if(tx.match(/^[a-f0-9]+$/)){
							var n = o.output_no;
							var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script_hex;
							var amount = o.value;
							addOutput(tx, n, script, amount);
						}
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}

/* retrieve unspent data from chain.so for Bitbay */
	function listUnspentExplorer_Bitbay(redeem){
		
		//Get scriptPubKey
		var s = coinjs.script();
		var scriptPubKey = s.pubkeyHash(redeem.addr);
		
		//Check for Locked time address

		var scriptPubKey_buffer = Crypto.util.bytesToHex(scriptPubKey.buffer);
		
		if (debug) {
			for (var k in redeem){
				if (redeem.hasOwnProperty(k)) {
					 console.log("Key is " + k + ", value is" + redeem[k]);
				}
			}
		}

		

		
		
		$.ajax ({
			type: "GET",
			//url: "http://195.181.242.206:9998/api?method=blockchain.address.listunspent",
			url:  coinjs.host + "/listunspent/" + redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if((data.api_status  == "success") ){
					if (Object.keys(data['result']).length > 0){
						//$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
						$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+coinjs.host+'?method=blockchain.address.listunspent&params='+redeem.addr+'" target="_blank">'+redeem.addr+'</a>.');
						

							//if((data.tx) && data.tx.hash){
							for(var i in data.result){
								var o = data.result[i];
								if (o.tx_hash){
									var tx = o.tx_hash;
									var script = (redeem.isMultisig==false) ? o.script : $("#redeemFrom").val();

									var tx = ((""+tx).match(/.{1,2}/g).reverse()).join("")+'';
									//if(tx.match(/^[a-f0-9]+$/) && scriptPubKey_buffer == script){
									if(tx.match(/^[a-f0-9]+$/)){
										var n = o.tx_pos;
										//var script = scriptPubKey_buffer;
										var script = script;
										var amount = (o.value/100000000).toFixed(8);
										addOutput(tx, n, script, amount);
										if (debug) {
											console.log('txId: ' + tx + ' txIdN: '+n+' txIdAmount: ' + amount + ' script: '+ script);
										}
									}
								}
							}
							
							//Inform about Time Locked Address if found
							if( redeem.from == 'redeemScript' && redeem.decodedRs.type == "hodl__" ) {
								//This is a Time locked address with release date
								var checkLocktimeBlockdDate = ( redeem.decodedRs.checklocktimeverify >= 500000000 )? (new Date(redeem.decodedRs.checklocktimeverify*1000).toUTCString()) : ("Block height "+redeem.decodedRs.checklocktimeverify);
								
								$("#redeemFromAddress").html( $("#redeemFromAddress").html() + ' <div class="alert alert-danger" id="redeemFromAddressLocktime">This is a Time Locked Address, unlock the funds after this Date/Block: <strong>' + checkLocktimeBlockdDate+'</strong></div>');
							}
							
							
					} else {
						$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, there are no unspent outputs.');
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
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
		$.each($("#inputs .txIdAmount"), function(i,o){
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
		if($("#optionsAdvanced").hasClass('hidden')){
			$("#glyphcollapse").removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#optionsAdvanced").removeClass("hidden");
		} else {
			$("#glyphcollapse").removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#optionsAdvanced").addClass("hidden");
		}
	});

	/* broadcast a transaction */

	$("#rawSubmitBtn").click(function(){
		rawSubmitDefault(this);
	});

	// broadcast transaction vai coinbin (default)
	function rawSubmitDefault(btn){ 
		var thisbtn = btn;		
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=sendrawtransaction',
			data: {'rawtx':$("#rawTransaction").val()},
			dataType: "xml",
			error: function(data) {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(" There was an error submitting your request, please try again").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
            success: function(data) {
				$("#rawTransactionStatus").html(unescape($(data).find("response").text()).replace(/\+/g,' ')).removeClass('hidden');
				if($(data).find("result").text()==1){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger');
					$("#rawTransactionStatus").html('txid: '+$(data).find("txid").text());
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via cryptoid
	function rawSubmitcryptoid_Carboncoin(thisbtn) {
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=carboncoin&request=sendrawtransaction',
			data: {'rawtx':$("#rawTransaction").val()},
			dataType: "xml",
			error: function(data) {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(" There was an error submitting your request, please try again").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
            success: function(data) {
				$("#rawTransactionStatus").html(unescape($(data).find("response").text()).replace(/\+/g,' ')).removeClass('hidden');
				if($(data).find("result").text()==1){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger');
					$("#rawTransactionStatus").html('txid: '+$(data).find("txid").text());
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

// broadcast transaction via chain.so (mainnet)
	function rawSubmitExplorer_Bitbay(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "GET",
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
					callback_result =  data.result
					if(callback_result.match(/^[a-f0-9]+$/)){
						var mess = 'Your transaction was successfully sent: <br />'
						+'<a href="https://chainz.cryptoid.info/bay/tx.dws?'+callback_result+'.htm" target="_blank" >Txid: ' + callback_result + '</a>';
						//+ '<a href="http://explorer.bitbay.market/tx/'+callback_result+'" target="_blank" >Txid: ' + callback_result + '</a>';
						$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(mess);
					} else {
						//$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape(callback_result).replace(/\+/g,' '));
						$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(unescape(callback_result)).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
					}
				}else{
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via chain.so (mainnet)
	function rawSubmitChainso_BitcoinMainnet(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://chain.so/api/v2/send_tx/BTC/",
			data: {"tx_hex":$("#rawTransaction").val()},
			dataType: "json",
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.data.tx_hex) ? obj.data.tx_hex : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
            success: function(data) {
				if(data.status && data.data.txid){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.data.txid);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via blockcypher.com (mainnet)
	function rawSubmitblockcypher_BitcoinMainnet(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://api.blockcypher.com/v1/btc/main/txs/push",
			data: JSON.stringify({"tx":$("#rawTransaction").val()}),
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.error) ? obj.error : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
            success: function(data) {
				if((data.tx) && data.tx.hash){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.tx.hash);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}


	// broadcast transaction via chain.so for dogecoin
	function rawSubmitchainso_dogecoin(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
                $.ajax ({
                        type: "POST",
                        url: "https://chain.so/api/v2/send_tx/DOGE",
			data: {"tx_hex":$("#rawTransaction").val()},
                        dataType: "json",
                        error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.data.tx_hex) ? ' '+obj.data.tx_hex : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			//	console.error(JSON.stringify(data, null, 4));
                        },
                        success: function(data) {
			//	console.info(JSON.stringify(data, null, 4));
				if((data.status && data.data) && data.status=='success'){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: ' + data.data.txid);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
                        }
                });
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
							$("#verifyStatus").removeClass('hidden').fadeOut().fadeIn();
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
			$("#verifyRsDataMultisig").addClass('hidden');
			$("#verifyRsDataHodl").addClass('hidden');
			$("#verifyRsDataSegWit").addClass('hidden');
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
				$("#verifyRsDataMultisig").removeClass('hidden');
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} else if(decode.type == "segwit__"){
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataSegWit .segWitAddress").val(decode['address']);
				$("#verifyRsDataSegWit").removeClass('hidden');
				return true;
			} else if(decode.type == "hodl__") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val(decode['address']);							//Hodl Address field
				$("#verifyRsDataHodl .pubkey").val(coinjs.pubkey2address(decode['pubkey']));	//Required Singature field

				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass('hidden');
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} else if(decode.type == "hodl__p2sh") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val((decode['pubkey']));	//Hodl Address field
				$("#verifyRsDataHodl .pubkey").val(decode['address']);		//Required Singature field

				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass('hidden');
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
			$("#verifyTransactionData .transactionLockTime").html($("#verifyTransactionData .transactionLockTime").html() + " - This is a Time Locked Address, unlock the funds after this Date/Block.");
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

					h += '<tr>';
					h += '<td><input type="text" class="form-control" value="(OP_RETURN) '+data+'" readonly></td>';
					h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
					h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
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
			var derived = hd.derive(i);
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


	/* sign code */

	$("#signBtn").click(function(){
		var wifkey = $("#signPrivateKey");
		var script = $("#signTransaction");

		if(coinjs.addressDecode(wifkey.val())){
			$(wifkey).parent().removeClass('has-error');
		} else {
			$(wifkey).parent().addClass('has-error');
		}

		if((script.val()).match(/^[a-f0-9]+$/ig)){
			$(script).parent().removeClass('has-error');
		} else {
			$(script).parent().addClass('has-error');
		}

		if($("#sign .has-error").length==0){
			$("#signedDataError").addClass('hidden');
			try {
				var tx = coinjs.transaction();
				var t = tx.deserialize(script.val());

				var signed = t.sign(wifkey.val(), $("#sighashType option:selected").val());
				$("#signedData textarea").val(signed);
				$("#signedData .txSize").html(t.size());
				$("#signedData").removeClass('hidden').fadeIn();
			} catch(e) {
				// console.log(e);
			}
		} else {
			$("#signedDataError").removeClass('hidden');
			$("#signedData").addClass('hidden');
		}
	});

	$("#sighashType").change(function(){
		$("#sighashTypeInfo").html($("option:selected",this).attr('rel')).fadeOut().fadeIn();
	});

	$("#signAdvancedCollapse").click(function(){
		if($("#signAdvanced").hasClass('hidden')){
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

	if (location.hash !== ''){
		$('a[href="' + location.hash + '"]').tab('show');
	}

	$(".showKey").click(function(){
		if ($(this).data('hidden') === false) {
			$("input[type='text']",$(this).parent().parent()).attr('type','password');
			$(this).data('hidden', true);
			$(this).text("Show");
		} else {
			$("input[type='password']",$(this).parent().parent()).attr('type','text');
			$(this).data('hidden', false);
			$(this).text("Hide");
		}
	});

	$("#homeBtn").click(function(e){
		e.preventDefault();
		history.pushState(null, null, '#home');
		$("#header .active, #content .tab-content").removeClass("active");
		$("#home").addClass("active");
	});

	$('a[data-toggle="tab"]').on('click', function(e) {
		e.preventDefault();
		var attr = $(e.target).attr('href');
		// For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
		if (typeof attr !== typeof undefined && attr !== false) {
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
		//$("#walletLogout").click({sessionDestroy : true });

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
			
			configureBroadcast();
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
		var host = $("#coinjs_broadcast option:selected").val();
		$("#rawSubmitBtn").unbind("");
		if(host=="chain.so_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso_BitcoinMainnet(this);
			});
		} else if(host=="chain.so_dogecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitchainso_dogecoin(this);
			});
		} else if(host=="blockcypher_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockcypher_BitcoinMainnet(this);
			});
		} else if(host=="cryptoid.info_carboncoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitcryptoid_Carboncoin(this);
			});
		} else if(host=="explorer.bitbay.market"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitExplorer_Bitbay(this);
			});
		} else {
			$("#rawSubmitBtn").click(function(){
				rawSubmitDefault(this); // revert to default
			});
		}
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
			} else if (str.search(/[^a-zA-Z0-9\!\@\€\¤\£\`\´\#\$\"\'\%\^\&\*\(\)\_\+\.\=\~\¨\|\,\;\:\!\-\[\]\}\{\/\\\?\>\<\^]/) != -1) {
				msg= ("bad_char");
			}else {
				msg=("");
				//$('.checkInputsPassword').addClass('hide')
			}
			
			// pattern to match : At least one number ,one letter and one special character
			//var regex = /^(((.*\d.*[A-Z].*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*))|(.*[A-Z].*\d.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*)|(.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*[A-Z].*\d.*)|(.*[!@#%&¨*¤()+-={}[\]"'*:.,<>_\-$€%^&amp;amp;*? ~].*\d.*[A-Z].*))$/i;
			//var regex = /.*\d.*\w.*\D.*/i;
			//if (!regex.test(str)) {msg= ("bad_char");}
			
			
			if (msg != '') {
				//$('.checkInputsError').removeClass('hide');
				//$('.checkInputsPassword').removeClass('hide').html('Password: '+msg);
				return false;
			}else{
				//$('.checkInputsPassword').addClass('hide').html('');
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
									var privkeyaes2 = CryptoJS.AES.encrypt(keys2.wif, s2);
									
									$("#walletKeys .redeemScript_wallet").val(multisig["redeemScript"]);
									
									$("#walletKeys .privkey2").val(keys2.wif);
									$("#walletKeys .pubkey2").val(keys2.pubkey);
									$("#walletKeys .privkeyaes2").val(privkeyaes2);
									$("#walletKeys .wallet_multisig_keys").removeClass("hide");
							

								}else{
									$("#openLoginStatus").html("Error while creating Multisig address").removeClass("hidden").fadeOut().fadeIn();
								}

							}else{
								$("#openLoginStatus").html("You must use 2 different passwords!").removeClass("hidden").fadeOut().fadeIn();
							}

						} else {
							$("#openLoginStatus").html("Your 2nd password must at least have 12 chars and must include minimum 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character from !@#$%^&*()_+.=,;:!-[]}{/\?><^").removeClass("hidden").fadeOut().fadeIn();							
						}
						
					//Create Regular address
					}else{
						
						var keys = coinjs.newKeys(s);
						
						if(coinjs.pubkeydecompress(keys.pubkey)){

							var address = keys.address;
							var wif = keys.wif;
							var pubkey = keys.pubkey;
							var privkeyaes = CryptoJS.AES.encrypt(keys.wif, s);
							$("#walletKeys .wallet_multisig_keys").addClass("hide");
							
							
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
								//$("#walletKeys .wallet_maybe_multisig_keys").addClass("hide");
							}
							
							//Menu Account Info
							$(".accountSessionLogin").addClass("hide");
							$(".accountSessionLogout").removeClass("hide");
							$(".walletEmail").text(email);
								
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
					$("#openLoginStatus").html("Your password must at least have 12 chars and must include minimum 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character from !@#$%^&*()_+.=,;:!-[]}{/\?><^").removeClass("hidden").fadeOut().fadeIn();
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
