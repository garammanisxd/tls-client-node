function SessionID() {
  const chip = "abcdef1234567890"
  let tx = ""
  for(let a of Array.from({ length: 16 })) {
    tx += chip[Math.floor(Math.random() * chip.length)]
  }
  return tx
}

module.exports = SessionID