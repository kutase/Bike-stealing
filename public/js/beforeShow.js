var beforeShow = {
  getBikes: () => {
    main.getBikes();
  },
  editBike: () => {
    var x = 0;
    _.forOwn(form.updateBike, (val, key) => {
      if (['default', 'city', 'date', 'photoFile'].indexOf(key) === -1) {
        val = (typeof val === 'function')? val() : '';
        if (val !== '')
          x++;
      }
    });
    if (x === 0)
      pager.navigate('#!/');
  }
};
