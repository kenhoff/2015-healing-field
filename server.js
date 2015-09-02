async = require("async")
express = require("express")
bodyParser = require("body-parser")
sanitizeHtml = require("sanitize-html")
request = require("request")
qrStuff = require("./qr_stuff")
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
	qrStuff.generateQrCode (url, function (qrCode) {
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



port = process.env.PORT || 5000
console.log("listening on", port)
app.listen(port)
