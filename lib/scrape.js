let DaichkrClient = require('@vzvu3k6k/daichkr-client')

let client = null
function login (credentials) {
  if (client) {
    return Promise.resolve(client)
  }
  client = new DaichkrClient()
  return client.loginWithHatenaId(credentials.id, credentials.password)
    .then(() => client)
}

module.exports = function scrape (credentials, antennaId) {
  return login(credentials).then((client) => {
    return client.get(`https://daichkr.hatelabo.jp/antenna/${antennaId}/edit`)
  })
    .then(([_, $]) => {
      return {
        name: $('.article-header-group .antenna-title').text().trim(),
        description: $('.article-header-group .description').text().trim(),
        changelog: $('ul.antenna-edit-history > li').map((_, elem) => {
          let li = $(elem)
          let urlWrapper = li.get(0).lastChild
          return {
            timestamp: new Date(li.get(0).firstChild.data.trim()),
            user: li.find('img[src$="profile.gif"]').attr('title'),
            action: urlWrapper.name === 'del' ? 'del' : 'add',
            url: urlWrapper.firstChild.data.trim()
          }
        }).get()
      }
    })
}
