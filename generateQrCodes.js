rimraf = require("rimraf")
mkdirp = require("mkdirp")
qrStuff = require("./qr_stuff")

people = require("./people")




rimraf(__dirname + "/qrcodes", function() {
	getAllSoldiers(function(heroesList) {
		//loop through soldiers
		mkdirp(__dirname + "/qrcodes", function(err) {
			if (err) {
				console.log(err)
			}
			async.mapLimit(heroesList.slice(0, 10000), 10, function(hero, cb) {
				//async.mapLimit(heroesList, 10, function (hero, cb){
				url = req.protocol + '://' + req.get('host') + "/" + hero.hash
				console.log("generating qr code:", url)
				generateQrCode(url, function(qrCode) {
					initialDateString = hero.DoD.split(" ")[0].split("/")
					year = initialDateString[2]
					day = initialDateString[1]
					if (day <= 9) {
						day = "0" + day
					}
					month = initialDateString[0]
					if (month <= 9) {
						month = "0" + month
					}
					dateString = [year, month, day].join("-")
					lastNameString = hero.name.split(",")[0]

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
