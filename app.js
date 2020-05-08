 const express = require('express')
 const session = require('express-session')
 const MongoStore = require('connect-mongo')(session)
 const flash = require('connect-flash')
 const app = express()
 const router = require('./router')
 const markdown = require('marked')
 const sanitizeHTML = require('sanitize-html')
 const favicon = require('express-favicon')




let sessionOptions = session({
    secret:"messiah",
    store:new MongoStore({client: require('./db')}),
    resave:false,
    saveUninitialized: false,
    cookie:{maxAge: 1000*60*60*24, httpOnly: true}
})


app.use(sessionOptions)
app.use(flash())

app.use(function(req, res, next) {
    // markdown stuff

    res.locals.filterUserHTML = function (content) {
      return sanitizeHTML(markdown(content),{allowedTags: ['p','br','ul','ol','li','strong','bold','i','em','h1','h2','h3','h4','h5','h6'], allowedAttributes: {}} )
    }
  //flash messages for all
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    // make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}
    
    // make user session data available for views
    res.locals.user = req.session.user
    next()
  })

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.use('/',router)
 
app.set('views', 'views')
app.set('view engine', 'ejs')
module.exports = app

//app.listen(3000)