import Reptile from "../models/Reptile.js";
import mongoose from 'mongoose';

export const GetAllReptile = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;

        const reptile = await Reptile.find({})
            .sort({ species: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await Reptile.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: reptile,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        res.status(500).send();
    }
};


export const GetIDReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;

        const reptile = await Reptile.findById(id);
        console.log(reptile);
        if (!reptile) res.status(404).send();
        else res.send(reptile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Not Found' });
    }
};

export const GetAllReptileByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const reptile = await Reptile.find({ user: userId });

        if (!reptile || reptile.length === 0) {
            return res.status(404).send({ message: `No reptiles found for this person ${userId}` });
        }

        res.send(reptile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};


export const PostReptile = async (req, res) => {
    try {
        const reptile = req.body;

        if (reptile.comments && !Array.isArray(reptile.comments)) {
            return res.status(400).send({ message: 'The comments field must be an array.' });
        }

        reptile.comments = reptile.comments || [];

        reptile._id = new mongoose.Types.ObjectId();
        const newReptile = new Reptile(reptile);

        const createdReptile = await newReptile.save();

        res.status(201).send(createdReptile);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'Error creating reptile' });
    }
};


export const PutReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        const reptileData = req.body;

        const reptile = await Reptile.findByIdAndUpdate(id, reptileData, { new: true });
        res.send(reptile);
    } catch (err) {
        res.status(500).send();
    }
};

export const DeleteReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        await Reptile.findByIdAndDelete(id);
        res.send({ message: 'Reptile eliminated' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};

