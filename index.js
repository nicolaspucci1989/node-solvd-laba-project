const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const port = 3000
const saltRounds = 10
const secret = 'secret'

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
});
const auth = {}

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/signup', async (req, res) => {
	const { user, password } = req.body
	const hashedPassword = await bcrypt.hash(password, saltRounds)
	auth[user] = hashedPassword
	console.log(auth)
	res.send(hashedPassword)
})

function encodeToBase64Url(data) {
	return Buffer.from(JSON.stringify(data)).toString("base64url")
}

app.post('/signin', async (req, res) => {
	const { user, password } = req.body
	const result = await bcrypt.compare(password, auth[user])
	if (result) {
		const tokenHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}
		const tokenPayload = {
			name: user,
			role: 'user'
		}
		const encodedData = Buffer.from(JSON.stringify(tokenHeader)).toString('base64url') +
			'.' +
			Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')

		const signature = crypto.createHmac('sha256', secret)
			.update(encodedData)
			.digest('base64url')

		const jwt = encodedData + '.' + signature
		res.send(JSON.stringify({ jwt }))
	} else {
		res.send(500)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
