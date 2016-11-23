module.exports = function responseCache (store, ttl, keyFunc) {
  return function innerResponseCache (req, res, next) {
    let key = `response_cache_${keyFunc(req)}`
    store.get(key, (err, cache) => {
      if (err) {
        next(err)
        return
      }

      if (cache) {
        res.send(cache)
        return
      }

      let _send = res.send
      res.send = function wrappedSend (...args) {
        store.set(key, args[0], { ttl }, (err) => {
          if (err) {
            console.log(err)
          }
        })
        _send.apply(this, args)
      }
      next()
    })
  }
}
