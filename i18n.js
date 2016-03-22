(function init(object) {

  var I18n = object.I18n = function(options){
      for (var prop in options) {
          this[prop] = options[prop];
      };
      return getLocaleFileFromServer();
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
          return this.locale || navigator.language;
      },
      
      _getLocaleFileFromServer: function(locale) {
        var response;
        $.ajax({
          url: this.directory + "/" + locale + this.extension,
          dataType: 'json',
          async: false,
          success: function( data ) {
            response = data
          },
          error: function( data ) {
            response = null;
          }
        }); 
        return response
      },
  
      getLocaleFileFromServer: function(){
        var _this = this;
        var locale = _this.getLocale();
        var localeFile = _this._getLocaleFileFromServer(locale)
        
        if (!localeFile) {
          _this.locale = _this.defaultLocale;
          localeFile = _this._getLocaleFileFromServer(_this.defaultLocale);
        }
        
        I18n.localeCache[_this.locale] = localeFile;
        return this;
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

}(window));
