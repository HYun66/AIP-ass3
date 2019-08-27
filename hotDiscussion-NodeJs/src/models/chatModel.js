const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    mainImage: {
        type: String,
        require: true
    }
    // comment: [{
    //     commenter: {
    //         type: String,
    //         //require: true
    //     },
    //     content: {
    //         type: String,
    //         //require: true
    //     }
    // }],
    // owner: {
    //     type: String,
    //     //type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    // likes: [{
    //     liker: {
    //         type: String,
    //         //require: true
    //     }
    // }]
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat