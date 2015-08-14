var router = require('express').Router(),
    controller = require('./controller');

// router.route('/')
// .get((req, res) => {
//   res.send('<h1>Hello! One day there will be a good single page app! </br>But now everythink what you can doing - see this cat photo =) </br> <img style="width:500px;" src="https://www.math.ku.edu/~wsanders/Kittens/new%20kittens/803864926_1375572583.jpg"></h1>')
// });

router.route('/bikes')
.get(controller.get_bikes)
.post(controller.add_bike)

router.route('/bikes/:id')
.put(controller.update_bike)
.delete(controller.del_bike);

router.route('/img/upload')
.post(controller.get_img);

module.exports = router;