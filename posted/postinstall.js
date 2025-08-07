const os = require("os")
const fs = require("fs")
const path = require("path")
const axios = require("axios")

// Change same to https://github.com/bogdanfinn/tls-client/releases
const version_tls_lib = "v1.11.0"
const folder_lib = path.join(__dirname, "..", "./ext_lib")
const sys_arch = os.arch()
const sys_platform = os.platform()
let archdist = ""
let extlib   = ""
let typefile = ""

if(sys_platform === "win32") {
  typefile = "windows"
  extlib = "dll"
  archdist = sys_arch.includes("64")? "64":"32"
} else if(sys_platform === "darwin") {
  typefile = "darwin"
  extlib = "dylib"
  archdist = sys_arch === "arm64"? sys_arch:"amd64"
} else if(sys_platform === "linux") {
  typefile = "linux"
  extlib = "so"
  try {
    const readDetail = fs.readFileSync("/etc/os-release", "utf-8")
    let detail = {}
    String(readDetail).split("\n").forEach(a => {
      const tx = a.split("=")
      detail[tx[0].trim().toLowerCase()] = tx[1].trim()
    })
    if(detail?.id?.toLowerCase()?.includes("ubuntu")) {
      archdist = "ubuntu-amd64"
    } else if(detail?.id?.toLowerCase()?.includes("alpine")) {
      archdist = "alpine-amd64"
    } else {
      archdist = "ubuntu-amd64"
      // archdist = sys_arch == "arm64"? sys_arch:"armv7"
    }
  } catch(e) {
    archdist = "ubuntu-amd64"
    // archdist = sys_arch == "arm64"? sys_arch:"armv7"
  }
} else if(sys_platform === "android") {
  typefile = "linux"
  extlib = "so"
  archdist = arch == "arm64"? arch:"armv7"
} else {
  console.warn("[WARNING]: This os not recommend to install this!")
  typefile = "linux"
  extlib = "so"
  archdist = "arm64"
}

let fileName = `tls-client-${typefile}-${archdist}-${version_tls_lib.slice(1)}.${extlib}`
const downloadFile = `https://github.com/bogdanfinn/tls-client/releases/download/${version_tls_lib}/${fileName}`
const libraryPath = path.join(folder_lib, fileName)

async function IfNotSyncDownloadFileLib() {
  console.log("[Lib TLS]: Folder library: "+libraryPath)
  if(!fs.existsSync(folder_lib) || !fs.lstatSync(folder_lib).isDirectory()) {
    fs.mkdirSync(folder_lib, { recursive: true }) // Create Folder
  }
  // Success And Ready
  if(fs.existsSync(libraryPath) && fs.lstatSync(libraryPath).isFile()) {
    console.log("[Lib TLS]: Ready!")
    return;
  }
  // Unready
  console.log("[Lib TLS]: Downloading...")
  const datafile = await axios.get(downloadFile, { responseType: "arraybuffer" })
  fs.writeFileSync(libraryPath, datafile.data)
  console.log("[Lib TLS]: Success!")
}

if(!!process.argv.find(a => !!a.match("postinstall.js"))) {
  console.log("[Lib TLS]: Execute...")
  IfNotSyncDownloadFileLib()
}

module.exports = {
  fileName,
  libraryPath,
  downloadFile
}