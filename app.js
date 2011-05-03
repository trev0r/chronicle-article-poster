var formidable = require('formidable'),
http = require('http'), 
sys = require('sys'),
express = require('express'),
stylus = require('stylus');

var app = express.createServer();
app.configure(function(){ 
  app.set('view engine','jade');
  app.set('views', __dirname+'/views');
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(app.router);
  app.use(express.static(__dirname+'/public'));
  app.use(stylus.middleware({src: __dirname + '/public'}));

});

app.get('/', function(req, res){
  // res.writeHead(200, {'content-type': 'text/html'});
  // res.end(
  //   '<form action="/upload" enctype="multipart/form-data" method="post">'+ 
  //     '<input type="text" name="title"><br>' +
  //       '<input type="file" name="upload" multiple="multiple"><br>'+
  //         '<input type="submit" value="Upload">'+
  //           '</form>'
  // );
  res.render('main');
});

app.post('/upload', function(req,res){
  var form = new formidable.IncomingForm();
  form.uploadDir='./zipfiles';
  form.keepExtensions=true;
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.write(sys.inspect({fields: fields, files: files})+'\n');
    var exec = require('child_process').exec;
    function puts (error, stdout, stderr){ 
      res.end('Unzip Results: \n' + stdout);
      console.log('stdout: ' + stdout);
    }
    exec("unzip zipfiles/*.zip", puts);

  });

});
app.get('/setup', function(req,res){
  var sections = [{title: "News"}, {title: "Sports"}, {title: "Editorial"}, {title: "Recess"}, {title: "Towerview"}]; 
  var articles = {
    news: [{id: "N01", articlename: "Muhammed Pete", section: "Speakers and Events", hierarchy: 1.0}, {id: "N02", articlename: "Mark Taylor", section: "Features" ,hierarchy: 0.1}, {id: "N03" ,articlename: "DSG", section: "DSG" , hierarchy: 0.1}],
    sports: [{id: "S01", articlename: "M Lax", section: "M Lacrosse",hierarchy: 0.0}, {id: "S02",articlename: "W Lax", section: "W Lacrosse" ,hierarchy: 0.2}, {id: "S03",articlename: "W BBall Gammer", section: "W Basketball" , hierarchy: 1.0}],
    editorial: [{id: "E01",articlename: "Editorial", section: "Editorial",hierarchy: 1.0}, {id: "E02",articlename: "Column 1", section: "Column",hierarchy: 1.1}, {id: "E03",articlename: "Column 2", section: "Column" ,hierarchy: 1.2}],
    recess: [{id: "R01",articlename: "Feautre 1", section: "Recess Feature",hierarchy: 1.0}, {id: "R02",articlename: "Film Review", section: "Film Review",hierarchy: 1.1}, {id: "R03",articlename: "Arts Review", section: "Arts Review" ,hierarchy: 1.2}]};


res.render('setup',{
      locals: {
        name: "Setup Page",
        sections: sections,
        articles: articles
      }
    });
});


app.get('/article/:id',function(req,res){
  article = {
        id: 'N01',
            type: 'article',
            teaser: 'Posuere ipsum at tristique a, fringilla porta, fusce.',
                body: 'Posuere ipsum at tristique a, fringilla porta, fusce. Ligula, nisl in augue platea semper. Amet mi odio arcu metus iaculis lectus dui adipiscing consequat, pede nec. Libero, phasellus class quis quis aliquet diam, dolor. Auctor. Ut, bibendum. Feugiat condimentum nibh enim elementum. Platea a, cubilia ac malesuada aliquam. Eni eu fermentum urna. Ut, sapien curabitur torquent, nostra sapien dolor suspendisse per, sociis diam. Tellus quis, in pellentesque. Eros blandit ipsum. Semper cras ut mus tincidunt tempor.',
                    title: 'Eni magna hendrerit.',
                    subtitle: 'More random text',
                    authors: ['Trevor Terris', 'Dean Chen'],
                    hiearchy: 1.0, 
                    section: 'Speakers and Events',
                    images: [{filename:'article_ChelseaPieroni.jpg' , photocredit:'Chelsea Pieroni/The Chronicle', caption:'' }, {filename:'thumb_ChelseaPieroni.jpg' , photocredit:'Chelsea Pieroni/The Chronicle', caption:'' }]

  }
  res.render('article/'+req.params.id, {
            locals:{
            article: article
            }
            });
});





app.listen(8124);
console.log('Server running at http://127.0.0.1:8124/');
