

const express = require('express')
const Chat = require('../models/chatModel')
const auth = require('../middleware/authentication')
const upload = require('../middleware/chattingImage')
const router = new express.Router()
const User = require('../models/userModel')
const changePostPic = require('../middleware/editPost')
const comment = require('../middleware/comment')

router.post('/chats', auth, upload.single('image'), async (req, res) => {
    const chat = new Chat({
        mainImage: req.myFileUrl,
        ownerName: req.user.name,
        ownerId: req.user._id,
        path: req.myPath
    })
    
    try {
        await chat.save()
        console.log(req.myFileUrl)
        res.status(201).send(chat)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
// reference at https://www.youtube.com/watch?v=98lmyK5Bu_I && https://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value?page=1&tab=votes#tab-top
router.get('/chatsLength', async (req, res) => {

    try {
        const chatListAll = await Chat.find({})
        let len = {Len:chatListAll.length}
        // console.log(len)
        // console.log(typeof (len))
        res.status(200).send(len)

    }
    catch (e) {
        res.status(404).send()
    }
})


router.get('/chats', async (req, res) => {
    try {
        const pagination = req.query.pagination ? parseInt(req.query.pagination):10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const popular = req.query.popular == 'popular'? 1:0
        const rankingByNew = req.query.new == 'rankingByNew'? 1:0

        if(popular){
            let chatList = await Chat.aggregate([
                {
                    "$project": {
                        "_id":1,
                        "mainImage": 1,
                        "ownerName": 1,
                        "ownerId": 1,
                        "path": 1,
                        "likes":1,
                        "likeSize": {$size:"$likes"},
                        "comments": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "__v": 1}
                },
                {
                    "$sort": {"likeSize": -1}
                },
                {
                    "$skip":(page-1)* pagination
                },
                {
                    "$limit":pagination
                }


            ])
            chatList.map(list=> delete list.likeSize)

            res.status(200).send(chatList)
        }
        else if(rankingByNew) {
            let chatList = await Chat.find({})
                .sort({ '_id': -1 })
                 .limit(pagination)
                .skip((page-1)* pagination)
            res.status(200).send(chatList)
        }
        else {
            let chatList = await Chat.find({})
                .sort({ '_id': -1 })
                .limit(pagination)
                .skip((page-1)* pagination)
            res.status(200).send(chatList)
        }
    }
    catch (e) {
        res.status(404).send(e)
    }
})

router.get('/chat/:id', async (req, res) => {
    try {
        const chattingId = req.params.id
        const singleChatting = await Chat.findOne({_id: chattingId})
        if(singleChatting) {
            return res.send(singleChatting)
        }
    }
    catch (e) {
        res.status(401).send()
    }
})

router.get('/chats/likes', async (req, res) => {
    try {
        let nowTime = new Date((new Date).getTime());
        let lastWeek = new Date((new Date).getTime() - 7 * 1000 * 86400);
        const userRanking = await Chat.aggregate(
            [       
                    {
                        $match: 
                        { 
                            "createdAt":{
                                $gte: lastWeek,
                                $lte: nowTime
                                        }
                        }
                    },
                    {   
                        $project:
                        {
                            _id: "$ownerName",
                            name: "$ownerName",
                            totalLike: {$size : "$likes"},
                            count: {sum: 1}
                        }
                    },
                    {
                        $match : {totalLike: {$gt : 0}}
                    },
                    {
                        $group:
                        {   
                            _id:  {name: "$name"},
                            likes: {$sum : "$totalLike"}  
                         }
                    },
                    {
                        $sort : {likes : -1}
                    }
            ]
        )
        if(userRanking) {
            if(userRanking.length > 5){
                userRanking.splice(5)
            }
            return res.send(userRanking)
        }
    }
    catch (e) {
        res.status(401).send()
    }
})

router.post('/edit/:id',auth, changePostPic.single('image'), async (req, res) =>{
    try{
        const id = req.params.id
        console.log(id)
        res.send({id})
        const editPost = await Chat.save()
        res.status(201).send(editPost)
        console.log(editPost)

    }
    catch (e) {
        res.status(404).send()
    }


})

router.post('/delete/:id',auth, async (req, res) => {
    try {
        const id = req.params.id
        const deletePost = await Chat.findOne({_id: id})
        deletePost.remove()
        res.status(200).send({success: 'delete successfully'})


    } catch (e) {
        res.status(404).send()
    }
})

router.put('/like/:id',auth, async (req, res) => {
    try {
        const id = req.params.id
        let likedPost = await Chat.findOne({_id: id})

        for (let i =0; i<likedPost.likes.length; i++){
            if(likedPost.likes[i].liker == req.user.name){
                likedPost.likes.splice(i,1)
                await likedPost.save()
                return res.status(201).send(likedPost)
            }
        }

        likedPost.likes.push({liker: req.user.name})
        await likedPost.save()
        res.status(201).send(likedPost)


    } catch (e) {
        res.status(404).send(likedPost)
    }
})

router.post('/comment/:id/:path', auth, comment.single('image'), async (req, res) => {
    try {
        let id = req.params.id
        let path = req.params.path

        // console.log(path)
        let myChat = await Chat.findOne({_id: id})
        if (myChat) {
            myChat.comments.push({
                commenter: req.user.name,
                content: req.finalPath
            })
            await myChat.save()
            res.status(201).send(myChat)
        }
    }
    catch (e) {
        res.status(401).send()
    }
})

router.post('/emoji', auth, async (req, res) => {
    try {
        let myChat = await Chat.findOne({_id: req.body.id})
        if (myChat) {
            myChat.comments.push({
                commenter: req.body.commenter,
                content: req.body.url,
                tag: 0
            })
            await myChat.save()
            res.send(myChat)
        }
    }
    catch (e) {
        res.status(401).send()
    }
})

router.get('/chats/topics', async (req, res) => {
    try {
        let nowTime = new Date((new Date).getTime());
        let lastWeek = new Date((new Date).getTime() - 7 * 1000 * 86400);
        const topicRanking = await Chat.aggregate(
            [       
                {
                    $match: 
                    { 
                        "createdAt":{
                            $gte: lastWeek,
                            $lte: nowTime
                                    }           
                    }},
                {   
                
                    $project:
                    {
                        _id: "$ownerName",
                        name: "$ownerName",
                        image: "$mainImage",
                        totalLike: {$size : "$likes"},
                        count: {sum: 1}
                    }
                },
                {
                    $match : {totalLike: {$gt : 0}}
                },
                {
                    $sort : {totalLike : -1 }
                }
            ]
        )
        if(topicRanking) {
            if(topicRanking.length > 3){
                topicRanking.splice(3)
            }
            return res.send(topicRanking)
        }
    }
    catch (e) {
        res.status(401).send()
    }
})
module.exports = router
