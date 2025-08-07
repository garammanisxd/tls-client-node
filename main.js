const adapt = require("./lib/adapter")
const axios = require("axios")

function createTLSClient(config) {
  let adapter = adapt.createAdapter(config)
  return axios.create({
    adapter: adapter,
    ...config,
  })
}

module.exports = {
  ...adapt,
  createTLSClient,
}