const mongoose=require('mongoose')
const Schema=mongoose.Schema


const disheShema =new Schema({
    dishe:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dish'
    }
})

const favoriteSchema =new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dishes:[disheShema]
})

var  Favorites = mongoose.model('favorite',favoriteSchema)
module.exports = Favorites