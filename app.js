const http = require("http")

const server = http.createServer((req, res) => {
	if(req.url === "/") {
		res.writeHead(200, {"Content-Type": "text/plain"})
		res.end("Ok")
	} else {
		res.writeHead(400)
		res.end("Not Found")
	}
})

server.listen(8080, () => {
	console.log('Server running on port 8080')
})
