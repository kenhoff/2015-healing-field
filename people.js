// sample person

// { Age: '32',
//   Bio: '"Went to Babson College in Wellesley, MA and earned a business degree.  ""He always knew he wanted to go to Wall Street,"" said his father, Gordon.  Gordy Aamoth was at the top of his game.  On Monday, September "',
//   Bio2: '"10, in his hometown of Minneapolis, he completed his biggest merger deal as an investment banker at Sandler O\'Neill & Partners.  The deal was to be officially announced the next day at the firm\'s World Trade Center office."',
//   City: 'New York',
//   FirstName: 'Gordon',
//   HeroId: 1,
//   LastName: 'Aamoth',
//   Location: 'World Trade Center',
//   MiddleName: 'McCannel',
//   NameHashd: '3C43D658',
//   State: 'NY',
//   Title: '' }

module.exports = {}

module.exports.getPerson = function(personID, cb) {
	request.get("http://nineelevenapi.cloudapp.net/Service1.svc/heroes/" + personID, function(err, res, body) {
		// console.log()
		cb(JSON.parse(body))
	})
}

module.exports.getAllPeople = function(cb) {
	request.get("http://nineelevenapi.cloudapp.net/Service1.svc/heroes", function(err, res, body) {
		// console.log(JSON.parse(body)[0]["NameHashd"]);
		cb(JSON.parse(body));
	})
}
