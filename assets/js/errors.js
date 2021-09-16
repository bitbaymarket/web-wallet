function ignoreerror(){
   return true
}
//window.onerror=ignoreerror();

if (typeof console == "undefined") {
    this.console = {log: function() {}};
}
