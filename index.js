const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const port = 3000
const saltRounds = 10
const secret = 'secret'

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
            alg: 'sha256',
            typ: 'JWT'
        }
        const tokenPayload = {
            name: user,
            role: 'user'
        }
        const headerBuffer = Buffer.from(JSON.stringify(tokenHeader)).toString('base64')
        const payloadBuffer = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')
        const signature = crypto
            .createHash('sha256')
            .update(headerBuffer + '.' + payloadBuffer + secret)
            .digest('base64');

        res.send(JSON.stringify({token: headerBuffer + '.' + payloadBuffer + '.' + Buffer.from(signature).toString('base64')}))
    }
    else {
        res.send(500)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})