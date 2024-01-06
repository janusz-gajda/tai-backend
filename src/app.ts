import {Request, Response} from 'express';
import {logInvokedEndpoint} from './utils/logger'
import {app} from "./controllers/expressController";
import "dotenv/config"

const server = app

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server is listening on port: ${process.env.PORT || 8080}`)
})


// only for test purposes
server.get('/:text', logInvokedEndpoint, (req: Request, res: Response) => {
    res.status(200).send(req.params.text)
})
