const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/authentication')
const multer = require('multer')

const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {
        let remoteIp = req.header('x-forwarded-for') || req.connection.remoteAddress
        let ip = req.ip
        let url = req.originalUrl
        // console.log('remote', remoteIp)
        // console.dir(req.ip)
        // console.log('url', url)
        console.log(req.socket.address().family)
        await user.save()
        const token = await user.createToken()
        res.status(201).send({user, token})
    } 
    catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUserByVerification(req.body.email, req.body.password)
        const token = await user.createToken()

        res.send({user, token})
    }
    catch (e) {
        res.status(400).send()
    }

})

router.delete('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
})

const uploadphoto = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/profile', auth, uploadphoto.single('profile'), async (req, res) => {
    req.user.profile = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.profile) {
             throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.profile)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router