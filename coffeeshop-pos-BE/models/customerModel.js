const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: false
    },
    points: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        required: false,
        enum: ['gold', 'silver', 'bronze', 'no-rank'],
        default: 'no-rank',
        validate: {
            validator: function(v) {
                return ['gold', 'silver', 'bronze', 'no-rank'].includes(v);
            },
            message: 'Rank must be one of: gold, silver, bronze, no-rank'
        }
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    lastPurchase: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to calculate discount based on rank
customerSchema.methods.calculateDiscount = function() {
    switch(this.rank) {
        case 'gold':
            return 0.15; // 15% discount
        case 'silver':
            return 0.10; // 10% discount
        case 'bronze':
            return 0.05; // 5% discount
        default:
            return 0;
    }
};

// Method to update rank based on points
customerSchema.methods.updateRank = function() {
    if (this.points >= 1000) {
        this.rank = 'gold';
    } else if (this.points >= 500) {
        this.rank = 'silver';
    } else if (this.points >= 100) {
        this.rank = 'bronze';
    } else {
        this.rank = 'no-rank';
    }
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 