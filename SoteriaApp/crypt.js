var sjcl = require('./sjcl.js')

// UUID generating function
function uuidv4() {
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
   return v.toString(16);
 });
}

// Generate a new pub/sec key pair, only called once
function KeyPair(){
    var pair = sjcl.ecc.elGamal.generateKeys(sjcl.ecc.curves.k256)
    this.pair = pair;
    this.uuid = uuidv4();
    this.userDict = [];
}


// Encrypt and send message using receivers pub key
KeyPair.prototype.EncryptMsg = function(msg, pub){
    var encMsg = sjcl.encrypt(pub, msg);

    return encMsg;
}

// Decrypt and return message using senders sec key
KeyPair.prototype.DecryptMsg = function(encMsg){
    var msg = sjcl.decrypt(this.pair.sec,msg)

    return msg;
}

// Sign a msg using senders private key
KeyPair.prototype.SignMsg = function(msg){
    var sigMsg = this.pair.sec.sign(sjcl.hash.sha256.hash(msg));

    return sigMsg;
}

// Verify a msg using receivers pub key
KeyPair.prototype.VerifyMsg = function(msg){
    var verMsg = pub.verify(sjcl.hash.sha256.hash(msg), sig)

    return verMsg;
}

// Add a user address + alias
KeyPair.prototype.AddUser = function(pub, alias){
    var user = {alias: pub};
    this.userDict.push(user);
}

// Send a message to a receivers pub key
KeyPair.prototype.SendMsg = function(msg, pub){
    sigMsg = KeyPair.SignMsg(msg);
    encMsg = KeyPair.EncryptMsg(msg, pub)

    return encMsg;
}

// SERIALIZATION //

// Serialize public key
KeyPair.prototype.SerializePublicKey = function(){
  var pub = this.pair.pub.get();
  return sjcl.codec.base64.fromBits(pub.x.concat(pub.y));
}

// Unserialized public key
KeyPair.prototype.UnserializePublicKey = function(pub){
  return new sjcl.ecc.elGamal.publicKey(
    sjcl.ecc.curves.k256,
    sjcl.codec.base64.toBits(pub)
)
}

// Serialize public key
KeyPair.prototype.SerializeSecretKey = function(){
  var sec = this.pair.sec.get();
  return sjcl.codec.base64.fromBits(sec)
}

// Unserialized public key
KeyPair.prototype.UnserializeSecretKey = function(sec){
  return new sjcl.ecc.elGamal.secretKey(
    sjcl.ecc.curves.k256,
    sjcl.ecc.curves.k256.field.fromBits(sjcl.codec.base64.toBits(sec))
)
}

module.exports = KeyPair;
