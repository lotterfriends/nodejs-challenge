import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from 'url';

const baseDir = join(__dirname, '..', '..');
const outputDir = join(baseDir, 'output');

const certPath = join(baseDir, 'localhost.crt');
const keyPath = join(baseDir, 'localhost.key');

const options = {
    cert: readFileSync(certPath),
    key: readFileSync(keyPath),
};

const server = createServer(options, (req, res) => {
    const parsedUrl = parse(req.url || '', true);
    const testing = 'testing' in parsedUrl.query;

    const fileName = testing ? 'testing-task4b-result.txt' : 'task4b-result.txt';
    const filePath = join(outputDir, fileName);

    if (!existsSync(filePath)) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end(`Die Datei ${fileName} existiert noch nicht. Bitte zuerst "npm start" ausführen.`);
        return;
    }

    const content = readFileSync(filePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(content);
});

const PORT = 3443;
server.listen(PORT, () => {
    console.log(`HTTPS Server laeuft auf https://localhost:${PORT}`);
    console.log(`Mit testing: https://localhost:${PORT}?testing`);
});
