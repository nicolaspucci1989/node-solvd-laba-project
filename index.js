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
    const {user, password} = req.body
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    auth[user] = hashedPassword
    console.log(auth)
    res.send(hashedPassword)
})

app.post('/signin', async (req, res) => {
    const {user, password} = req.body
    const result = await bcrypt.compare(password, auth[user])
    if (result) {
        const tokenHeader = {
            alg: 'RS256',
            typ: 'JWT'
        }
        const tokenPayload = {
            name: user,
            role: 'user'
        }
        const headerBuffer = Buffer.from(JSON.stringify(tokenHeader))
        const payloadBuffer = Buffer.from(JSON.stringify(tokenPayload))
        const signature = crypto.sign('sha256',payloadBuffer, {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        })
        const signatureString = signature.toString('base64')
        const jwt = `${headerBuffer.toString('base64')}.${payloadBuffer.toString('base64')}.${signatureString}`
        res.send(JSON.stringify({jwt}))
    }
    else {
        res.send(500)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
