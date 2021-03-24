import {Schema, model } from 'mongoose';

const photoSchema = new Schema({
    Author: String ,
    Name: String,
    Description: String,
    Cover: String,
    HashTags: [String],
    Published: Date,
    Likes:Number,
    Comments:[String]

});

const Photo = model("Photo", photoSchema);

export default Photo;