angular.module('starter.services', [])

  .factory('Settings', function () {
    return {
      paypal_sandbox_client_id: '',
      paypal_live_client_id: '',
      //paypal_current_env: 'PayPalEnvironmentSandbox', // when you are in the Sandbox
      paypal_current_env: 'PayPalEnvironmentProduction', // when you decide to go live.
      paypal_merchant_name: '',
      apiUrl: 'http://tour.swisscrum.com',
    };
  })


  .factory('Search', function () {
    return {query: ""}
  })


  .service('productService', function ($rootScope, $q, $http, Settings) {
    this.getProducts = function (categoryId, search) {
      var q = $q.defer();

      $http.get(Settings.apiUrl + '/api/product/index', {params: {category_id: categoryId, search: search}})
        .then(function (result) {
          q.resolve(result.data.data);
        });

      return q.promise;
    }
    this.loadProducts = function (categoryId) {
      $rootScope.show();
      var catProducts = [];
      var deferred = $q.defer();

      this.getProducts(categoryId).then(function (products) {
        deferred.resolve(products);
        $rootScope.hide();
      });

      return deferred.promise;
    };

    this.searchProducts = function (searchquery) {
      $rootScope.show();
      var deferred = $q.defer();

      this.getProducts(0).then(function (products) {
        deferred.resolve(products);
        $rootScope.hide();
      });

      return deferred.promise;
    };

    this.loadAllProducts = function () {
      $rootScope.show();
      var deferred = $q.defer();

      this.getProducts('').then(function (products) {
        deferred.resolve(products);
        $rootScope.hide();
      });

      return deferred.promise;
    };
  })


  .service('categoryService', function ($q, $http, Settings) {

    var getCategories = function (categoryId) {
      var q = $q.defer();

      $http.get(Settings.apiUrl + '/api/category/index', {params: {category_id: categoryId}}).then(function (result) {
        q.resolve(result.data.data);
      });

      return q.promise;
    };

    this.loadMenuCategories = function () {
      var menuCategories = [];
      var q = $q.defer();
      getCategories('').then(function (Subcategories) {
        q.resolve(Subcategories);
      });
      return q.promise;
    };

    this.getCatName = function (categoryId) {
      var deferred = $q.defer();

      getCategories('').then(function (categories) {
        var categories = categories;
        deferred.resolve(categories[categoryId].Name);
      });

      return deferred.promise;
    };
  })


  .service('cartService', function ($rootScope, $q) {
    this.cartProducts = [];
    this.total = 0;
    this.getPaypalItems = function () {
      var orderItems = [];
      var deferred = $q.defer();
      this.cartProducts.forEach(function (item) {
        orderItems.push(new PayPalItem(item.Title, item.Quantity, item.Price, 'USD', 'yo'));
      });
      deferred.resolve(orderItems);
      return deferred.promise;
    }
    this.addToCart = function (product) {
      if (typeof product.myOptions !== 'undefined') {
        var productInCart = false;
        $rootScope.quicknotify("Added to my Shopping Bag.");
        product.myPrice = product.Price;
        product.myAllOptions = "";
        product.myOptions.forEach(function (option) {
          product.myPrice = Number(option.deltaPrice);
          product.myAllOptions = product.myAllOptions + "|" + option.Name + ":" + option.Value;
        });
        this.cartProducts.forEach(function (prod, index, prods) {
          if (prod.id === product.id && product.myAllOptions === prod.myAllOptions) {
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
    this.removeProduct = function (product) {
      this.cartProducts.forEach(function (prod, i, prods) {
        if (prod.id === product.id && product.myAllOptions === prod.myAllOptions) {
          this.cartProducts.splice(i, 1);
        }
      }.bind(this));
    };
    this.emptyCart = function () {
      this.cartProducts.splice(0, this.cartProducts.length);
      this.total = 0;
    };
    this.addOneProduct = function (product) {
      ++product.Quantity;
    };
    this.removeOneProduct = function (product) {
      --product.Quantity;
    };
    this.cartTotal = function () {
      var total = 0;
      this.cartProducts.forEach(function (prod, index, prods) {
        total += prod.Price * prod.Quantity;
      });
      //return formatTotal(total);
      return total;
    };
    var formatTotal = function (total) {
      return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
    this.updateTotal = function () {
      this.total = this.cartTotal();
    };
  })


  .service('CheckoutValidation', function () {
    this.validateName = function (name) {
      if (typeof name == 'undefined' || name == '') {
        return false;
      }
      else {
        return true;
      }
    };
    this.validateEmail = function (email) {
      if (typeof email == 'undefined' || email == '') {
        return false;
      }
      var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailReg.test(email);
    };
    this.validateZipcode = function (zipcode) {
      if (typeof zipcode == 'undefined' || zipcode == '') {
        return false;
      }
      var zipReg = /(^\d{6}$)|(^\d{6}-\d{4}$)/;
      //return zipReg.test(zipcode);
      return true;
    };
    this.checkLoggedInputs = function (checkoutDetails) {
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
    };
    this.checkAll = function (checkoutDetails) {
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
    };
  })


  .service('userService', function ($rootScope, $q, $http, Settings) {
    this.userInfo = {};
    this.register = function (userInfo) {
      $rootScope.show('Registering...');
      var deferred = $q.defer();
      var params = {
        username: userInfo.email.toLowerCase(),
        password: userInfo.password,
        email: userInfo.email.toLowerCase(),
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        addressLine1: userInfo.addressLineOne,
        addressLine2: userInfo.addressLineTwo,
        city: userInfo.city,
        state: userInfo.state,
        zipcode: userInfo.zipcode,
        country: userInfo.country
      };

      $http.post(Settings.apiUrl + '/api/user/register', params).then(function (result) {
        if (result.data.status == 1) {
          deferred.resolve(result.data.data);
        } else {
          deferred.reject(result.data.msg);
        }

        $rootScope.hide();
      });

      return deferred.promise;
    };
    this.save = function (userInfo) {
      $rootScope.show('Saving...');
      var deferred = $q.defer();
      //var user = Parse.User.current();
      //user.set("firstName", userInfo.firstName);
      //user.set("lastName", userInfo.lastName);
      //user.set("addressLineOne", userInfo.addressLineOne);
      //user.set("addressLineTwo", userInfo.addressLineTwo);
      //user.set("city", userInfo.city);
      //user.set("state", userInfo.state);
      //user.set("zipcode", userInfo.zipcode);
      //user.set("country", userInfo.country);
      //user.save(null, {
      //  success: function(user) {
      //    deferred.resolve(user);
      //    $rootScope.hide();
      //  },
      //  error: function(user, error) {
      //    deferred.reject(error.message);
      //    $rootScope.hide();
      //  }
      //});
      deferred.resolve({uid: 1});
      $rootScope.hide();

      return deferred.promise;
    };
    this.login = function (loginData) {
      var deferred = $q.defer();
      $rootScope.show('Logging in');

      var params = {
        identity: loginData.username,
        password: loginData.password
      };

      $http.post(Settings.apiUrl + '/api/user/login', params).success(function (result) {
        if (result.status == 0) {
          deferred.reject(result.msg);
        } else {
          deferred.resolve(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        }

        $rootScope.hide();
      });

      return deferred.promise;
    };
    this.getCurrentUser = function () {
      return JSON.parse(localStorage.getItem("user"));
    };
  })


  .service('orderService', function ($rootScope, $q, Settings, $http) {
    this.getOrders = function (uid) {
      var q = $q.defer();
      $http.get(Settings.apiUrl + '/api/order', {params: {uid: uid}})
        .then(function (result) {
          q.resolve(result.data.data);
        });

      return q.promise;
    }

    this.currentOrder = {};
    this.newOrder = function (cartproducts, cartTotal) {
      var deferred = $q.defer();
      $rootScope.show('Sending');

      //添加订单
      var params = {
        uid: 1,
        amount: cartTotal,
        firstName: "Lay",
        lastName: "ww",
        email: "2015@qq.com",
        phone: "15478547895",
        items: []
      };

      cartproducts.forEach(function (cartproduct) {
        var item = {
          productId: cartproduct.id,
          productName: cartproduct.Title,
          quantity: cartproduct.Quantity,
          price: cartproduct.Price,
          image: cartproduct.Image1,
          myOptions: []
        };

        cartproduct.myOptions.forEach(function (myOption) {
          var option = {
            optionId: myOption.optionId,
            optionValueId: myOption.optionValueId,
            optionName: myOption.Name,
            optionValueName: myOption.Value
          };

          item.myOptions.push(option);
        });
        params.items.push(item);
      });

      console.log(params);
      $http.post(Settings.apiUrl + '/api/order/create', params).then(function (result) {
        deferred.resolve(result.data.data);
        $rootScope.hide();
      });

      return deferred.promise;
    }
    this.deleteOrder = function (cartproducts, cartTotal) {
      var deferred = $q.defer();

      $http.post(Settings.apiUrl + '/api/order/delete', this.currentOrder).then(function () {
      });

      this.currentOrder.destroy();
    };
    this.updateOrderStatus = function (status) {
      var deferred = $q.defer();
      var params = {
        order_number: this.currentOrder.order_number,
        pay_status: (status == 'Paid' ? 1 : 0)
      };

      $http.post(Settings.apiUrl + '/api/order/update', params).then(function (result) {
        this.currentOrder = result.data.data;
      });

      return deferred.promise;
    };
  });
