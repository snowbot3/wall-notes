const jsonServer = require('json-server');
const livereload = require('livereload');
const lrserver = livereload.createServer();
const path = require('path');
const source = path.join(__dirname, 'public');
lrserver.watch(source);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
 
server.use(middlewares);
server.use('/api', router);
server.listen(3000, () => {
	console.log('JSON Server is running')
});
