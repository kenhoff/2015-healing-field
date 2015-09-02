module.exports = {}

qr = require("qr-image")

module.exports.generateQrCode = function (url, cb) {
	qr_code = qr.image(url, {type: "png"})
	cb(qr_code)
}
