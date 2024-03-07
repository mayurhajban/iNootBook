const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//ROUTE 1: Get all the user using GET "/api/notes/fetchallnotes". Login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

//ROUTE 2: Add a new notes using POST "/api/notes/addnotes". Login require
router.post('/addnotes', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Discription must be atleast of 5 letters').isLength({ min: 5 })
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        //If there are error return bad requests and the error
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNotes = await note.save()

        res.json(saveNotes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

//ROUTE 3: Update an existing notes using PUT "/api/notes/updatenote/:id". Login require

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the notes to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }

})


//ROUTE 4: Delete an existing notes using DELETE "/api/notes/deletenote/:id". Login require

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the notes to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

module.exports = router