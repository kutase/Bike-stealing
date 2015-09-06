var customBindings = {
  toggle: {
    init: function (el, val) {
      val = val();
      $(el).click(function () {
        val(!val());
      })
    }
  },
  // dateValue: {
  //   init: function (el, val) {
  //     val = val();
  //     $(el).datetimepicker({
  //       format: 'YYYY/MM/DD',
  //       locale: 'ru'
  //     });
  //   }
  // },
  selectFind: {
    init: function (el, list) {
      $(el).attr('data-live-search', 'true');
      $(el).selectpicker();
    },
    update: function (el, list) {
      var list = list()();
      $(el).attr('data-live-search', 'true');
      $(el).selectpicker('refresh');
    }
  },
  dropzone: {
    init: function (el, opts) {
      window.test = el;
      opts = opts() || {};

      var removeImage = function (imageUrl) {
        return $.ajax({
          url: imageUrl,
          type: 'DELETE'
        })
        .error(function () {
          console.error('dropzone@err:', err);
        })
      };

      var dropzoneInit = function () {
        this.on('success', function (file, resp) {
          if (Array.isArray(opts.value())) // check observableArray
            opts.value.push(resp.url);
          else
            opts.value(resp.url);
        });
        this.on('error', function (file, err) {
          console.error('dropzone@err:', err);
        });
        this.on('removedfile', function (file) {
          if (Array.isArray(opts.value())) { // check observableArray
            var imageUrl = JSON.parse(file.xhr.response).url;
            // opts.value.remove(imageUrl);
            removeImage(imageUrl)
            .done(function (resp) {
              // console.log(resp);
              opts.value.remove(imageUrl);
            })
          } else {
            var imageUrl = JSON.parse(file.xhr.response).url;
            removeImage(imageUrl)
            .done(function (resp) {
              // console.log(resp);
              opts.value('');
            })
          }
        });
      };

      $.extend(opts, { 
        acceptedFiles: 'image/*', 
        addRemoveLinks: true,
        init: dropzoneInit
      });

      $(el).dropzone(opts);
    }
  }
}
