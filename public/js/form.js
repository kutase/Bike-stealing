var form = {
  bike: {
    photo: ko.observable(""),
    date: ko.observable(""),
    city: ko.observable(""),
    serial: ko.observable(""),
    model: ko.observable(""),
    color: ko.observable(""),
    special: ko.observable(""),
    default: {
      photo: "",
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
    date: ko.observable(""),
    city: ko.observable(""),
    serial: ko.observable(""),
    model: ko.observable(""),
    color: ko.observable(""),
    special: ko.observable(""),
    default: {
      _id: "",
      photo: "",
      date: "",
      city: "",
      serial: "",
      model: "",
      color: "",
      special: ""
    }    
  }
}
