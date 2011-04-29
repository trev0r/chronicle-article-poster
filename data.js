var cradle = require('cradle');

var db = new(cradle.Connection)().database('comments');
db.create();

db.save('_design/articles', {
    all: {
        map: function(doc) {
            if (doc.name)
            {
                var first = 0;
                if (doc.duetimestamp == -1)
                first = 1;
                emit([first, doc.duetimestamp], doc);
            }
        }
    }
});

module.exports.insert = function(data, callback) {
	
    db.save(data, callback);
};

module.exports.list = function(callback) {
    db.view('articles/all', callback);
};

module.exports.delete = function(id, rev, callback) {
    db.remove(id, rev, callback);
}
