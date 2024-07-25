const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8000;

app.use(express.json()); // Middleware to parse JSON bodies

const FILE_DIR = path.join(__dirname, 'files');

if (!fs.existsSync(FILE_DIR)) {
    fs.mkdirSync(FILE_DIR);
}

app.post('/user-create', (req, res) => {
    const currentDate = new Date();
    const timestamp = currentDate.toISOString();
    const filename = `${currentDate.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(FILE_DIR, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.json({ message: 'File created', filename: filename });
    });
});

app.get('/list-files', (req, res) => {
    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to list files' });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.json({ files: textFiles });
    });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
