angular.module('starter', ['ionic','ngIOS9UIWebViewPatch','starter.controllers','starter.services','starter.directives'])

.run(function($ionicPlatform, $rootScope, $window, $ionicLoading, $ionicPopup) {
  $rootScope.$on('userInfo', function(event, data) {
    $rootScope.userInfo = data;
    console.log($rootScope.userInfo);
    $rootScope.isLoggedIn = true;
  });
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.show = function(text) {
    $rootScope.loading = $ionicLoading.show({
      template: text ? text : 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 500,
      showDelay: 0
    });
  };
  $rootScope.hide = function() {
    $ionicLoading.hide();
  };
  $rootScope.longnotify = function(text) {
    $rootScope.show(text);
    $window.setTimeout(function() {
      $rootScope.hide();
    }, 2999);
  };
  $rootScope.quicknotify = function(text) {
    $rootScope.show(text);
    $window.setTimeout(function() {
      $rootScope.hide();
    }, 999);
  };
  $rootScope.confirm = function(title,text) {
    var confirmPopup = $ionicPopup.confirm({
       title: title,
       template: text
    });
    return confirmPopup;
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.catalog', {
    url: '/catalog',
    views: {
      'menuContent' :{
        templateUrl: "templates/catalog.html",
        controller: 'CatalogController'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent' :{
        templateUrl: "templates/catalog.html",
        controller: 'SearchController'
      }
    }
  })
  .state('app.category', {
    url: "/category/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "templates/catalog.html",
        controller: 'CategoryController'
      }
    }
  })
  .state('app.checkout',{
    url: '/checkout',
    views: {
      'menuContent' :{
        templateUrl: "templates/checkout.html",
        controller: 'CheckoutController'
      }
    }
  })
  .state('app.forgot', {
    url: '/forgot',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'ForgotPasswordController'
      }
    }
  })
  .state('app.orders', {
    url: '/orders',
    views: {
      'menuContent': {
        templateUrl: 'templates/orders.html',
        controller: 'OrderController'
      }
    }
  })
  .state('app.order', {
    url: '/order/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/orderDetail.html',
        controller: 'OrderViewController'
      }
    }
  })
  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserController'
      }
    }
  })
  .state('app.userProfile', {
    url: '/userProfile',
    views: {
      'menuContent': {
        templateUrl: 'templates/user-profile.html',
        controller: 'UserProfileController'
      }
    }
  })
  .state('app.changePwd', {
    url: '/changePwd',
    views: {
      'menuContent': {
        templateUrl: 'templates/change-pwd.html',
        controller: 'ChangePwdController'
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login-a.html',
        controller: 'LoginController'
      }
    }
  })
  .state('app.product', {
    url: "/product/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/product.html",
        controller: 'ProductViewController'
      }
    }
  })
  ;
  $urlRouterProvider.otherwise('/app/catalog');
});
