$(function () {
  //console.log(location.href);
  //var val = window.location.href.match(/[?&]currency=(.*?)[$&]/)[1];   // get params from URL
  //$('#currency').val(val); 
    
  $("#currency").change(function () {
    if (window.location.href.indexOf("?") < 0) {
      window.location.href = window.location.href + "?currency="+ this.value;
    }
    else{
      window.location.href = replaceUrlParam(window.location.href, "currency", this.value)
    } 
  });

  $(".bb-form form").validator({
    custom: {
      'equals': function($el) {
        var matchValue = $el.data("equals")
        if ($el.val() !== matchValue) {
          return "Hey, that's not valid! It's gotta be " + matchValue
        }
      },
      'min-max': function($el) {
        var str = $el.data("min-max") 
        var values = str.split('-') 
        var min = parseFloat(values[0])
        var max = parseFloat(values[1])
        if ($el.val() < min || $el.val() > max) {
          return "value should be between " + min + " and " + max
        }
      },
    }
  });
});

$( "#amount" ).keyup(function() {
  var rate = parseFloat($("#totalbay").attr("rate"));
  var val = Number( $(this).val() * rate).toFixed(8);  
  $("#totalbay").html(val);
});

function replaceUrlParam(url, paramName, paramValue){
  var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)')
  if (url.search(pattern) >= 0){
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
}
