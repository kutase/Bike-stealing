requirejs.config({
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    pager: {
      deps: ['jquery', 'knockout']
    },
    // ko_genius: {
    //   deps: ['knockout']
    // },
    knockout_file_bindings: {
      deps: ['knockout']
    },
    knockout_es5: {
      deps: ['knockout']
    }
  },
  paths: {
    lodash: '../bower_components/lodash/lodash.min',
    jquery: '../bower_components/jquery/dist/jquery.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    knockout: '../bower_components/knockout/dist/knockout',
    ko_mapping: '../bower_components/knockout-mapping/build/output/knockout.mapping-latest',
    knockout_es5: '../bower_components/knockout-es5/dist/knockout-es5.min',
    knockout_file_bindings: '../bower_components/knockout-file-bindings/knockout-file-bindings',
    pager: '../bower_components/pagerjs/dist/pager.min',
    ko_calendar: '../bower_components/ko-calendar/ko-calendar.min',
    // ko_genius: '../bower_components/ko-genius/ko-genius',
    select2: '../bower_components/select2/select2.min',
    domReady: '../bower_components/requirejs-domready/domReady',
    beforeShow: './beforeShow',
    customBindings: './customBindings',
    form: './form',
    main: './index'
  }
})

requirejs(['jquery', 'knockout', 'ko_mapping', 'main', 'form', 'customBindings', 'beforeShow', 'pager', 'bootstrap', 'knockout_file_bindings', 'lodash', 'select2', 'domReady'], function ($, ko, ko_mapping, main, form, customBindings, beforeShow, pager) {

  window.beforeShow = beforeShow;
  window.form = form;

  ko.mapping = ko_mapping;

  _.extend(ko.bindingHandlers, customBindings);

  pager.Href.hash = '#!/';
  pager.extendWithPage(main);
  window.main = main; // For debugging
  ko.applyBindings(main, document.body);
  pager.start();
  window.pager = pager;
  main.fileData().dataURL.subscribe(function(dataURL){
    main.sendImg(dataURL, form.bike.photo);
    // main.sendImg(dataURL, form.updateBike.photo);
  });
  var path = window.location.hash.length? window.location.hash.slice(3):'';
  main.currentPath(path);
  window.onpopstate = function (){
    var path = window.location.hash.length? window.location.hash.slice(3):'';
    main.currentPath(path);
  };
  main.getCitiesList();
})