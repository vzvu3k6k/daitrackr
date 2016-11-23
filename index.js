let cacheManager = require('cache-manager')
let express = require('express')
let crypto = require('crypto')
let pkginfo = require('./package.json')
let responseCache = require('./lib/response_cache')
let scrape = require('./lib/scrape')
let util = require('./lib/util')

let app = express()
app.set('views', './views')
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)

let cacheStore
if (app.get('env') === 'development') {
  cacheStore = cacheManager.caching({
    store: 'memory'
  })
  app.locals.pretty = true
} else {
  cacheStore = cacheManager.caching({
    store: require('cache-manager-redis'),
    url: process.env.REDIS_URL
  })
}

let cache = responseCache.bind(
  null,
  cacheStore,
  3600 // 1時間
)

let credentials = {
  id: process.env.HATENA_ID,
  password: process.env.HATENA_PASSWORD
}

app.get('/', (req, res) => {
  res.render('index')
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
  cache((req) => req.query.antenna)
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
      url: `https://daichkr.hatelabo.jp/antenna/${antennaID}`,
      generator: `${pkginfo.name}/${pkginfo.version}`,
      buildDate: new Date()
    }))
  }).catch((err) => {
    console.log(err)
    res.sendStatus(500)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`)
})
