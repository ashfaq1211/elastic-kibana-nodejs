const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

