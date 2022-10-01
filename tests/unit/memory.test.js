// /* tests fir memory.js file */
const appDB = require('../../src/model/data/memory/index');

describe('fragment data and metadata calls', () => {
  const emptyFragment = { ownerId: '', id: '', fragment: {} };
  const fragment = { ownerId: '11', id: '77', fragment: 'test' }; // fragments metadata

  //== metadata
  test('writeFragment() returns nothing', async () => {
    const result = await appDB.writeFragment(emptyFragment);
    expect(result).toBe(undefined);
  });
  //==

  //== metadata
  test('readFragment() returns same fragment from writeFragment()', async () => {
    await appDB.writeFragment(fragment);
    const result = await appDB.readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });
  //==

  //== write Buffer - works with binary
  test('writeFragmentData() returns nothing if buffer is empty', async () => {
    const result = await appDB.writeFragmentData(fragment.ownerId, fragment.id, Buffer.from(''));
    expect(result).toBe(undefined);
  });
  //==

  //== read Buffer - works with binary
  test('readFragmentData() returns what writeFragmentData()', async () => {
    const buffer = Buffer.from('binary file', 'utf8');
    await appDB.writeFragmentData(fragment.ownerId, fragment.id, buffer);
    const result = await appDB.readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(buffer);
  });
  //==

  //==
  test('listFragments() always return empty array, even if empty', async () => {
    const results = await appDB.listFragments('not eleven', false);
    expect(results).toEqual([]);
  });
  //==
});
