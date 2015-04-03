# angular-pxy

angular-pxy extends scope objects with a `$pxy()` method that proxies promises through a [Pxy](https://github.com/atesgoral/pxy) instance that is automatically invalidated when the scope is destroyed. This helps prevent:

* Pending asynchronous operations from causing side effects after the scope in which they were initiated is destroyed (e.g. an HTTP fetch continuing to exercise the backend, then returning a large payload, and then updating an object long after the scope is abandoned).
* The hassle of explicitly cancelling pending operations (e.g. a timeout or interval).
Head over to [Pxy documentation](https://github.com/atesgoral/pxy) for a more detailed explanation of the use cases.

[Demo and documentation](http://myplanet.github.io/angular-pxy/)
