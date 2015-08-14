ko.bindingHandlers.toggle = {
  init: function (el, val) {
    val = val();
    $(el).click(function () {
      val(!val());
    })
  }
}