let ClientHTTPError = require('@vzvu3k6k/daichkr-client').HTTPError
let apicache = require('apicache')
let crypto = require('crypto')
let express = require('express')
let pug = require('pug')
let redis = require('redis')
let pkginfo = require('./package.json')
let scrape = require('./lib/scrape')
let util = require('./lib/util')

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
  function handleAntennaId (req, res, next) {
    req.antennaId = util.extractAntennaId(req.query.antenna)

    // validate
    if (req.antennaId === null) {
      res.status(400).send('アンテナのURLまたはIDが未対応の形式です。')
      return
    }

    // canonicalize
    let canonicalUrl = `/feed?antenna=${req.antennaId}`
    if (req.url !== canonicalUrl) {
      res.redirect(`${req.baseUrl}${canonicalUrl}`)
      return
    }

    next()
  },
  cache('60 minutes')
]

app.get('/feed', feedMiddlewares, (req, res) => {
  let antennaId = req.antennaId
  scrape(credentials, antennaId).then((antenna) => {
    for (let log of antenna.changelog) {
      let key = [log.timestamp, log.user, log.action, log.url].join()
      log.guid = crypto.createHash('md5').update(key).digest('base64')
    }
    res.header('content-type', 'application/rss+xml')
    res.render('feed', Object.assign(antenna, {
      '_pug': pug,
      url: `https://daichkr.hatelabo.jp/antenna/${antennaId}`,
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
