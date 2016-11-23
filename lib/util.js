module.exports = {
  extractAntennaID (str) {
    if (!str) {
      return null
    }
    let antennaID = str
    let match = str.match(
        /^\s*(?:https:\/\/)?daichkr\.hatelabo\.jp\/(?:antenna|collection)\/(\d+)/
    )
    if (match) {
      antennaID = match[1]
    }
    if (/\D/.test(antennaID)) {
      return null
    } else {
      return antennaID
    }
  }
}
