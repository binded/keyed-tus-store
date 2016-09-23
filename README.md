# keyed-tus-store

[![Build Status](https://travis-ci.org/blockai/keyed-tus-store.svg?branch=master)](https://travis-ci.org/blockai/keyed-tus-store)

[![tus-store-compatible](https://github.com/blockai/abstract-tus-store/raw/master/badge.png)](https://github.com/blockai/abstract-tus-store)

Higher level [tus store](https://github.com/blockai/abstract-tus-store).

Takes a tus store and returns a new tus store which behaves mostly the
except that it transforms upload IDs returned by `create(key)` so that
the transformed upload ID also encodes the `key` argument.

Other functions are wrapped so that the original upload ID is decoded
before being passed.

An additional `decodeKey(uploadId)` function is exposed which returns
the key associated with an upload ID.

The idea behind this store was to make it easier to retrieve a key given
an upload ID without requiring additional state.

## Install

```bash
npm install --save keyed-tus-store
```

Requires Node v6+

## Usage

See [./test](./test) directory for usage examples.

**keyedStore(storeToWrap, secret)**

Where `storeToWrap` is a tus store and `secret` is a secret passphrase
used to encrypt and decrypt the upload IDs.

Returns a tus store.

**decodeKey(uploadId)**

Returns the `key` encoded in `uploadId`.

```javascript
import keyedStore from 'keyed-tus-store'
import { memstore } from 'abstract-tus-store'

const store = keyedStore(memstore(), 'some secret')

store.create('some-key').then(({ uploadId }) => {
  const key = store.decodeKey(uploadId)
  key === 'some-key' // => true
})
```