//var server = require('./bin/www');
//var Category = require('./models/category');

var categoryCtrl = require('./controllers/category');

var menus = [
    { "name": "전체보기",   type:0 },
    { "name": "잡담",     type:100 },
    { "name": "친목",     type:101 },
    { "name": "기타",    type:3000 } // warning! '3000' default value hardcoded on `rooms` schema.
]



for (var index in menus) {
    var menu = menus[index];
    (function(name, type) {
        categoryCtrl.createCategory(name, type, function(err, result) {
            if (err) {
                //console.log("실패한 결과가 있네요.");
            }
        });
    })(menu.name, menu.type)
}


