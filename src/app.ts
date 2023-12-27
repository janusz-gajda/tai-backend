import {Request, Response} from 'express';
import {logInvokedEndpoint} from './utils/logger'
import {app} from "./controllers/expressController";

require('dotenv').config()
const server = app

server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`)
})


// only for test purposes
server.get('/:text', logInvokedEndpoint, (req: Request, res: Response) => {
    res.status(200).send(req.params.text)
})
