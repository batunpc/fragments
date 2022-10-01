// /* tests fir memory.js file */
const appDB = require('../../src/model/data/memory/index');

describe('fragment data and metadata calls', () => {
  const emptyFragment = { ownerId: '', id: '', fragment: {} };
  const metadata_u1 = { ownerId: '1', id: '2', fragment: 'f1' }; // fragments metadata
  const metadata_u2 = { ownerId: '1', id: '5', fragment: 'f2' };

  //== metadata
  test('writeFragment() returns nothing', async () => {
    const result = await appDB.writeFragment(emptyFragment);
    expect(result).toBe(undefined);
  });
  //==

  //== metadata
  test('readFragment() returns same fragment from writeFragment()', async () => {
    await appDB.writeFragment(metadata_u1);
    const result = await appDB.readFragment(metadata_u1.ownerId, metadata_u1.id);
    expect(result).toEqual(metadata_u1);
  });
  //==

  //== write Buffer - works with binary
  test('writeFragmentData() returns nothing if buffer is empty', async () => {
    const result = await appDB.writeFragmentData(
      metadata_u1.ownerId,
      metadata_u1.id,
      Buffer.from('')
    );
    expect(result).toBe(undefined);
  });
  //==

  //== read Buffer - works with binary
  test('readFragmentData() returns what writeFragmentData() does', async () => {
    //binary data
    await appDB.writeFragmentData(metadata_u1.ownerId, metadata_u1.id, Buffer.from('filetxt'));
    const binaryResults = await appDB.readFragmentData(metadata_u1.ownerId, metadata_u1.id);
    expect(binaryResults).toEqual(Buffer.from('filetxt')); // check if binary data is correct for filetxt
  });
  //==

  //==
  test('listFragments() always return array, even if empty', async () => {
    const results = await appDB.listFragments('not eleven', false);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual([]);
  });
  //==

  test('listFragments() map fragments to get ids only', async () => {
    //metadata
    await appDB.writeFragment(metadata_u1);
    await appDB.writeFragment(metadata_u2);
    const metaResults = await appDB.listFragments('1', false); // return the entire object
    expect(metaResults).toEqual([metadata_u1.id, metadata_u2.id]); // check objects metadata
  });
  //==

  //==
  test('listFragments() returns accurate binary data if ownerId is accurate', async () => {
    const fragments = await appDB.listFragments('1', true);
    expect(fragments).toEqual([
      { ownerId: '1', id: metadata_u1.id, fragment: 'f1' },
      { ownerId: '1', id: metadata_u2.id, fragment: 'f2' },
    ]);
  });
  //==
});
