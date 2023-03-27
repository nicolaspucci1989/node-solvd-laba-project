const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const port = 3000
const saltRounds = 10
const secret = 'secret'

// store users
const auth = {}

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/signup', async (req, res, next) => {
	const { user, password } = req.body
	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds)
		auth[user] = hashedPassword
		console.log(auth)
		res.send(hashedPassword)
	} catch (e) {
		next('error')
	}
})


app.post('/test',
	verifyAuth,
	(req, res, next) => {
		res.send()
	}
)


app.post('/signin', async (req, res, next) => {
	const { user, password } = req.body
	let result

	try {
		result = await bcrypt.compare(password, auth[user])
	} catch (e) {
		next('error')
	}

	if (result) {
		const tokenHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}

		const tokenPayload = {
			name: user,
			role: 'user'
		}

		const encodedData = encodeToBase64Url(tokenHeader) +
			'.' +
			encodeToBase64Url(tokenPayload)

		const signature = signToken(encodedData, secret)

		const jwt = encodedData + '.' + signature
		res.send(JSON.stringify({ jwt }))
	} else {
		res.send(500)
	}
})

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})

function verifyAuth(req, res, next) {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split('Bearer ').pop()
			const [header, payload, signature] = token.split('.')

			const tokenChecks = verifyToken(header, payload, signature, secret)

			if (tokenChecks) {
				next()
			} else {
				res.rejectUnauthorized()
			}
		} catch (e) {
			res.status(401)
			throw new Error("Auth failed")
		}
	}

	if (!token) {
		res.status(401)
		throw new Error("Auth failed")
	}

}

function verifyToken(headerEncoded, payloadEncoded, signatureEncoded, secret) {
	const encodedData = Buffer.from(headerEncoded + '.' + payloadEncoded);
	const generatedSignature = crypto.createHmac('sha256', secret)
		.update(encodedData)
		.digest('base64url');
	return generatedSignature === signatureEncoded
}

function encodeToBase64Url(data) {
	return Buffer.from(JSON.stringify(data)).toString("base64url")
}

function signToken(data, secret) {
	return crypto.createHmac('sha256', secret)
		.update(data)
		.digest('base64url')
}
