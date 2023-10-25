/* require dependencies */
const express = require('express');
const app = express();
var path = require('path');

const data = require('./data.json'); //array of projects

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
        return res.render('project', { project });
    } else {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    }
});

app.get('/projects', (req, res) => {
    res.redirect('/');
});

/* error handling */

//404 error handling: non-existing routes
app.use( (req, res, next) => {
    const error = new Error('404 Error');
    error.message = 'Oops, page not found. Looks like that route does not exist.'
    error.status = 404;
    next(error);
});

//global error handler
app.use( (err, req, res, next) => {

    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    
    if(err.status === 404) {
        err.message = "Oops, page not found."
        err.status = 404;
        console.log('Oops, page not found.')
        res.render('page-not-found');

    } else {
        err.status = 500;
        res.locals.message = "Server Error"
        console.log('Oh! It looks like there was a server error.')
        res.render('error');
    }
    
});

//server running
app.listen(3000, () => {
    console.log("Running the application on localhost:3000 ...");
});

