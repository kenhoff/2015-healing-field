async = require("async")
express = require("express")
bodyParser = require("body-parser")
sanitizeHtml = require("sanitize-html")
request = require("request")
qrStuff = require("./qr_stuff")
favicon = require("serve-favicon")
people = require("./people")

app = express()

app.set("view engine", "jade")

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(favicon(__dirname + "/favicon.ico"))

app.get("/", function(req, res) {
	people.getAllPeople(function(peopleList) {
		res.render("allPeople", {
			peopleList: peopleList
		})
	})
})

app.get("/:personID", function(req, res) {
	people.getPerson(sanitizeHtml(req.params.personID), function(person) {
		res.render("person", samplePerson);
	})
})

app.get("/qr/:personID", function(req, res) {
	personID = sanitizeHtml(req.params.personID)
	url = req.protocol + '://' + req.get('host') + "/" + personID
	qrStuff.generateQrCode(url, function(qrCode) {
		qrCode.pipe(res)
	})
})

port = process.env.PORT || 5000
console.log("listening on", port)
app.listen(port)
