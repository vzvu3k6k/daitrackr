let express = require('express')
let crypto = require('crypto')
let pkginfo = require('./package.json')
let scrape = require('./lib/scrape')
let util = require('./lib/util')

let app = express()
app.set('views', './views')
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)

if (app.get('env') === 'development') {
  app.locals.pretty = true
}

let credentials = {
  id: process.env.HATENA_ID,
  password: process.env.HATENA_PASSWORD
}

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/feed', (req, res) => {
  let antennaID = util.extractAntennaID(req.query.antenna)
  if (antennaID === null) {
    return res.sendStatus(400)
  }
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
