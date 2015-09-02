rimraf = require("rimraf")
mkdirp = require("mkdirp")
fs = require("graceful-fs")
archiver = require("archiver")

qrStuff = require("./qr_stuff")

people = require("./people")




rimraf(__dirname + "/qrcodes", function() {
	people.getAllPeople(function(peopleList) {
		//loop through soldiers
		mkdirp(__dirname + "/qrcodes", function(err) {
			if (err) {
				console.log(err)
			}
			async.mapLimit(peopleList.slice(0, 10000), 10, function(person, cb) {
			//async.mapLimit(peopleList, 10, function (person, cb){
				url = req.protocol + '://' + req.get('host') + "/" + person.hash
				console.log("generating qr code:", url)
				qrStuff.generateQrCode(url, function(qrCode) {
					lastNameString = person.name.split(",")[0]

					fileString = dateString + "-" + lastNameString
					console.log(fileString)
					qrPipe = qrCode.pipe(fs.createWriteStream(__dirname + "/qrcodes/" + fileString + ".png"))
					console.log("qrpipe created")
					qrPipe.on('close', function() {
						console.log("pipe finished")
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
