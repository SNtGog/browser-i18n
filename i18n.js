(function init(object) {

  var I18n = object.I18n = function(options){
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
  
      getLocale: function(){
          return this.locale || navigator.language;
      },
      
      _getLocaleFileFromServer: function(locale) {
        return $.ajax({
          url: this.directory + "/" + locale + this.extension,
          async: false,
          dataType: 'json'
        });
      };
  
      getLocaleFileFromServer: function(){
        var _this = this;
        var locale = _this.getLocale();
        _this._getLocaleFileFromServer(locale)
          .done(function(res) {
            I18n.localeCache[_this.locale] = res;
            deferred.resolve();
          })
          .fail(function() {
            return _this._getLocaleFileFromServer(_this.defaultLocale);
          })
          .done(function(res) {
            _this.locale = _this.defaultLocale
            I18n.localeCache[_this.locale] = res;
          })
          .fail(function(res) {
            throw res;
          });
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
