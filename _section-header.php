<!DOCTYPE html> 
<html lang="en">
	<head>

		<title>Bitbay Wallet - Decentralized Markets and Smarts Contracts</title>

        <meta http-equiv="content-type" content="text/html;charset=utf-8" />
		<meta name="keywords" content="bitbay, wallet, multisig, locktime, market, multisignature, address, browser, javascript, js, broadcast, transaction, verify, decode" />
		<meta name="description" content="A Bitbay Wallet written in Javascript. Supports Multisig, Custom Transactions, nLockTime and more!" />

		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Security-Policy" 
				 content="
							default-src *; 
						  style-src * 'self' 'unsafe-inline' 'unsafe-eval'; 
						  script-src * 'self' 'unsafe-inline' 'unsafe-eval';">
		<!-- ****** faviconit.com favicons ****** -->
		<link rel="shortcut icon" href="assets/images/favicon/favicon.ico">
		<link rel="icon" sizes="16x16 32x32 64x64" href="assets/images/favicon/favicon.ico">
		<link rel="icon" type="image/png" sizes="196x196" href="assets/images/favicon/favicon-192.png">
		<link rel="icon" type="image/png" sizes="160x160" href="assets/images/favicon/favicon-160.png">
		<link rel="icon" type="image/png" sizes="96x96" href="assets/images/favicon/favicon-96.png">
		<link rel="icon" type="image/png" sizes="64x64" href="assets/images/favicon/favicon-64.png">
		<link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon/favicon-32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon/favicon-16.png">
		<link rel="apple-touch-icon" href="assets/images/favicon/favicon-57.png">
		<link rel="apple-touch-icon" sizes="114x114" href="assets/images/favicon/favicon-114.png">
		<link rel="apple-touch-icon" sizes="72x72" href="assets/images/favicon/favicon-72.png">
		<link rel="apple-touch-icon" sizes="144x144" href="assets/images/favicon/favicon-144.png">
		<link rel="apple-touch-icon" sizes="60x60" href="assets/images/favicon/favicon-60.png">
		<link rel="apple-touch-icon" sizes="120x120" href="assets/images/favicon/favicon-120.png">
		<link rel="apple-touch-icon" sizes="76x76" href="assets/images/favicon/favicon-76.png">
		<link rel="apple-touch-icon" sizes="152x152" href="assets/images/favicon/favicon-152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="assets/images/favicon/favicon-180.png">
		<meta name="msapplication-TileColor" content="#FFFFFF">
		<meta name="msapplication-TileImage" content="/assets/images/favicon/favicon-114.png">
		<meta name="msapplication-config" content="/assets/images/favicon/browserconfig.xml">
		<!-- ****** faviconit.com favicons ****** -->

		<link rel="stylesheet" href="assets/css/themes/Cerulean/bootstrap.min.css" media="screen" id="bootstrap-css">
		<link rel="stylesheet" href="assets/css/style.css?v=0.24" media="screen">
		<link rel="stylesheet" href="assets/css/buybay.css?v=0.24" media="screen">
		
		<script type="text/javascript" src="assets/js/errors.js"></script>
		<script type="text/javascript" src="js/jquery-1.12.4.min.js"></script>

		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="assets/js/validator.js?v=0.27"></script>
		<script type="text/javascript" src="assets/js/buy.js?v=0.27"></script>
		<script type="text/javascript" src="assets/js/html5storage/HTML5.sessionStorage.js"></script>
		<script type="text/javascript" src="assets/js/custom.js?v=0.27"></script>
  </head>

  <body class="<?php echo $bodyclass ?>">
    <div id="wrap">
      <!-- Fixed navbar -->
      <div id="header" class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <ul class="nav navbar-nav navbar-right newmenu">
              <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                  <span class="glyphicon glyphicon-menu-hamburger"></span>
                </a>
                <ul class="dropdown-menu">
                  <li class="loginhide active"><a href="#wallet" data-toggle="tab">Regular Wallet</a></li>
                  <li class="loginhide"><a href="#wallet" data-toggle="tab" id="multisigwalletLink">Individual MultiSig Wallet</a></li>
                  <li class="logouthide">
                    <a href="#wallet" data-toggle="tab">Wallet
                      <p class="text-left small walletEmail"></p>
                      <p class="walletBalance"></p>
                    </a>
                  </li>
                  <li class="divider-text"></li>
                  <li>
                    <a id="buyBay" href="#buyBay" role="button" data-destroy="true">Buy $BAY</a>
                  </li>
                  <li class="divider-text"></li>
                  <li class="hidden"><a href="#newAddress" data-toggle="tab">New Address</a></li>
                  <li><a href="#newTimeLocked" data-toggle="tab">Time Locked Address</a></li>
                  <li><a href="#newMultiSig" data-toggle="tab">MultiSig Address</a></li>
                  <li><a href="#verify" data-toggle="tab">Verify</a></li>
                  <li><a href="#newTransaction" data-toggle="tab">Transaction</a></li>
                  <li><a href="#sign" data-toggle="tab">Sign</a></li>
                  <li><a href="#broadcast" data-toggle="tab">Broadcast</a></li>
                  <li class="divider-text logouthide"></li>
                  <li>
                    <a id="walletLogout" href="#" class="logouthide" role="button" data-destroy="true">Logout</a>
                  </li>
                </ul>
             </li>
            </ul>						
            <a href="/" class="navbar-brand" id="homeBtn2">
              <img class="large logouthide" src="assets/images/logo-dark.svg">
              <img class="small logouthide" src="assets/images/logo-dark-small.svg">
              <img class="loginhide" height="52" src="assets/images/logo.svg"/>
            </a>
            <div class="row accountSessionLogout hide top-status">
              <a href="#wallet">
                <p class="text-left small walletEmail"></p>
              </a>
              <a id="walletLogout" href="javascript:;" class="color-link" role="button" data-destroy="true">Logout</a>
              <a href="#" class="walletBalance"></a>
            </div>
          </div>
        </div>
      </div>
      

      <div id="content" class="container">

        <noscript class="alert alert-danger center-block"><span class="glyphicon glyphicon-exclamation-sign"></span> This page uses javascript, please enable it to continue!</noscript>

        <div class="tab-content">
          
          <div class="tab-pane tab-content active" id="wallet">
            <div class="row">
              <div class="col-md-12">
                
                <div class="row">
                  <div id="buyBayPanel" class="col-xs-12">
                                        
