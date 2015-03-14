(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'module', 'angular', 'pxy' ], function (module, angular, Pxy) {
            module.exports = factory(angular, Pxy);
        });
    } else if (typeof module === 'object') {
        module.exports = factory(require('angular'), require('pxy'));
    } else {
        if (!root.mp) {
            root.mp = {};
        }

        root.mp.pxy = factory(root.angular, Pxy);
    }
}(this, function (angular, Pxy) {
    'use strict';

    return angular.module('mp.pxy', [])
        .provider('$pxy', function () {
            this.onCancelPromise = undefined;

            var provider = this;

            this.$get = [ '$q', '$timeout', '$interval', function PxyFactory($q, $timeout, $interval) {
                return {
                    create: function () {
                        return new Pxy($q, function (promise) {
                            if (provider.onCancelPromise && provider.onCancelPromise(promise)) {
                                return;
                            }

                            if (promise.$$timeoutId) {
                                $timeout.cancel(promise);
                            } else if (promise.$$intervalId) {
                                $interval.cancel(promise);
                            }
                        });
                    }
                };
            }];
        })
        .run([ '$rootScope', '$pxy', function ($rootScope, $pxy) {
            Object.getPrototypeOf($rootScope).$pxy = function (promise) {
                var scope = this,
                    pxy;

                if (!scope.hasOwnProperty('$$pxy')) {
                    pxy = scope.$$pxy = $pxy.create();
                    scope.$on('$destroy', pxy.invalidate);
                } else {
                    pxy = scope.$$pxy;
                }

                return pxy.proxy(promise);
            };
        }]);
}));
