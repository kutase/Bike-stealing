var main = {
  bikes: ko.observableArray([]),
  currentSpec: ko.observable(""),
  getBikes: function (cb) {
    $.get('/bikes')
    .done(function (data) {
      data.forEach(function (el) {
        el = ko.mapping.fromJS(el);
        el.isFullSpec = ko.observable(false);
        el.fullSpec = ko.computed(function () {
          if (el.isFullSpec()) {
            return el.special();
          } else {
            return el.special().slice(0, 197)+'...';
          }
        })
        main.bikes.push(el)
        cb && cb();
      })
      // main.user.bikes.push(main.bikes()[0])
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  addBike: function () {
    var data = ko.mapping.toJS(form.bike, {ignore: ["default"]});
    console.log("main.addBike@formData:", data);
    $.post('/bikes', data)
    .done(function (bike) {
      main.bikes().push(ko.mapping.fromJS(bike));
      main.user.bikes().push(ko.mapping.fromJS(bike));
      ko.mapping.fromJS(form.bike.default,{},form.bike);
      location.hash = "#!/";
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  delBike: function (data) {
    var context = ko.contextFor(event.target);
    var id = context.$index();
    var bike_id = data._id();
    $.delete('/bikes/'+bike_id)
    .done(function (status) {
      console.log(status);
      main.user.delBike(id);
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  fileData: ko.observable({
    dataURL: ko.observable()
  }),
  fullSpec: function (data) {
    var spec = $(event.target).parent().parent().children()[0];
    console.log(spec);
    if ($(spec).text().length == 200) {
      $(spec).text(data.special);
    } else {
      $(spec).text(data.special.slice(0,197)+'...');
    }
  },
  user: {
    bikes: ko.observableArray([]),
    isOwner: function(serial){
      var x = false;
      main.user.bikes().forEach(function (el) {
        if (el.serial === serial) {
          x = true;
        }
      })
      return x;
    },
    delBike: function (id) {
      var bike = main.bikes()[id];
      main.bikes.remove(bike);
      main.user.bikes.remove(bike);
    }
  }
}

jQuery.each(["put", "delete"], function(i, method) {
  jQuery[method] = function(url, data, callback, type) {
    if (jQuery.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    }
    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

$(function () {
  pager.Href.hash = '#!/';
  pager.extendWithPage(main);
  ko.applyBindings(main);
  pager.start();
  main.getBikes(function () {
    $.fn.editable.defaults.mode = 'inline'; //x-editable inline mode
    $('#city').editable();
  });
  main.fileData().dataURL.subscribe(function(dataURL){
    console.log(dataURL)
  });
})