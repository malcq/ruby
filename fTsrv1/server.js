const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const routes = require('./routes/index');

const app = express();
const { port } = config;
const devMode = ['development', 'stage'];

const swaggerDocument = require('./swagger.json');

const { calendarGenerator } = require('./utils/calendar/calendarGenerator');
const cronWorker = require('./utils/cronJobs/index.js');

app.set('jwtsecret', config.secret);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.secret));

const swaggerUiOptions = {
  customJs: '/utils/swagger.js',
  swaggerOptions: {
    docExpansion: 'none',
  },
};

if (!process.env.NODE_ENV || devMode.includes(process.env.NODE_ENV)) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerUiOptions)
  );
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.siteAddress);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token, Authorization'
  );
  return next();
});

app.use((req, res, next) => {
  if (config.enableRequestLogging) {
    console.log(`\x1b[35m[${req.method}] ${req.originalUrl}`);
  }
  return next();
});

routes(app);

const server = app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
  cronWorker();
  calendarGenerator.initCalendar();
});

const io = socket(server, { pingTimeout: 60000 });
require('./sockets/route')(io);
