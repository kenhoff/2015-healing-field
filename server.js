async = require("async")
express = require("express")
bodyParser = require("body-parser")
sanitizeHtml = require("sanitize-html")
request = require("request")
qr = require("qr-image")
fs = require("graceful-fs")
archiver = require("archiver")
favicon = require("serve-favicon")

samplePerson = {
	"Title": "Cpt",
	"First": "John",
	"Middle": "Middlename",
	"Last": "Smith",
	"Age": "42",
	"Residence": "New York",
	"State": "NY",
	"Location": "WTC",
	"Bio": "bio 1",
	"Bio2": "bio 2"
}

samplePersonList = [
	{
		"name": "name",
		"hash": "1234"
	},
	{
		"name": "name",
		"hash": "1234"
	},
	{
		"name": "name",
		"hash": "1234"
	}
]

app = express()

app.set("view engine", "jade")

app.use(bodyParser.urlencoded({extended:false}))

app.use(favicon(__dirname + "/favicon.ico"))

app.get("/", function (req, res) {
	getAllPeople(function (peopleList) {
		res.render("allPeople", {peopleList: peopleList})
	})
})

app.get("/:personID", function (req, res) {
	getPerson(sanitizeHtml(req.params.personID), function (person) {
		res.render("person", samplePerson);
	})
})

app.get("/qr/:personID", function (req, res) {
	personID = sanitizeHtml(req.params.personID)
	url = req.protocol + '://' + req.get('host') + "/" + personID
	generateQrCode (url, function (qrCode) {
		qrCode.pipe(res)
	})
})

function getPerson(personID, cb) {
	request.get("http://www.google.com/" + personID, function () {
		cb(samplePerson)
	})
}

function getAllPeople (cb) {
	request.get("http://www.google.com", function () {
		cb(samplePersonList);
	})
}

function generateQrCode (url, cb) {
	qr_code = qr.image(url, {type: "png"})
	cb(qr_code)
}

port = process.env.PORT || 5000
console.log("listening on", port)
app.listen(port)

	// message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><GetRecordFromNameHash xmlns="http://tempuri.org/"><namehash>' + sanitizeHtml(req.params.heroId) + '</namehash></GetRecordFromNameHash></s:Body></s:Envelope>'
	// proxy.send(message, "http://tempuri.org/IService1/GetRecordFromNameHash", function(response, ctx) {
	// 	console.log(ctx.statusCode)
	// 	if (ctx.statusCode == 500) {
	// 		res.sendStatus(500)
	// 	}
	// 	else {
	// 		parseString(response, function (err, result){
	// 			if (typeof result['s:Envelope']['s:Body'][0]['GetRecordFromNameHashResponse'][0]['GetRecordFromNameHashResult'][0]["a:NameHashd"][0] != "string") {
	// 				res.send(404)
	// 			}
	// 			else {
	// 				soldier = result['s:Envelope']['s:Body'][0]['GetRecordFromNameHashResponse'][0]['GetRecordFromNameHashResult'][0]
	// 				newSoldier = {}
	// 				keys = Object.keys(soldier)
	// 				for (i = 1; i <= keys.length - 1; i++) {
	// 					newKey = keys[i].replace("a:", "")
	// 					newSoldier[newKey] = soldier[keys[i]][0]
	// 				}
	// 				//delete newSoldier['CustomURL']
	// 				newSoldier["DateOfDeath"] = (new Date(Date.parse(newSoldier["DateOfDeath"]))).toDateString()
	// 				console.log(newSoldier)
	// 				if ((newSoldier["CustomPage"] == "true") && (newSoldier["CustomURL"] != "")) {
	// 					console.log("redirecting to", newSoldier["CustomURL"])
	// 					res.redirect(newSoldier["CustomURL"])
	// 				}
	// 				else {
	// 					res.render("hero", newSoldier)
	// 				}
	// 			}
	// 		})
	// 	}
	// })


	//
	// message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header></s:Header><s:Body><GetAllHeroPairs xmlns="http://tempuri.org/"></GetAllHeroPairs></s:Body></s:Envelope>'
	//
	// proxy.send(message, "http://tempuri.org/IService1/GetAllHeroPairs", function(response, ctx) {
	// 	//console.log(ctx.statusCode)
	// 	//console.log(response)
	// 	if (ctx.statusCode == 500) {
	// 		res.sendStatus(500)
	// 	}
	// 	else {
	// 		parseString(response, function (err, result){
	// 			heroes = result['s:Envelope']["s:Body"][0]["GetAllHeroPairsResponse"][0]["GetAllHeroPairsResult"][0]["a:HeroPair"]
	// 			heroesList = []
	// 			for (i = 0; i < heroes.length; i++) {
	// 				//console.log(heroes[i])
	// 				heroesList.push( {
	// 					name: heroes[i]["a:Name"][0],
	// 					hash: heroes[i]["a:NameHashd"][0],
	// 					DoD: heroes[i]["a:DoD"][0]
	// 				})
	// 			}
	// 			//console.log(heroesList)
	// 			cb(heroesList)
	// 		})
	// 	}
	// })
