const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, 
        required: [true, 'cannot be empty'],
        min: [0.01, 'minimum amount to offer is 0.01']
    },
    status: {type: String, 
        required: [true, 'cannot be empty'], 
        enum: ['pending', 'rejected', 'accepted'],
        default: 'pending'
    }
},
{timestamps: true}
);


// offers
module.exports = mongoose.model('Offer', offerSchema);