<?php
/**
 * User: 李鹏飞 <523260513@qq.com>
 * Date: 2016/4/1
 * Time: 15:08
 */

$app = require __DIR__ . '/../php/app.php';
$oauth = $app->oauth;

// 获取 OAuth 授权结果用户信息
$user = $oauth->user();

$_SESSION['CourierPickUp_Wechat'] = ['auth' => $user->getToken()->toArray(), 'info' => $user->getOriginal()];

header('location:http://pick.liv1020.com/');