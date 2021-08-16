import express, { Request, Response } from 'express';
import cors from 'cors';

const app: any = express();
const port: number = 4545;

app.use(cors());
app.use(express.json());

app.use(express.static('./public'));

app.get('/test', (req: Request, res: Response) => {
  res.json({ test: 'test' });
});

app.listen(port, () => console.log(`http://localhost:${port}`));

/**
 * Event handler for when user connects to database.
 * @param {WebSocket} ws -> Websocket object.
 */
// async function onConnection(ws) {
//     const text = JSON.stringify(await queryDb());
//     console.log("SENDING JSON DATA");
//     ws.send(text);
//     // Adds messgae event from client and checks if its a download request for a push to database request.
//     ws.on('message', async (e) => {
//         if (e == "DOWNLOAD") {
//             console.log("DOWNLOAD");
//             const query = await queryResults();
//             const json = JSON.stringify(extractResults(query.rows));
//             ws.send(json);
//         } else {
//             pushToDb(e);
//             console.log("PUSH TO DB");
//         }
//     });
// }

/**
 * Convers query results from database into array.
 * @param {Object} object -> Object with results.
 */
function extractResults(object: any) {

    let results: any[] = [];

    object.forEach((element: any) => {
        results.push(element.results_json);
    });
    return results;
}