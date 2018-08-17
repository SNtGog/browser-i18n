(function(factory) {

  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'exports'], function($, exports) {
      root.I18n = factory(root, exports, $);
    });
  } else if (typeof exports !== 'undefined') {
    var $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, $);
  } else {
    root.I18n = factory(root, {}, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root, I18n, $) {

  var I18n = function(options){
      for (var prop in options) {
          this[prop] = options[prop];
      };
      return this.getLocaleFileFromServer();
  };
  
  I18n.localeCache = {};
  
  I18n.prototype = {
      defaultLocale: "en",
      directory: "/locales",
      extension: ".json",
      
      setLocale: function(locale) {
        this.locale = locale;
        if (!I18n.localeCache.get(locale)) {
          this.getLocaleFileFromServer(locale);
        }
        return this;
      },
  
      getLocale: function(){
          return navigator.language;
      },
      
      _getLocaleFileFromServer: function(locale) {
        return $.ajax({
          url: this.directory + "/" + locale + this.extension,
          dataType: 'json',
          async: true
        });
      },
  
      getLocaleFileFromServer: function() {
        var _this = this,
            deferred = $.Deferred();

        this.locale = this.locale || this.getLocale();
        this._getLocaleFileFromServer(this.locale)
          .done(function(localeFile) {
            I18n.localeCache[_this.locale] = localeFile;
            deferred.resolve(_this);
          })
          .fail(function(res) {
            _this.locale = _this.defaultLocale;
            localeFile = _this._getLocaleFileFromServer(_this.defaultLocale)
              .done(function(localeFile) {
                I18n.localeCache[_this.locale] = localeFile;
                deferred.resolve(_this);
              })
              .fail(function(res) {
                deferred.reject(_this);
              });
          });

        return deferred;
      },
  
      __: function(){
          var msg = I18n.localeCache[this.locale][arguments[0]];
  
          if (arguments.length > 1)
              msg = vsprintf(msg, Array.prototype.slice.call(arguments, 1));
  
          return msg;
      },
  
      __n: function(singular, count){
          var msg = I18n.localeCache[this.locale][singular];
  
          count = parseInt(count, 10);
          if(count === 0)
              msg = msg.zero;
          else
              msg = count > 1 ? msg.other : msg.one;
  
          msg = vsprintf(msg, [count]);
  
          if (arguments.length > 2)
              msg = vsprintf(msg, Array.prototype.slice.call(arguments, 2));
  
          return msg;
      }
  };
  
  return I18n;
});
