var express = require('express')
var app = express();
express
// set the view engine to ejs
app.set('view engine', 'ejs')

var cookieParser = require('cookie-parser')
var mysql2 = require('mysql2')
var Promise = require("bluebird")
const passport = require("passport")
//app.use(cookieParser())
//app.use(cookieSession())

const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

Promise.promisifyAll(mysql2);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'legos4me',
    database: 'pokemondb'
});

function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function (connection) {
        console.log("Releasing connection back to pool")
        connection.release();
    });
}

function querySql (query, params) {
    return Promise.using(getSqlConnection(), function (connection) {
        console.log("Got connection from pool");
        if (typeof params !== 'undefined'){
            return connection.queryAsync(query, params);
        } else {
            return connection.queryAsync(query);
        }
    });
};

module.exports = {
    getSqlConnection : getSqlConnection,
    querySql : querySql
};

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  if(req.query != null) {
    //console.log(req.query.id)
    search_id = req.query.id
    const pkquery = 'SELECT Number, Name, Type1, Type2, Base_Total ' +
                    'FROM FirstGenPokemon ' +
                    'WHERE Name CONTAINS(' + search_id + ')'
    //console.log(pkquery)
    connection.query(pkquery, function(error, result) {
      /*result.forEach(entry => {
        console.log(entry.Name)
      })*/
      //console.log(result)
      if (error) {
        //console.log('Wrong loop')
        const pkquery2 = 'SELECT Number, Name, Type1, Type2, Base_Total FROM FirstGenPokemon'
        connection.query(pkquery2, function(error, result) {
          res.render('pages/index', {
            pokemon: result
          });
        })
      }
      else {
      res.render('pages/index', {
        pokemon: result
      });
    }
    })
  }
  /*else {
    const pkquery = 'SELECT Number, Name, Type1, Type2, Base_Total FROM FirstGenPokemon'
    connection.query(pkquery, function(error, result) {
      
      res.render('pages/index', {
        pokemon: result
      });
    })
  }*/
  //console.log(pokemon)
  //  var pkresult= [
  //  { Number: '1', Name: 'Bulbasaur', Type1: 'Grass', Type2: 'Poison', Base_Total: '300'}
  //];

  
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getSprite(name) {
  var string = '../Data/Sprites'
  string.concat(capitalizeFirstLetter(name), '.png')
  console.log(string)
}

// about page
app.get('/entry', (req, res) => {
  //console.log("test")
  const pok_id = req.query.id
  //console.log(pok_id)
  const pkquery = 'SELECT Number, Name, Type1, Type2, Base_Total, HP, Attack, Defense, Special, Speed ' +
                  'FROM FirstGenPokemon ' +
                  'WHERE Number = ' + pok_id
  connection.query(pkquery, function(error, result) {
    spritePath = getSprite('bulbasaur')
    //console.log(result)
    res.render('pages/entry', {
      pokemon: result,
      sprite: spritePath
    })
  })
  /*var pokemon = [
    {Number: '1', Name: 'Bulbasaur', Type1: 'Grass', Type2: 'Poison', Base_Total: '300'}
  ]
  res.render('pages/entry', {pokemon: pokemon})*/
})


app.listen(3000)
console.log('Server is listening on port 3000')