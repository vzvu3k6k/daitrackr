module.exports = {
  extractAntennaId (str) {
    if (!str) {
      return null
    }
    let antennaId = str
    let match = str.match(
        /^\s*(?:https:\/\/)?daichkr\.hatelabo\.jp\/(?:antenna|collection)\/(\d+)/
    )
    if (match) {
      antennaId = match[1]
    }
    if (/\D/.test(antennaId)) {
      return null
    } else {
      return antennaId
    }
  }
}
