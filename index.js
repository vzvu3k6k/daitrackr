let ClientHTTPError = require('@vzvu3k6k/daichkr-client').HTTPError
let apicache = require('apicache')
let express = require('express')
let redis = require('redis')
let crypto = require('crypto')
let pkginfo = require('./package.json')
let scrape = require('./lib/scrape')
let util = require('./lib/util')
let pug = require('pug')

let app = express()
app.set('views', './views')
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)

let cache
if (app.get('env') === 'development') {
  cache = apicache.middleware
  app.locals.pretty = true
} else {
  cache = apicache
    .options({
      redisClient: redis.createClient(process.env.REDIS_URL)
    })
    .middleware
}

let credentials = {
  id: process.env.HATENA_ID,
  password: process.env.HATENA_PASSWORD
}

app.get('/', (req, res) => {
  res.render('index', { github: pkginfo.homepage })
})

let feedMiddlewares = [
  function handleAntennaID (req, res, next) {
    req.antennaID = util.extractAntennaID(req.query.antenna)

    // validate
    if (req.antennaID === null) {
      res.status(400).send('アンテナのURLまたはIDが未対応の形式です。')
      return
    }

    // canonicalize
    let canonicalUrl = `/feed?antenna=${req.antennaID}`
    if (req.url !== canonicalUrl) {
      res.redirect(`${req.baseUrl}${canonicalUrl}`)
      return
    }

    next()
  },
  cache('60 minutes')
]

app.get('/feed', feedMiddlewares, (req, res) => {
  let antennaID = req.antennaID
  scrape(credentials, antennaID).then((antenna) => {
    for (let log of antenna.changelog) {
      let key = [log.timestamp, log.user, log.action, log.url].join()
      log.guid = crypto.createHash('md5').update(key).digest('base64')
    }
    res.header('content-type', 'application/rss+xml')
    res.render('feed', Object.assign(antenna, {
      '_pug': pug,
      url: `https://daichkr.hatelabo.jp/antenna/${antennaID}`,
      generator: `${pkginfo.name}/${pkginfo.version}`,
      buildDate: new Date()
    }))
  }).catch((err) => {
    if (err instanceof ClientHTTPError && err.statusCode === 404) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(500)
    console.log(err)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`)
})
