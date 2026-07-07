app.controller('AppController', function ($rootScope, $window, $timeout, jwtHelper, DataServices, APIService) {
    $window.scrollTo(0, 0);
    DataServices.getCategories()
        .then(function (categories) {
            $rootScope.categories = categories;
        })
        .catch(function (error) {
            console.error('Lỗi khi lấy dữ liệu từ server:', error);
        });

    //lấy token từ localStorage
    $rootScope.token = localStorage.getItem('token');

    if ($rootScope.token) {
        $rootScope.decoded = jwtHelper.decodeToken($rootScope.token);

        if ($rootScope.decoded) {
            $rootScope.isLogin = true;
            let userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    $rootScope.userWishlist = JSON.parse(userStr).wishlist || [];
                } catch(e) {
                    $rootScope.userWishlist = [];
                }
            } else {
                $rootScope.userWishlist = [];
            }
        } else {
            $rootScope.isLogin = false;
        }
    } else {
        $rootScope.isLogin = false;
    }

    $rootScope.isInWishlist = function (productId) {
        if (!$rootScope.isLogin || !$rootScope.userWishlist) return false;
        return $rootScope.userWishlist.includes(productId);
    };

    $rootScope.name = localStorage.getItem('name');

    //đăng xuất
    $rootScope.logout = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('_id');
        localStorage.removeItem('user');

        swal('Đăng xuất thành công', '', 'success');

        $rootScope.isLogin = false;

        $timeout(function () {
            window.location.href = '/';
        }, 1000);
    }

    //nếu token hết hạn thì đăng xuất
    if ($rootScope.decoded && jwtHelper.isTokenExpired($rootScope.token)) {
        swal('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại', 'error').then(function () {
            $rootScope.logout();
        });
    }

    $rootScope.getStars = function(rating) {
        if (!rating) return [];
        return new Array(Math.round(rating));
    };

    //Thêm vào danh sách yêu thích
    $rootScope.addToWishlist = function (productId) {
        if (!$rootScope.isLogin) {
            swal('Cảnh báo', 'Vui lòng đăng nhập để sử dụng tính năng yêu thích', 'warning');
            return;
        }

        var headers = {
            'Authorization': 'Bearer ' + $rootScope.token,
        };
        var data = { productId: productId };

        if ($rootScope.userWishlist.includes(productId)) {
            APIService.callAPI('user/deleteFromWishlist', 'PUT', data, headers)
                .then(function (response) {
                    $rootScope.userWishlist = $rootScope.userWishlist.filter(id => id !== productId);
                    let user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.wishlist) {
                        user.wishlist = user.wishlist.filter(id => id !== productId);
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        } else {
            APIService.callAPI('user/addToWishlist', 'PUT', data, headers)
                .then(function (response) {
                    if (!$rootScope.userWishlist.includes(productId)) {
                        $rootScope.userWishlist.push(productId);
                    }
                    let user = JSON.parse(localStorage.getItem('user'));
                    if(user) {
                        if (!user.wishlist) user.wishlist = [];
                        if (!user.wishlist.includes(productId)) {
                            user.wishlist.push(productId);
                            localStorage.setItem('user', JSON.stringify(user));
                        }
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }
});

app.directive("stickyScroll", function ($window) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 100) {
                    scope.isSticky = true;
                } else {
                    scope.isSticky = false;
                }
                scope.$apply();
            });

            scope.$watch("isSticky", function (newValue) {
                if (newValue) {
                    element.addClass("sticky");
                } else {
                    element.removeClass("sticky");
                }
            });
        }
    };
});