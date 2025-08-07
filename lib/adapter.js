const http = require("http")
const defaultcfg = require("./default")
const worklib = require("./ffi-library")
const sessionid = require("./session-id")

function createAdapter(_config) {
  return function (configs = { method: "GET" }) {
    const sessionID = sessionid()
    const payloadRequest = {
      tlsClientIdentifier: configs.tlsClientIdentifier || defaultcfg.default_client_id,
      followRedirects: configs.followRedirects || true,
      insecureSkipVerify: configs.insecureSkipVerify || true,
      withoutCookieJar: true,
      withDefaultCookieJar: false,
      isByteRequest: false,
      catchPanics: false,
      withDebug: false,
      forceHttp1: configs.forceHttp1 || false,
      withRandomTLSExtensionOrder: configs.withRandomTLSExtensionOrder || true,
      timeoutSeconds: configs.timeout / 1000 || 30,
      timeoutMilliseconds: 0,
      sessionId: sessionID,
      isRotatingProxy: false,
      proxyUrl: configs.proxy || "",
      customTlsClient: configs.customTlsClient || undefined,
      certificatePinningHosts: {},
      headers: {
        ...(configs.defaultHeaders || defaultcfg.default_headers),
        ...configs.headers,
      },
      headerOrder: configs.headerOrder || defaultcfg.default_header_order,
      requestUrl: configs.url,
      requestMethod: configs.method?.toUpperCase()||"GET",
      requestBody: configs.data,
    }
    return new Promise(async (resolve, reject) => {
      const resultreq = await worklib.request(JSON.stringify(payloadRequest))
      const datarespon = JSON.parse(resultreq)
      const headers_content = datarespon.headers||{}
      let headers_key = {}
      Object.keys(headers_content).map((keys) => {
        const keyLower = String(keys).toLowerCase()
        if(headers_content[keys].length === 1) {
          headers_key[keyLower] = headers_content[keys][0]
          return;
        }
        headers_key[keyLower] = headers_content[keys]
      })
      const urlResult = encodeURI(datarespon.headers && datarespon.headers.location? datarespon.headers.Location[0]: datarespon.target)
      const dataResult = {
        url: urlResult,
        request: {
          responseURL: urlResult,
        },
        config: configs,
        status: datarespon.status,
        statusText: http.STATUS_CODES[datarespon.status]||"Unknowing",
        headers: headers_key,
        data: datarespon.body,
      }
      if(dataResult.status < 150) {
        reject(new Error(`Network or connection bad! ${datarespon.body}`))
      }
      resolve(dataResult)
    })
  }
}

function SetupRequestFetching(configs = {}) {
  const adapter = createAdapter(configs)
  return {
    request: (config = {}) => adapter(config),
    get: (url = "", config) => adapter({ ...config, url: url }), 
    post: (url = "", data, config) => adapter({ ...config, url: url, data: data, method: "POST" }), 
    put: (url = "", data, config) => adapter({ ...config, url: url, data: data, method: "PUT" }), 
    delete: (url = "", data, config) => adapter({ ...config, url: url, data: data, method: "DELETE" }), 
  }
}

module.exports = {
  createAdapter,
  SetupRequestFetching
}