var form = {
  bike: {
    photo: ko.observable(""),
    photoFile: ko.observable(null),
    date: ko.observable(""),
    city: ko.observable(""),
    serial: ko.observable(""),
    model: ko.observable(""),
    color: ko.observable(""),
    special: ko.observable(""),
    default: {
      photo: "",
      photoFile: null,
      date: "",
      city: "",
      serial: "",
      model: "",
      color: "",
      special: ""
    }
  },
  updateBike: {
    _id: ko.observable(""),
    photo: ko.observable(""),
    photoFile: ko.observable(null),
    date: ko.observable(""),
    city: ko.observable(""),
    serial: ko.observable(""),
    model: ko.observable(""),
    color: ko.observable(""),
    special: ko.observable(""),
    default: {
      _id: "",
      photo: "",
      photoFile: null,
      date: "",
      city: "",
      serial: "",
      model: "",
      color: "",
      special: ""
    }    
  }
}
