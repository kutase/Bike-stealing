var customBindings = {
  toggle: {
    init: function (el, val) {
      val = val();
      $(el).click(function () {
        val(!val());
      })
    }
  },
  dateValue: {
    init: function (el, val) {
      val = val();
      $(el).datepicker({
        format: 'dd.mm.yyyy',
        locale: 'ru'
      });
      var currentDate = moment(new Date())
                        .toDate()
                        .toLocaleDateString();
      if (val().length === 0)
        val(currentDate);
    }
  },
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
  maskedInput: {
    init: function (el, opts) {
      console.log($(el))
      opts = opts();
      $(el).mask(opts.mask, opts);
    }
  },
  dropzone: {
    init: function (el, opts) {
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
        // this.on('addedfile', function (file) {
        //   opts.valueFile(file);
        // });
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
