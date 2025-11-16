import express from 'express'
import { CreateNotes, Delete, GetNotes, UpdateNotes } from '../controllers/Notes.js'
import { TokenVerfication } from '../middlewares/TokenVerfication.js'

const NotesRoutes=express.Router()

NotesRoutes.post('/create',TokenVerfication,CreateNotes)
NotesRoutes.put('/update/:id',TokenVerfication,UpdateNotes)
NotesRoutes.delete('/delete/:id',TokenVerfication,Delete)
NotesRoutes.get('/getnotes',TokenVerfication,GetNotes)



export default NotesRoutes