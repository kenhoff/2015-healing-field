
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


module.exports = {}

module.exports.getPerson = function (personID, cb) {
	request.get("http://www.google.com/" + personID, function () {
		cb(samplePerson)
	})
}

module.exports.getAllPeople = function (cb) {
	request.get("http://www.google.com", function () {
		cb(samplePersonList);
	})
}
