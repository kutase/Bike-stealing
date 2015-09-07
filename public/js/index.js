var main = {
  bikes: ko.observableArray([]),
  currentSpec: ko.observable(""),
  getBikes: function () {
    $.get('/bikes')
    .done(function (data) {
      main.bikes([]);
      data.forEach(function (el) {
        el = ko.mapping.fromJS(el);
        el.isFullSpec = ko.observable(false);
        el.fullSpec = ko.computed(function () {
          if (el.isFullSpec()) {
            return el.special();
          } else {
            return el.special().length > 0? el.special().slice(0, 197)+'...' : '';
          }
        })
        main.bikes.push(el);
      })
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  getFullSize: function (data, event) {
    var el = $(event.target)[0];
    var width = ($(el).width() !== 150)? 150 : $(el)[0].naturalWidth;
    $(el).width(width);
  },
  addBike: function () {
    var data = ko.mapping.toJS(form.bike, {ignore: ["default"]});
    console.log("main.addBike@formData:", data);
    $.post('/bikes', data)
    .done(function (bike) {
      main.bikes().push(ko.mapping.fromJS(bike));
      main.user.bikes().push(ko.mapping.fromJS(bike));
      ko.mapping.fromJS(form.bike.default,{},form.bike);
      pager.navigate("#!/");
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
      console.log(status)
      main.user.delBike(id);
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  editBike: function (data) {
    ko.mapping.fromJS(form.updateBike.default,{},form.updateBike);
    ko.mapping.fromJS(data,{},form.updateBike);
    pager.navigate('#!/edit-bike');
  },
  updateBike: function () {
    var data = ko.mapping.toJS(form.updateBike, {ignore: ['default']});
    $.put('/bikes/'+form.updateBike._id(), data)
    .done(function (updated) {
      var bike_id = _.findIndex(main.bikes(), function (item) {
        return item._id() === form.updateBike._id();
      });
      main.bikes[bike_id] = ko.mapping.fromJS(updated);
      ko.mapping.fromJS(form.updateBike.default,{},form.updateBike);
      pager.navigate('#!/');
    })
    .fail(function (err) {
      console.error(err);
      ko.mapping.fromJS(form.updateBike.default,{},form.updateBike);
    })
  },
  applyImg: function (data) {
    form(data.url);
  },
  sendImg: function (img, form) {
    $.post('/img/upload', {img: img})
    .done(function (data) {
      form(data.url);
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  fileData: ko.observable({
    dataURL: ko.observable(),
  }),
  citiesList: ko.observableArray([]),
  getCitiesList: function () {
    $.get('/cities')
    .done(function (citiesList) {
      main.citiesList(citiesList);
    })
    .fail(function (err) {
      console.error(err);
    })
  },
  currentPath: ko.observable(''),
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

main.isAddBikePage = ko.computed(function (){
  return (['add-bike', 'edit-bike'].indexOf(main.currentPath()) === -1);
});

// var Bike = genius.Resource.extend({
//   _id: genius.types.string(),
//   photo: genius.types.string(),
//   date: 
// })

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
})

$(function () {
  pager.Href.hash = '#!/';
  pager.extendWithPage(main);
  _.extend(ko.bindingHandlers, customBindings);
  ko.applyBindings(main, document.body);
  window.main = main;
  pager.start();
  main.fileData().dataURL.subscribe(function(dataURL){
    main.sendImg(dataURL);
  });
  var path = window.location.hash.length? window.location.hash.slice(3):'';
  main.currentPath(path);
  window.onpopstate = function (){
    var path = window.location.hash.length? window.location.hash.slice(3):'';
    main.currentPath(path);
  };
  main.getBikes();
  main.getCitiesList();
})