angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope,$rootScope,$ionicHistory,$ionicSideMenuDelegate,$state,cartService,categoryService,Search) {
  $scope.search = Search;
  $scope.doSearch = function() {
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


.controller('ForgotPasswordController', function($scope,$rootScope,$state) {
  $scope.user = {};
  $scope.error = {};
  $scope.state = { success: false };
  $scope.reset = function() {
    $rootScope.show();
    Parse.User.requestPasswordReset($scope.user.email, {
      success: function() {
        $rootScope.hide();
        $scope.state.success = true;
      },
      error: function(error) {
        $rootScope.hide();
        $scope.error.message = error.message;
      }
    });
  };
  $scope.login = function() {
    $state.go('app.login');
  };
})


.controller('SearchController', function($scope,productService,Search) {
  $scope.Title = "Searching for " + Search.query;
  $scope.products = [];
  productService.searchProducts(Search.query)
  .then(function (results) {
    $scope.products = results;
  });
})


.controller('CatalogController', function($scope,productService) {
  $scope.Title = "All Products";
  $scope.products = [];
  productService.loadAllProducts()
  .then(function (results) {
    $scope.products = results;
  });
})


.controller('CategoryController', function($scope,productService,categoryService,$stateParams) {
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

//.controller('OrderController', function($scope,orderService,userService,$stateParams) {
//  categoryService.getCatName($stateParams.userId)
//      .then(function (name) {
//        $scope.Title = name;
//      });
//  $scope.products = [];
//  productService.loadProducts($stateParams.categoryId)
//      .then(function (results) {
//        $scope.products = results;
//        $scope.currentcatid = $stateParams.categoryId;
//      });
//})
.controller('OrderController', function($scope, orderService) {
  $scope.Title = "orders";
  $scope.orders = [];
  $scope.userObj = JSON.parse(localStorage.getItem("user"));
    orderService.loadAllOrders()
    .then(function (results) {
        $scope.orders = results;
    });
})
.controller('OrderViewController', function($scope, productService) {
  $scope.Title = "Order Detail";
  $scope.products = [];
  productService.loadAllProducts()
      .then(function (results) {
        $scope.products = results;
      });
})


.controller('CheckoutController', function($scope,cartService) {
  $scope.cartProducts = cartService.cartProducts;
});
