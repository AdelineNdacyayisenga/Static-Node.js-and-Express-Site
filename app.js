/* require dependencies */
const express = require('express');
const app = express();
var path = require('path');

const data = require('./data.json'); //array of projects

//Q: the optionally step 6

/* set up middleware */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static('public')); //serve the static files in the public folder

/* set routes */

app.get('/', (req, res) => { //home
    res.locals.projects = data.projects;
    res.render('index');
});

app.get('/about', (req, res) => { 
    res.render('about');
});

app.get('/projects/:id', (req, res, next) => {
    const projectId = req.params.id;
    const projects = data.projects;
    const project = projects.find( ({ id }) => id === +projectId );

    if (project) {
        //pass data to the project template
        res.render('project', { project });
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

/* error handling */

//catch the 404 error to handle non-existent routes
app.use( (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = 'Oops, page not found. Looks like that route does not exist.'
    next(err);
});

//global error handler
app.use( (err, req, res, next) => {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
});

//server running
app.listen(3000, () => {
    console.log("Running the application on localhost:3000 ...");
});

