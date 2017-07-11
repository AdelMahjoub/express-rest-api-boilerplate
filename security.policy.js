module.exports = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc    : ["'none'"],         // defines the defaults for most directives you leave unspecified. Generally, this applies to any directive that ends with -src.
      scriptSrc     : ["'self'"],         // a directive that controls a set of script-related privileges for a specific page.
      styleSrc      : ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],         // is script-src’s counterpart for stylesheets.
   // childSrc      : ["'self'"],         // lists the URLs for workers and embedded frame contents.
      connectSrc    : ["'self'"],         // limits the origins to which you can connect (via XHR, WebSockets, and EventSource).
      fontSrc       : ["'self'", 'https://fonts.gstatic.com'],         // specifies the origins that can serve web fonts.
   // mediaSrc      : ["'none'"],         // restricts the origins allowed to deliver video and audio.
      imgSrc        : ["'self'"],         // defines the origins from which images can be loaded.
      objectSrc     : ["'none'"],         // allows control over Flash and other plugins.
      baseUri       : ["'self'"],         // restricts the URLs that can appear in a page’s <base> element.
      formAction    : ["'self'"],         // lists valid endpoints for submission from <form> tags.
      frameAncestors: ["'none'"],         // specifies the sources that can embed the current page. 
   // pluginTypes   : ["'none'"],         // limits the kinds of plugins a page may invoke.
      reportUri     : '/api/report-violation' // specifies a URL where a browser will send reports when a content security policy is violated. 
    },
    reportOnly  : false, // This instructs browsers to report violations to the reportUri (if specified) but it will not block/ or block any resources from loading.
    browserSniff: false // disable the browser sniffing and assume a modern browser
  },
  dnsPrefetchControl: {
    allow: false // The X-DNS-Prefetch-Control header tells browsers whether they should do DNS prefetching
  },
  frameguard: {
    action: 'deny' // Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
  }
}