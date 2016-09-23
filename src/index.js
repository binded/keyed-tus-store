// Wraps a tus-store
//
// Upload id will be modified to encode the key they are tied to
// Exposes a decodeKey(uploadId) method
//

// TODO: use a var length binary encoding instead of JSON to compact!
import { createCipher, createDecipher } from 'crypto'

export default (wrappedStore, secret) => {
  if (!secret) throw new Error('you must provide a secret to encrypt/decrypt upload ids')

  const encrypt = (str) => {
    const cipher = createCipher('aes192', secret)
    return cipher.update(str, 'utf8', 'base64') + cipher.final('base64')
  }
  const decrypt = (str) => {
    const decipher = createDecipher('aes192', secret)
    return decipher.update(str, 'base64', 'utf8') + decipher.final('utf8')
  }

  const encode = ({ uploadId, key }) => {
    const plain = JSON.stringify({ u: uploadId, k: key })
    return encodeURIComponent(encrypt(plain))
  }

  const decode = (encryptedStr) => {
    const plain = decrypt(decodeURIComponent(encryptedStr))
    const result = JSON.parse(plain)
    return { uploadId: result.u, key: result.k }
  }

  return {
    ...wrappedStore, // TODO: do this in a way that will not mess up "this"
    // TODO: support all the optional interfaces
    create: async (key, ...args) => {
      const { uploadId, ...rest } = await wrappedStore.create(key, ...args)
      return { uploadId: encode({ uploadId, key }), ...rest }
    },
    info: async (uploadId, ...args) => (
      wrappedStore.info(decode(uploadId).uploadId, ...args)
    ),
    append: async (uploadId, ...args) => (
      wrappedStore.append(decode(uploadId).uploadId, ...args)
    ),
    decodeKey: (encodedUploadId) => {
      const { key } = decode(encodedUploadId)
      return key
    },
  }
}
