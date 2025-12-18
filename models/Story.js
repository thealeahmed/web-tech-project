const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    author: {
        type: String,
        default: "Anonymous",
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
storySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
