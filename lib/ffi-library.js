const { load, open } = require("ffi-rs")
const { libraryPath } = require("../posted/postinstall")

open({
  library: "tls-client",
  path: libraryPath
})

const workLibrary = {
  request: (payload = "") => {
    const rs_lib = load({
      library: "tls-client",
      funcName: "request",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload],
      runInNewThread: true
    })
    return rs_lib
  },
  getCookiesFromSession: (payload = "") => {
    const rs_lib = load({
      library: "tls-client",
      funcName: "getCookiesFromSession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload]
    })
    return rs_lib
  },
  addCookiesToSession: (payload = "") => {
    const rs_lib = load({
      library: "tls-client",
      funcName: "addCookiesToSession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload]
    })
    return rs_lib
  },
  destroyAll: () => {
    const rs_lib = load({
      library: "tls-client",
      funcName: "destroyAll",
      retType: 0,
      paramsType: [],
      paramsValue: []
    })
    return rs_lib
  },
  destroySession: (payload = "") => {
    const rs_lib = load({
      library: "tls-client",
      funcName: "destroySession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload]
    })
    return rs_lib
  },
}

module.exports = workLibrary