import test from 'blue-tape'
import testStore, { memstore } from 'abstract-tus-store'
import keyedStore from '../src'

let store
const setup = async () => {
  store = keyedStore(memstore(), 'some super secret!')
  return store
}


testStore({ setup })

test('decodeKey', async (t) => {
  const { uploadId } = await store.create('some-random-key')
  const key = store.decodeKey(uploadId)
  t.equal(key, 'some-random-key')
})
