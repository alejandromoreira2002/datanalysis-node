const crypto = require('crypto')
const claveSecreta = crypto.randomBytes(32).toString('hex');

module.exports = {
    sessionKey: claveSecreta
}