var express = require('express'),
    bodyParser = require('body-parser'),
    pg = require('pg'),
    app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api', function(req, res) {
  console.log(req.body);
  pg.connect(function(err, client) {
    if (err) throw err;
    client.query("INSERT INTO todo(title) values($1) RETURNING id",
        [req.body.title], function(err, result) {
      if (err) throw err;
      res.set('Content-Type', 'application/json');
      req.body.id = result.rows[0].id;
      res.send(req.body);
    });
  });
});

app.post('/api/:id', function(req, res) {
  req.body.done = !!req.body.done;
  console.log(req.params);
  console.log(req.body);
  pg.connect(function(err, client) {
    if (err) throw err;
    client.query("UPDATE todo SET title = $1, DONE = $2 WHERE id = $3",
        [req.body.title, req.body.done, req.params.id], function(err) {
      if (err) throw err;
      res.set('Content-Type', 'application/json');
      res.send(req.body);
    });
  });
});

app.get('/api', function(req, res) {
  pg.connect(function(err, client) {
    if (err) throw err;
    client.query("SELECT * FROM todo ORDER BY id", function(err, result) {
      if (err) throw err;
      res.set('Content-Type', 'application/json');
      res.send(result.rows);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('app is running on port', app.get('port'));
});

// vim:set et sw=2 cino=>2,j1,J1:
