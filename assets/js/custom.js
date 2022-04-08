/*!
 * custom.js
 * 
 *
 * Custom JS Settings for Bitbay Offline Wallet
 * Created by anoxydoxy@gmail.com for Bitbay (BAY)
 */

 $.fn.removeClassPrefix = function(prefix) {
     this.each(function(i, el) {
         var classes = el.className.split(" ").filter(function(c) {
             return c.lastIndexOf(prefix, 0) !== 0;
         });
         el.className = $.trim(classes.join(" "));
     });
     return this;
 };
 
function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
} 
function printNewWindow(divName){
  w=window.open();
  w.document.write($('#' + divName).html());
  w.print();
  //w.close();              
}
 
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
  function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

$(document).ready(function() {
  

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
    $("body").addClass("localhost");
  }

  if(getUrlVars()['r'] == 'success'){
    //alert alert-success fade in 
    var message = 
      "<div class='container'><div class='alert alert-success alert-dismissible alert-top'>"
      + "<a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a>"
      + "The transaction was completed succesfully.<br>Your Bay will be sent to your wallet shortly.</div></div>";      
    $('#header').after(message);
  }

  //handle pressing menu items or tabs on top of regular/multisig wallet
  function showRegularWallet(){
    $("#openWalletType").val('regular').trigger('change');
    $("#multisigwallet").removeClass("active");
    $("#regularwallet").addClass("active");    
    //$(".form-openWalletTypeText").text("Regular Wallet");
  }
  function showMultisigWallet(){
    $("#openWalletType").val('multisig').trigger('change');
    $("#regularwallet").removeClass("active");
    $("#multisigwallet").addClass("active");
    //$(".form-openWalletTypeText").text("Multisig m-of-n Wallet");
  }  
	$("#regularwallet,a[href$='#wallet']").on("click", function () {
    showRegularWallet();
	});
	$("#multisigwallet,a[href$='#multisigwallet']").on("click", function () {
    showMultisigWallet();
	});
  //individual multisig does not have its own tab area 
  //we need this workaround when menu item is clicked 
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href");
    var id = $(e.target).attr("id");
    if(target === "#wallet" && id === "multisigwalletLink")
      showMultisigWallet();      
  });
	
  
  
  //disable enable login/create button
	$('#openBtn').prop('disabled', true);
	$('#acceptTerms').on("change",function() {
	 	if($(this).is(":checked")) {
			$('#openBtn')
				.prop('disabled', false)
				.removeClass("btn-flatbay-inactive");
	 	}else{
			$('#openBtn')
				.prop('disabled', true)
				.addClass("btn-flatbay-inactive");
		}
	});

  //remember button pressing
	$('#remember').on("change",function() {
	 	if($(this).is(":checked")) {
			$('#rememberMe').val("true");
			//$('#rememberMe option:eq(true)').prop('selected', true)
	 	}else{
			$('#rememberMe').val("false");
			//$('#rememberMe option:eq(false)').prop('selected', true)
		}
		//console.log($('#rememberMe').val());
	});

  //add class to body to know what tab we are 
  //this helps with css
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab
		target = target.substring(1);
	  $("body").removeClassPrefix("aTab-");
		$("body").addClass("aTab-" + target);
	});


  /* Escape HTML tags */
  function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
  }

  //based on the promise that the walletKeys is of the following format
  //first a label and than 1 or more inputs
  //i.e. label input label input label input input label input etc
  $('#print').on('click', function (e) {
    //console.log(profile_data);
    if(profile_data == null || profile_data === "")
      profile_data = HTML5.sessionStorage('profile_data').get();
      
    var print = [];

    print.push("<h2>BitBay - Wallet Backup Information!</h1>");
    
    //passwords
    print.push("<h3>Email</h2>");
    print.push("<div>" + profile_data.email + "</div>");

    print.push("<h3>Password</h2>");
    print.push("<div>" + safe_tags(profile_data.passwords[0].password) + "</div>");

    if(profile_data.passwords[1].password !== undefined){
      print.push("<h3>Password2</h2>");
      print.push("<div>" + safe_tags(profile_data.passwords[1].password) + "</div>");
    }
    
    var lastIn = "";
    $( "#walletKeys label, #walletKeys input" ).not(".hide").each(function( i ) {
      //console.log($(this).prop("tagName") + " " + i);
      if ( $(this).prop("tagName") == "LABEL" ) {
        print.push("<h3>" + $(this).html() + "</h2>");
        lastIn = "LABEL";
      } else if ( $(this).prop("tagName") == "INPUT" ) {
        var val = $(this).val();
        if(val !== ""){
          print.push("<div>" + val + "</div>");
          lastIn = "INPUT";
        }
        else if(lastIn == "LABEL"){
          print.pop();
          lastIn = "";
        }
      }
    });
    $("#printArea").html(print.join(""));
    //$("#printArea").append(print);
    //$( "<p>Address "+$("#walletKeys input.address").val()+"</p>" ).appendTo( "#printArea" );
    printNewWindow("printArea");
	});
  
  
  //extra validation functions
  function validateElem(id,label) {
    if($(id).val() == $(id +"-confirm").val()){
      return "";
    }
    else {
      return label + " does not match<br/>";
    }
  }

  function confirmEmailPass(){  
    var elem = $('#openBtn');
    if(elem[0] == null) 
      return ;
    var oldClick = $._data(elem[0], 'events').click[0].handler;
		elem.off('click');

    elem.click(function(){
      $("#openLoginStatus").addClass("hidden");
      var confirmPass = $("#confirmPass").prop('checked');
      var error = "";
      var email = $("#openEmail").val()
      if(!validateEmail(email)){
          error = "Not a valid Email<br/>";
      }
      
      //if(window.confirm("Are You Sure?")){
      if(confirmPass){
        error += validateElem("#openEmail","Email");
        error += validateElem("#openPass","Password");
        error += validateElem("#openPass2","Password2");
        if(error){
          $("#openLoginStatus").html(error).removeClass("hidden").fadeOut().fadeIn();
          $("#openLoginStatus").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');


          //$("#errormessages").html(error);
      		return false;          
        }else{
          //$("#errormessages").html("");
          oldClick();          
        }
      } else if(error) {
        //$("#errormessages").html(error);
        $("#openLoginStatus").html(error).removeClass("hidden").fadeOut().fadeIn();
        $("#openLoginStatus").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');

        return false;          
      } else {
        oldClick();
      }
    });    
  }
  confirmEmailPass();
  
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  //changing type of wallet seletion from dropdown to tab/button
  $("#openWalletType").change(function(){
		if (this.value == "multisig"){
      $("#openPass2").parent().removeClass("hidden");
   	  if($("#confirmPass").is(":checked")){
        $("#openPass2-confirm").parent().removeClass("hidden");        
      }
    }
		else{
      $("#openPass2").parent().addClass("hidden");
      $("#openPass2-confirm").parent().addClass("hidden");        
    }      
	})


  //enable/disable confirm email/pass
  //double entry of email/pass
  $('#confirmPass').on("change",function() {
    console.log("confirmPass changed");
    var elements = ".form-email-confirm,.form-password-confirm";
    if($(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

 	  if($(this).is(":checked")) {
      $(elements).removeClass("hidden");
	 	}else{
      $(elements).addClass("hidden");
		}
	});
  
  $(".confirm-input").on("keyup focusout",function(event){
    var confirm = $(this).attr("confirm");
    var val = $("" + confirm).val();
    var val2 = $(this).val();
    //console.log(val + " " + val2);
    if(val === val2){
      $(this).removeClass("unconfirmed");
      $(this).attr("title","");      
      //$(this).setCustomValidity("");
    }else{
      $(this).addClass("unconfirmed");
      //event.type
      $(this).attr("title","do not match");      
      //$(this).setCustomValidity("Not confirmed");      
    }
  });

  $(".confirm-email").on("keyup focusout",function(event){
    var email = $(this).val();
    if(validateEmail(email)){
      $(this).removeClass("unconfirmed");
      $(this).attr("title","");      
      //$(this).setCustomValidity("");
    }else{
      $(this).addClass("unconfirmed");
      //event.type
      $(this).attr("title","Not a valid email");      
      //$(this).setCustomValidity("Not confirmed");      
    }
  });
  
  //hide menu when clicking
  $(".navbar-nav").on("click",function() {
    //console.log("navbar click");
    $(".navbar-collapse").removeClass("in");
  });
  //hide menu when click outside
  $("nobody").on("click",function() {
    //console.log("body click");
    $(".navbar-collapse").removeClass("in");
  });


	//Navbar Submenus
	$('.navbar a.dropdown-toggle').on('click', function(e) {
        var $el = $(this);
        var $parent = $(this).offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if(!$parent.parent().hasClass('nav')) {
            $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
        }

        $('.nav li.open').not($(this).parents("li")).removeClass("open");

        return false;
	});

  var loc = window.location.pathname;
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  //console.log(dir);
  
  $('.navbar a').not('.dropdown-toggle').on('click', function(e){
    if ( window.location.pathname == '/buy.php' ){
      var href = $(this).attr("href");
      console.log(href);
      window.location.href = dir + "/" + href;
    }
  });
  
  
  $("#buyBay").on('click', function(e){
    e.preventDefault();
    var wallet = $("#walletKeys input.address").val();
    var bc = $("body").attr("class");
    //console.log(wallet);
    //$(this).attr("href","buy.php?wallet=" + wallet);
    window.location.href = dir + "/buy.php?wallet=" + wallet + "&bc=" + bc;
  });
  
	//Remove active class for other menus except for the one which is "clicked"
	$('ul.dropdown-menu [data-toggle=tab]').on('click', function(e) {
		var $el = $(this);
		//$('ul.dropdown-menu [data-toggle=tab]').not($(this).parents("li")).addClass("activeHejsan");
		//$el.closest("li").addClass("active");
		$('ul.dropdown-menu [data-toggle=tab]').not($el).closest("li").removeClass("active");
	});

	
	//Theme Switcher
	$('#switcher-bootstrap').on('click', '#themes a', function(){
	  var $this = $(this);
	  //$('#bootstrap-current').text($this.text()); $('#bootstrap-css').attr('href', $this.attr('data-theme'));
	  $('#bootstrap-current').text($this.text()); 
	  $('#bootstrap-css').attr('href', 'assets/css/themes/'+$this.text()+'/bootstrap.min.css');
	  //reset();
	});


	//Login Check/Uncheck
	$('.button-checkbox').each(function(){
		var $widget = $(this),
			$button = $widget.find('button'),
			$checkbox = $widget.find('select#rememberMe'),
			color = $button.data('color'),
			settings = {
					on: {
						icon: 'glyphicon glyphicon-check'
					},
					off: {
						icon: 'glyphicon glyphicon-unchecked'
					}
			};

		$button.on('click', function () {
			
			/*
			if ( !$checkbox.is(':checked') )
				$checkbox.attr('checked', true);
			else
				$checkbox.removeAttr('checked');
			*/
			
			//$("select#rememberMe option[value]")..prop('selected', 'selected');
			if ($checkbox.val() !=  'true')
				$checkbox.val('true');
			else
				$checkbox.val('false');
			
			//$checkbox.prop('checked', !$checkbox.is(':checked'));
			//$checkbox.triggerHandler('change');
			updateDisplay();
		});

		$checkbox.on('change', function () {
			updateDisplay();
		});

		function updateDisplay() {
			var isChecked = ($checkbox.val() == 'true') ? true : false ;
			// Set the button's state
			$button.data('state', (isChecked) ? "on" : "off");

			// Set the button's icon
			$button.find('.state-icon')
				.removeClass()
				.addClass('state-icon ' + settings[$button.data('state')].icon);

			// Update the button's color
			if (isChecked) {
				$button
					.removeClass('btn-default')
					.addClass('btn-' + color + ' active');
			}
			else
			{
				$button
					.removeClass('btn-' + color + ' active')
					.addClass('btn-default');
			}
		}
		function init() {
			updateDisplay();
			// Inject the icon if applicable
			if ($button.find('.state-icon').length == 0) {
				$button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
			}
		}
		init();
    


	});
	


  var walletVersion = "1.135";   //is used for human versioning
  var walletVersionCode = "9";  //is used for the update versioning of the wallet app


  //render client version text
  $('.walletVersion').text('version: '+walletVersion);

  //isUpdateAvailable(false);
  

  //Check for Wallet App updates
function isUpdateAvailable(checkForUpdate = false) {

  //Get Github or Local wallet version
  var app_version_url = "https://raw.githubusercontent.com/bitbaydev/webwallet/master/config.xml";


$.get( app_version_url , function( data ) {
    
    //Get latest updated wallet from Github
    var pattV = /\s+version\s*=\s*"([^"]*)"/;
    var pattVCode = /\s+versionCode\s*=\s*"([^"]*)"/;
    var resultVCode = data.match(pattVCode);
    var resultV = data.match(pattV);
  
    var appVersionOnGit =  parseInt(resultVCode[1]);
    
    
    if(appVersionOnGit > walletVersionCode){
      //alert(resultVCode[1] + ' > ' + walletVersionCode);
      
      PNotify.prototype.options.styling = "bootstrap3";
    //PNotify.prototype.options.delay = 2500;
			var updateIsAvailableBox = new PNotify({
				title: 'New Update is available!',
				text: '<div class="updateAppBox">A new update is available for Bitbay web wallet (' + resultV[1] + '). <br><button class=\'btn btn-success runUpdate\'>Update</button> <button class=\'btn btn-danger pull-right cancelUpdate\'>Dismiss</button></div>',
        type: 'info',
        buttons: {
          closer: false,
          sticker: false
        },
        mouse_reset: true,
        remove: true,
				//type: 'notice',
        after_init: function(notice) {
          notice.elem.on('click', 'button', function() {
              notice.attention('bounce');
          });
        },
        mobile: {
          swipe_dismiss: true,
          styling: true
        }
      });
      updateIsAvailableBox.get().find('.updateAppBox').on('click', 'button.cancelUpdate', function(){
          updateIsAvailableBox.remove();
          alert('Cancel Update!');
      });
      
      updateIsAvailableBox.get().find('.updateAppBox').on('click', 'button.runUpdate', 
        function(){
          alert('Navigate user to PlayStore/AppStore');
      });
    
    
    }
    
    //Compare with the current client/browser wallet
    
},'text');

}


  //Dynamic Peg Pie Chart
  //https://codepen.io/miyavibest/pen/wdtaC
  
  /* <3 
https://codepen.io/SergioLMacia/pen/eYYMjbm
*/




});

//Create Notifies for users for Balance change 
PNotify_helper = function (title, text, type) {
	$(function(){
		PNotify.prototype.options.styling = "bootstrap3";
    //Giorgos test
    //PNotify.prototype.options.delay = 2500;
			new PNotify({
				title: title,
				text: text,
				type: type,
        mobile: {
          swipe_dismiss: true,
          styling: true
        }
		});
	});	
}
//Remove all PNotifies
PNotify_remove = function () {
	$(function(){
		PNotify.removeAll();
		//$("#ui-pnotify").remove();
		//ui-pnotify  ui-pnotify-fade-normal ui-pnotify-mobile-able ui-pnotify-in ui-pnotify-fade-in ui-pnotify-move
		
	});	
}



//privkey signing progressbar init
 var sign_progressbar;

  //init progressbar for signing
  if(document.getElementById('sign').classList.contains('active')){
   sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress')});
    //console.log('nanobar-progress');
  }else{
   sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress-manual')});
    //console.log('nanobar-progress-manual');
  }
  sign_progressbar.go(0);


//https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
function generatePassword(length = 40) {
  var generatePass = (
  //length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'
) =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

  return generatePass();  
}

//Crypto Random Password generator! 
$('.generatePassword').on("click", function () {
    var $el = $(this);

    if($el[0].dataset.inputFor == 'MnemonicBrainwallet') {
      $("#newMnemonicxpub").val("");
      $("#newMnemonicxprv").val("");
    }

    var inputElPass = $el.attr( "data-input-for");
    $("#"+inputElPass).val(generatePassword());
  });
/*

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
   // Document already fully loaded
   ready();
} else {
   // Add event listener for DOMContentLoaded (fires when document is fully loaded)
   document.addEventListener("DOMContentLoaded", ready);
}

function ready() {
   // Handler here

  

}




function domReady(fn) {
  // If we're early to the party
  document.addEventListener("DOMContentLoaded", fn);
  // If late; I mean on time.
  if (document.readyState === "interactive" || document.readyState === "complete" ) {

  }
}


document.addEventListener("DOMContentLoaded", function() {

});


// alternative to DOMContentLoaded
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        // Initialize your application or run some code.




    }
}


domReady(() => console.log("DOM is ready, come and get it!"));
*/