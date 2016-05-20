<?php
/**
 * User: 李鹏飞 <523260513@qq.com>
 * Date: 2016/2/1
 * Time: 15:08
 */

$app = require __DIR__ . '/../php/app.php';
$oauth = $app->oauth;
$js = $app->js;

if(!isset($_SESSION['CourierPickUp_Wechat'])){
    $oauth->redirect()->send();
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta http-equiv="Content-Security-Policy">
    <title></title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    <!-- ionic/angularjs patch for ios -->
    <script src="lib/angular-ios9-uiwebview.js"></script>

    <!-- cordova script (this will be a 404 during development) -->
    <script src="cordova.js"></script>

    <script src="js/paypal-mobile-js-helper.js"></script>

    <!-- your app's js -->
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/services.js"></script>
    <script src="js/directives.js"></script>

  </head>
  <body ng-app="starter">
    <ion-nav-view></ion-nav-view>
  </body>
</html>
