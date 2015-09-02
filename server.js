async = require("async")
express = require("express")
parseString = require("xml2js").parseString
bodyParser = require("body-parser")
sanitizeHtml = require("sanitize-html")
request = require("request")
qr = require("qr-image")
fs = require("graceful-fs")
archiver = require("archiver")
mkdirp = require("mkdirp")
timeout = require("connect-timeout")
favicon = require("serve-favicon")
rimraf = require("rimraf")

imgURL = "https://fieldofherosimageapi.azurewebsites.net/Service1.svc/images/";

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






BasicHttpBinding = require("wcf.js").BasicHttpBinding
Proxy = require('wcf.js').Proxy
binding = new BasicHttpBinding({})

proxy = new Proxy(binding, process.env.BINDING_API)

app = express()

app.set("view engine", "jade")

app.use(bodyParser.urlencoded({extended:false}))

app.use(favicon(__dirname + "/favicon.ico"))

app.get("/", function (req, res) {

	getAllSoldiers(function (heroesList) {
		res.render("allHeroes", {heroesList: heroesList})
	})

	// res.render("allheroes", {heroesList: []});
})




function getAllSoldiers (cb) {

	cb(samplePersonList);
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
}


app.get("/:heroId", function (req, res) {

	res.render("hero", samplePerson);

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

})

app.get("/img/:heroid", function (req, res) {
	request.get("https://fieldofherosimageapi.azurewebsites.net/Service1.svc/images/" + req.params.heroid).pipe(res)
})


app.get("/qr/:heroID", function (req, res) {

	heroID = req.params.heroID
	url = req.protocol + '://' + req.get('host') + "/" + heroID

	generateQrCode (url, function (qrCode) {
		qrCode.pipe(res)
	})
})

function generateQrCode (url, cb) {
	qr_code = qr.image(url, {type: "png"})
	cb(qr_code)
}


console.log("listening")
app.listen(process.env.PORT || 5000)
