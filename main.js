const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.get('/cats', (req, res) => {
    const result = fs.readFileSync('./apis/cats/cat.json')
    res.send(JSON.parse(result))
})

app.get('/cats_products/:id', (req, res) => {
    const result = fs.readFileSync(`./apis/cats_products/${req.params.id}`)
    res.send(JSON.parse(result))
})

app.get('/products/:id', (req, res) => {
    const result = fs.readFileSync(`./apis/products/${req.params.id}`)
    res.send(JSON.parse(result))
})

app.get('/products_comments/:id', (req, res) => {
    const result = fs.readFileSync(`./apis/products_comments/${req.params.id}`)
    res.send(JSON.parse(result))
})

app.get('/default_cart', (req, res) => {
    const result = fs.readFileSync(`./apis/user_cart/25801.json`)
    res.send(JSON.parse(result))
})

app.post('/buy_cart', (req, res) => {
    const request = req.body
    let actual = undefined

    try {
        try {
            actual = fs.readFileSync('./apis/buy_cart/cartHistory.json')
        } finally {
            if (actual != undefined) {
                const toSave = JSON.parse(actual)
                toSave.push(request)
                fs.writeFileSync('./apis/buy_cart/cartHistory.json', JSON.stringify(toSave, null, 2))
            } else {
                const toSave = [request]
                fs.writeFileSync('./apis/buy_cart/cartHistory.json', JSON.stringify(toSave, null, 2))
            }

            res.send({ messege: 'Cart saved successfully' })
        }

    } catch (error) {
        res.send({ messege: 'Error occur' + error.messege })
    }

})

app.listen(PORT, () => {
    console.log("servidor en ejecución en http://localhost:" + PORT);
});