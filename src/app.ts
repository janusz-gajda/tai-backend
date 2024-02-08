import "./utils/overrides";
import {app} from "./controllers/expressController";
import "dotenv/config"

const server = app

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server is listening on port: ${process.env.PORT || 8080}`)
})
