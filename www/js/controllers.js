angular.module('starter.controllers', [])


  .controller('AppCtrl', function ($scope, $rootScope, $ionicHistory, $ionicSideMenuDelegate, $state, cartService, categoryService, Search) {
    $scope.search = Search;
    $scope.doSearch = function () {
      cordova.plugins.Keyboard.close();
      $ionicSideMenuDelegate.toggleLeft();
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.search', {}, {reload: true});
    }
    $rootScope.isLoggedIn = false;
    $scope.loginData = {};
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

    $scope.addToCart = function(product){
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
    $scope.Title = "orders";
    $scope.orders = [];
    $scope.userObj = userService.getCurrentUser;
    orderService.getOrders($scope.userObj.uid)
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
    $scope.Title = "User Profile";
    $scope.user = userService.getCurrentUser();
    $rootScope.hide();
  })

  .controller('LoginController', function ($scope, $rootScope, userService) {
    $scope.Title = 'Login';
    $scope.doLogin = function() {
      userService.login($scope.loginData)
        .then(function(result) {
          userService.userInfo = result;
          $rootScope.isLoggedIn = true;
          $scope.closeLogin();
          $state.go('app.checkout',{},{reload:true});
        }, function (error) {
          scope.error = error;
        });
    };
    $scope.closeLogin = function() {
      //$scope.hide();
      $scope.modal.hide();
    };
  })

  .controller('CheckoutController', function ($scope, cartService) {
    $scope.cartProducts = cartService.cartProducts;
  });
