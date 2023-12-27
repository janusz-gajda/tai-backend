import express, {Request, Response} from 'express';
import {logInvokedEndpoint} from './utils/logger'

require('dotenv').config()
const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`)
})

// only for test purposes
app.get('/:text', logInvokedEndpoint, (req: Request, res: Response) => {
    res.status(200).send(req.params.text)
})
