// /* tests fir memory.js file */
const appDB = require('../../src/model/data/memory/index');

// // Write a fragment's metadata to memory db. Returns a Promise
// function writeFragment(fragment) {
//   return metadata.put(fragment.ownerId, fragment.id, fragment);
// }

describe('fragment data and metadata calls', () => {
  const emptyFragment = { ownerId: '', id: '', fragment: {} };
  const fragment = { ownerId: '11', id: '7', fragment: 'test' };

  //==
  test('writeFragment() write empty fragment', async () => {
    const result = await appDB.writeFragment(emptyFragment);
    expect(result).toBe(undefined);
  });
  //==

  //==
  test('readFragment() read a fragment that does not exist', async () => {
    const result = await appDB.readFragment(emptyFragment.ownerId, emptyFragment.id);
    expect(result).toBe(emptyFragment);
  });
  //==

  //== written fragment should match the read fragment
  test('readFragment() returns same fragment from writeFragment()', async () => {
    await appDB.writeFragment(fragment);
    const result = await appDB.readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });
  //==

  //==

  //==
});
