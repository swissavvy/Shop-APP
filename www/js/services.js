angular.module('starter.services', [])

.factory('Settings', function() {
  return {
    paypal_sandbox_client_id: '',
    paypal_live_client_id: '',
    //paypal_current_env: 'PayPalEnvironmentSandbox', // when you are in the Sandbox
    paypal_current_env: 'PayPalEnvironmentProduction', // when you decide to go live.
    paypal_merchant_name: ''
  };
})


.factory('Search', function() {
  return {query: ""}
})


.service('productService', function($rootScope,$q, $http) {
  this.Products = [];

  this.getProducts = function(categoryId, search) {
    var q = $q.defer();
    var promises = [];

    $http.get('http://tour.swisscrum-local.com/api/product/index', {params: {category_id: categoryId, search: search}})
      .then(function(result) {
        q.resolve(result.data.data);
      });

    return q.promise;
  }
  this.loadProducts = function(categoryId){
    $rootScope.show();
    var catProducts = [];
    var deferred = $q.defer();

    this.getProducts(categoryId).then(function(products){
      deferred.resolve(products);
      $rootScope.hide();
    });

    return deferred.promise;
  }.bind(this);

  this.searchProducts = function(searchquery){
    $rootScope.show();
		var deferred = $q.defer();

    this.getProducts(0).then(function(products){
      deferred.resolve(products);
      $rootScope.hide();
    });

		return deferred.promise;
	}.bind(this);

  this.loadAllProducts = function(){
		$rootScope.show();
		var deferred = $q.defer();

    this.getProducts('').then(function(products){
      deferred.resolve(products);
      $rootScope.hide();
    });

		return deferred.promise;
	}.bind(this);
})


.service('categoryService', function($q, $http) {

  var getCategories = function(categoryId) {
    var q = $q.defer();

    $http.get('http://tour.swisscrum-local.com/api/category/index', {params: {category_id: categoryId}}).then(function(result){
      q.resolve(result.data.data);
    });

    return q.promise;
  }.bind(this);

  this.loadMenuCategories = function(){
    var menuCategories = [];
    var q = $q.defer();
    getCategories('').then(function(Subcategories) {
      q.resolve(Subcategories);
    });
    return q.promise;
  }.bind(this);

  this.getCatName = function(categoryId){
    var deferred = $q.defer();

    $http.get('http://tour.swisscrum-local.com/api/category/index')
      .success(function(result) {
        var categories = result.data;

        deferred.resolve(categories[categoryId].Name);
      })
      .error(function(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  }.bind(this);
})


.service('cartService', function($rootScope,$q) {
  this.cartProducts = [];
	this.total = 0;
  this.getPaypalItems = function(){
    var orderItems = [];
    var deferred = $q.defer();
    this.cartProducts.forEach(function(item) {
      orderItems.push(new PayPalItem(item.Title,item.Quantity,item.Price,'USD','yo'));
    });
    deferred.resolve(orderItems);
    return deferred.promise;
  }
  this.addToCart = function(product){
    if (typeof product.myOptions !== 'undefined') {
      var productInCart = false;
      $rootScope.quicknotify("Added to my Shopping Bag.");
      product.myPrice = product.Price;
      product.myAllOptions = "";
      product.myOptions.forEach(function(option) {
        product.myPrice = Number(product.myPrice) + Number(option.deltaPrice);
        product.myAllOptions = product.myAllOptions + "|" + option.Name + ":" + option.Value;
      });
      this.cartProducts.forEach(function(prod, index, prods){
        if ( prod.id===product.id && product.myAllOptions===prod.myAllOptions ) {
          productInCart = prod;
          return;
        }
      });
      if (productInCart) {
        this.addOneProduct(productInCart);
      }
  		else {
        var newcartprod = {};
        newcartprod.id = product.id;
        newcartprod.Title = product.Title;
        newcartprod.Price = product.myPrice;
        newcartprod.Image1 = product.Image1;
        newcartprod.myOptions = JSON.parse(JSON.stringify(product.myOptions));
        newcartprod.myAllOptions = product.myAllOptions;
        newcartprod.Quantity = 1;
        this.cartProducts.push(newcartprod);
      }
    }
  };
  this.removeProduct = function(product) {
    this.cartProducts.forEach(function(prod, i, prods){
      if (prod.id===product.id && product.myAllOptions===prod.myAllOptions) {
        this.cartProducts.splice(i, 1);
      }
    }.bind(this));
  };
  this.emptyCart = function() {
    this.cartProducts.splice(0,this.cartProducts.length);
    this.total = 0;
  }.bind(this);
  this.addOneProduct = function(product) {
    ++product.Quantity;
  };
  this.removeOneProduct = function(product) {
    --product.Quantity;
  };
  this.cartTotal = function() {
    var total = 0;
    this.cartProducts.forEach(function(prod, index, prods){
      total += prod.Price * prod.Quantity;
    });
    //return formatTotal(total);
    return total;
  };
  var formatTotal = function(total) {
    return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };
  this.updateTotal = function(){
    this.total = this.cartTotal();
  }.bind(this);
})


.service('CheckoutValidation', function() {
	this.validateName = function(name) {
    if (typeof name == 'undefined' || name == '') {return false;}
		else {return true;}
	};
  this.validateEmail = function(email) {
    if (typeof email == 'undefined' || email == '') {return false;}
    var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailReg.test(email);
  };
  this.validateZipcode = function(zipcode) {
    if (typeof zipcode == 'undefined' || zipcode == '') {return false;}
    var zipReg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return zipReg.test(zipcode);
  };
	this.checkLoggedInputs = function(checkoutDetails) {
		if (Object.keys(checkoutDetails).length === 0) {
			return false;
		}
    for (var input in checkoutDetails) {
			if (!this.validateName(checkoutDetails['firstName'])) {
				return false;
			}
			if (!this.validateName(checkoutDetails['lastName'])) {
				return false;
			}
      if (!this.validateName(checkoutDetails['addressLineOne'])) {
        return false;
      }
      if (!this.validateName(checkoutDetails['city'])) {
        return false;
      }
			if (!this.validateName(checkoutDetails['state'])) {
				return false;
			}
			if (!this.validateZipcode(checkoutDetails['zipcode'])) {
				return false;
			}
      if (!this.validateName(checkoutDetails['country'])) {
        return false;
      }
    }
    return true;
  }.bind(this);
  this.checkAll = function(checkoutDetails) {
		if (Object.keys(checkoutDetails).length === 0) { return false; }
    for (var input in checkoutDetails) {
      if (!this.validateName(checkoutDetails['firstName'])) {
        return false;
      }
      if (!this.validateName(checkoutDetails['lastName'])) {
				return false;
			}
			if (!this.validateEmail(checkoutDetails['email'])) {
				return false;
			}
			if (!this.validateName(checkoutDetails['password'])) {
				return false;
			}
      if (!this.validateName(checkoutDetails['addressLineOne'])) {
        return false;
      }
      if (!this.validateName(checkoutDetails['city'])) {
        return false;
      }
      if (!this.validateName(checkoutDetails['state'])) {
				return false;
			}
			if (!this.validateZipcode(checkoutDetails['zipcode'])) {
				return false;
			}
      if (!this.validateName(checkoutDetails['country'])) {
        return false;
      }
    }
    return true;
  }.bind(this);
})


.service('userService', function($rootScope,$q) {
 	this.userInfo = {};
	this.register = function(userInfo) {
    $rootScope.show('Registering...');
    var deferred = $q.defer();
    var user = new Parse.User();
    user.set("username", userInfo.email.toLowerCase());
    user.set("password", userInfo.password);
    user.set("email", userInfo.email.toLowerCase());
		user.set("firstName", userInfo.firstName);
		user.set("lastName", userInfo.lastName);
		user.set("addressLineOne", userInfo.addressLineOne);
		user.set("addressLineTwo", userInfo.addressLineTwo);
		user.set("city", userInfo.city);
		user.set("state", userInfo.state);
		user.set("zipcode", userInfo.zipcode);
    user.set("country", userInfo.country);
    user.signUp(null, {
	    success: function(user) {
	      deferred.resolve(user);
        $rootScope.hide();
	    },
	    error: function(user, error) {
        console.log(JSON.stringify(error));
				deferred.reject(error.message);
        $rootScope.hide();
	    }
    })
		return deferred.promise;
	}.bind(this);
  this.save = function(userInfo) {
    $rootScope.show('Saving...');
    var deferred = $q.defer();
    var user = Parse.User.current();
    user.set("firstName", userInfo.firstName);
    user.set("lastName", userInfo.lastName);
    user.set("addressLineOne", userInfo.addressLineOne);
    user.set("addressLineTwo", userInfo.addressLineTwo);
    user.set("city", userInfo.city);
    user.set("state", userInfo.state);
    user.set("zipcode", userInfo.zipcode);
    user.set("country", userInfo.country);
    user.save(null, {
      success: function(user) {
        deferred.resolve(user);
        $rootScope.hide();
      },
      error: function(user, error) {
        deferred.reject(error.message);
        $rootScope.hide();
      }
    });
    return deferred.promise;
  }.bind(this);
	this.login = function(loginData) {
    var deferred = $q.defer();
		$rootScope.show('Logging in');
    Parse.User.logIn((''+loginData.username).toLowerCase(), loginData.password, {
      success: function(user) {
				deferred.resolve(user);
        $rootScope.hide();
      },
    	error: function(user, error) {
        deferred.reject(error.message);
        $rootScope.hide();
      }
    })
		return deferred.promise;
  }.bind(this);
})


.service('orderService', function($rootScope,$q) {
  this.currentOrder = {};
  this.newOrder = function(cartproducts,cartTotal) {
		var deferred = $q.defer();
    $rootScope.show('Sending');

    //添加订单
    var params = {
      uid: 1,
      amount: cartTotal,
      items: []
    };

    cartproducts.forEach(function(cartproduct) {
      params.items.push(cartproduct);
    });

    console.log(params);
    $http.post('http://tour.swisscrum-local.com/api/order/create', {params: {category_id: categoryId}}).then(function(result){
      deferred.resolve(result.data.data);
      $rootScope.hide();
    });

		return deferred.promise;
	}.bind(this);
  this.deleteOrder = function(cartproducts,cartTotal) {
		var deferred = $q.defer();
    query = new Parse.Query("OrderDetails");
    query.equalTo("orderId", this.currentOrder);
    query.find({
      success: function(items) {
        Parse.Object.destroyAll(items, {
          success: function() {},
          error: function(error) {
            console.error("Error deleting related comments " + error.code + ": " + error.message);
          }
        });
      },
      error: function(error) {
        console.error("Error finding related comments " + error.code + ": " + error.message);
      }
    });
    this.currentOrder.destroy();
	}.bind(this);
	this.updateOrderStatus = function(status) {
    //var deferred = $q.defer();
    this.currentOrder
    .set("Status", status)
    this.currentOrder.save(null, {
      success: function(ordersaved) {
        this.currentOrder = ordersaved;
      },
      error: function(object, error) {
        console.log(JSON.stringify(object));
        console.log(JSON.stringify(error));
      }
    });
    //return deferred.promise;
  }.bind(this);
});
