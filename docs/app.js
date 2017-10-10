(function() {
    const router = new (class extends Router {
        constructor() {
            super(location.pathname, {
                pages: [],
                extension: '.corgi'
            });
        }
        processFile(src) {
            return corgi.compile(src);
        }
    })();
    router.start();
})();
