<?php
/**
 * User: 李鹏飞 <523260513@qq.com>
 * Date: 2016/4/1
 * Time: 15:19
 */
session_start();
require __DIR__ . '/../vendor/autoload.php';

use EasyWeChat\Foundation\Application;

$options = [
    'app_id'  => 'wxbcda4c2c74240b43',
    'secret'  => '74a5f8d4415474a511d0698b5a3020e2',
    'oauth' => [
        'scopes'   => ['snsapi_userinfo'],
        'callback' => 'http://pick.liv1020.com/callback.php',
    ],
    // payment
    'payment' => [
        'merchant_id'        => '1244328202',
        'key'                => 'VV2L5vFMT0xcG84xiMJzrIpH7ssbibTb',
        'cert_path'          => '/home/wwwroot/CourierPickUp/cert.pem',
        'key_path'           => '/home/wwwroot/CourierPickUp/apiclient_key.pem',
        'notify_url'         => 'http://pick.liv1020.com/notify.php',
        'device_info'        => 'WEB',
    ],
    'log' => [
        'level' => 'debug',
        'file'  => '/tmp/easywechat.log',
    ],
];

return new Application($options);