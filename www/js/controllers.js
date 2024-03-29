angular.module('starter.controllers', [])


  .controller('AppCtrl', function ($scope, $rootScope, $ionicHistory, $ionicSideMenuDelegate, $state, cartService, categoryService, Search, userService) {
    $scope.search = Search;
    $scope.doSearch = function () {
      cordova.plugins.Keyboard.close();
      $ionicSideMenuDelegate.toggleLeft();
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.search', {}, {reload: true});
    }
    $scope.loginData = {};
    $scope.changePwdData = {};
    $scope.cartProducts = cartService.cartProducts;
    categoryService.loadMenuCategories()
      .then(function (menuCategories) {
        $scope.menucategories = menuCategories;
      });
  })

  .controller('ForgotPasswordController', function ($scope, $rootScope, $state) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {success: false};
    $scope.reset = function () {
      $rootScope.show();
      Parse.User.requestPasswordReset($scope.user.email, {
        success: function () {
          $rootScope.hide();
          $scope.state.success = true;
        },
        error: function (error) {
          $rootScope.hide();
          $scope.error.message = error.message;
        }
      });
    };
    $scope.login = function () {
      $state.go('app.login');
    };
  })

  .controller('SearchController', function ($scope, productService, Search) {
    $scope.Title = "Searching for " + Search.query;
    $scope.products = [];
    productService.searchProducts(Search.query)
      .then(function (results) {
        $scope.products = results;
      });
  })


  .controller('CatalogController', function ($scope, productService) {
    $scope.Title = "All Products";
    $scope.products = [];
    productService.loadAllProducts()
      .then(function (results) {
        $scope.products = results;
      });
  })

  .controller('ProductViewController', function ($rootScope, $scope, productService, $stateParams, cartService) {
    $rootScope.show();
    $scope.product = [];
    productService.getOne($stateParams.id)
      .then(function (result) {
        $scope.Title = result.Title;
        $scope.product = result;
        $rootScope.hide();
      });

    $scope.addToCart = function (product) {
      cartService.addToCart(product);
    };
  })

  .controller('CategoryController', function ($scope, productService, categoryService, $stateParams) {
    categoryService.getCatName($stateParams.categoryId)
      .then(function (name) {
        $scope.Title = name;
      });
    $scope.products = [];
    productService.loadProducts($stateParams.categoryId)
      .then(function (results) {
        $scope.products = results;
        $scope.currentcatid = $stateParams.categoryId;
      });
  })

  .controller('OrderController', function ($scope, $rootScope, orderService, userService) {
    $rootScope.show();
    $scope.Title = "Orders";
    $scope.orders = [];
    orderService.getOrders($rootScope.userInfo.id)
      .then(function (results) {
        $scope.orders = results;
        $rootScope.hide();
      });
  })

  .controller('OrderViewController', function ($scope, $rootScope, orderService, userService, $stateParams) {
    $rootScope.show();
    $scope.Title = "Order Detail";
    $scope.order = [];
    orderService.getOrder($stateParams.id)
      .then(function (results) {
        $scope.order = results;
        $rootScope.hide();
      });
  })
  .controller('UserController', function ($scope, $rootScope, orderService, userService, $stateParams) {
    $rootScope.show();
    $scope.Title = "My Account";
    $rootScope.hide();
  })
  .controller('UserProfileController', function ($scope, $rootScope, orderService, userService, $stateParams, $state) {
    $rootScope.show();
    $scope.Title = "My Account";
    $scope.user = userService.userInfo;
    $rootScope.hide();
    $scope.updateProfile = function () {
      userService.updateProfile($scope.user)
        .then(function (result) {
          $rootScope.quicknotify("Update Success.");
          // $state.go('app.user');
        }, function (error) {
          $scope.error = error;
        });
    };
  })
  .controller('ChangePwdController', function ($scope, $rootScope, orderService, userService, $stateParams, $state) {
    //$rootScope.show();
    $scope.Title = "Change Password";
    $scope.changePwdData = userService.userInfo;
    $scope.changePwd = function () {
      userService.changePwd($scope.changePwdData)
        .then(function (result) {
          $rootScope.quicknotify("Change password Success.");
          $state.go('app.user');
        }, function (error) {
          $scope.error = error;
        });
    };
  })

  .controller('LoginController', function ($scope, $rootScope, userService, $state) {
    $scope.Title = 'Login';
    $scope.doLogin = function () {
      userService.login($scope.loginData)
        .then(function (result) {
          $rootScope.isLoggedIn = true;
          $rootScope.noBackGoTo('app.catalog');
        }, function (error) {
          $rootScope.quicknotify(error);
        });
    };
    $scope.forgot = function () {
      $state.go('app.forgot');
    };
  })

  .controller('CheckoutController', function ($scope, cartService) {
    $scope.cartProducts = cartService.cartProducts;
  });
