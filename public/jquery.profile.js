(function($) {
  $.fn.renderProfile = function() {
    var userdata = JSON.parse($(this).html());

    $(this).html(
      '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">' + userdata.name.given_name + ' ' + userdata.name.family_name + '</h3></div><div class="panel-body"><p>Organisation: ' + userdata.organisation.name + '</p><p>Email: ' + userdata.emails[0].value + '</p></div></div>'
    );
  }
}(jQuery));
