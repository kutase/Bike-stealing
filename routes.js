var router = require('express').Router(),
    controller = require('./controller'),
    multer = require('multer'),
    storage = multer.diskStorage({
      destination: function (req, file, done) {
        done(null, 'public/upload/');
      },
      filename: function (req, file, done) {
        console.log(file.mimetype, file.encoding)
        var type = /\/(\D)+/.exec(file.mimetype)[0].slice(1); // должен быть способ лучше
        done(null, controller.makeRand(6) + '-' + Date.now() + '.' + type);
      }
    }),
    upload = multer({ storage: storage });

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

router.route('/cities')
.get(controller.get_cities);

router.route('/img/upload')
.post(upload.single('file'), controller.get_img);

router.route('/upload/:image_name')
.delete(controller.del_img)

router.route('/create_test_bikes')
.get(controller.createTestBikes)

router.route('/backdoor')
.get(controller.get_backdoor)
.post(controller.post_backdoor)

module.exports = router;