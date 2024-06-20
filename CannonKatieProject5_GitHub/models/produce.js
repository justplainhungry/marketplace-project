const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required'],
            minLength: [4, 'title should be at least 4 characters'],
            maxLength: [20, 'title maximum is 20 characters']},
    seller: {type: Schema.Types.ObjectId, 
        ref: 'User'},
    condition: {type: String, 
        required: [true, 'condition is required'], 
        enum: ['Still on the branch', 'Harvested Yesterday', 'Harvested 2 days ago', 'Harvested 3 days ago',
        'Harvested 4 days ago', 'Harvested 5 days ago', 'Harvested a week ago', 'Harvested this season']},
    price: {type: Number, 
        required: [true, 'price is required'], 
        min: [0.01, 'minimum price is 0.01']}, 
    details: {type: String, 
        required: [true, 'description is required'],
        minLength: [10, 'description should be at least 10 characters'],
        maxLength: [150, 'description maximum is 150 characters']},
    image: {type: String, 
        required: [true, 'image is required'],
        match: [/^\.\/images\/.*$/, 'Invalid image path']},
    totalOffers: {type: Number, 
        default: 0},
    active: {type: Boolean, 
        default: true},
    highestOffer: { type: Number, 
        default: 0} 
}, 
{timestamps: true} 
);

// Collection Name: items
module.exports = mongoose.model('Item', itemSchema);
