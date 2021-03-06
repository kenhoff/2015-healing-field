rimraf = require("rimraf")
mkdirp = require("mkdirp")
fs = require("graceful-fs")
archiver = require("archiver")
request = require("request")
async = require("async")

qrStuff = require("./qr_stuff")

people = require("./people")

count = 0
// 3113

baseURL = "http://www.phoenixhealingfield.com/"

rimraf(__dirname + "/qrcodes", function() {
	people.getAllPeople(function(peopleList) {
		//loop through soldiers
		mkdirp(__dirname + "/qrcodes", function(err) {
			if (err) {
				console.log(err)
			}
			// async.mapLimit(peopleList.slice(0, 100), 10, function(person, cb) {
			async.mapLimit(peopleList, 10, function (person, cb){
				url = baseURL + person.NameHashd
				// console.log("generating qr code:", url)
				qrStuff.generateQrCode(url, function(qrCode) {
					fileString = person.Location + "-" + person.NameLFM

					fileString = fileString.replace(/ /g, "");
					fileString = fileString.replace(/WorldTradeCenterFirstResponders/g, "WTCFR");
					fileString = fileString.replace(/WorldTradeCenter/g, "WTC");
					fileString = fileString.replace(/AAFlight11/g, "AA11");
					fileString = fileString.replace(/AAFlight77/g, "AA77");
					fileString = fileString.replace(/UAFlight93/g, "UA93");
					fileString = fileString.replace(/UAFlight175/g, "UA175");
					fileString = fileString.replace(/Pentagon/g, "P");
					fileString = fileString.slice(0, 18);


					// console.log(fileString)
					qrPipe = qrCode.pipe(fs.createWriteStream(__dirname + "/qrcodes/" + fileString + ".png"))
					// console.log("qrpipe created")
					qrPipe.on('close', function() {
						// console.log("pipe finished")
						count++
						console.log(count)
						cb(null)
					})
				})
			}, function(err, results) {
				console.log("done generating qr codes")
				rimraf(__dirname + "/qrcodes.zip", function() {
					zipFile = archiver("zip")

					output = fs.createWriteStream(__dirname + "/qrcodes.zip")
					console.log("created write stream")
					output.on('close', function() {
						console.log("output closed")
					})
					console.log("created close event callback")


					zipFile.pipe(output)
					console.log("told zipfile to pipe to output")


					zipFile.bulk([{
						src: ["qrcodes/*.png"]
					}]).finalize()
					console.log("told zipfile to zip qrcodes directory and finalize")
				})

			})
		})
	})
})
