// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
});

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = ['text/plain', 'text/markdown', 'text/html', 'application/json'];

class Fragment {
  constructor({ id, ownerId, type, created, updated, size = 0 }) {
    if (!ownerId || !type) throw new Error('ownerId and/or type missing');
    if (typeof size !== 'number') throw new Error(`Fragment size must be a number (got ${size})`);
    else if (size < 0) throw new Error(`Fragment size must be a positive number (got: ${size})`);
    if (!Fragment.isSupportedType(type)) throw new Error(`Unsupported fragment type: ${type}`);

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (fragment) return fragment;
    throw new Error(`Fragment ${id} not found`);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (data) {
      this.size = data.length;
      await writeFragmentData(this.ownerId, this.id, data);
      return this.save();
    } else throw new Error('Error writing fragment data');
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/') ? true : false;
  }

  get formats() {
    if (this.mimeType === 'text/plain') return ['.txt'];
    if (this.mimeType === 'text/markdown') return ['.md', '.html', '.txt'];
    if (this.mimeType === 'text/html') return ['.html', '.txt'];
    if (this.mimeType === 'application/json') return ['.json', '.txt'];

    return [];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return validTypes.includes(type);
  }

  async convertor(extension) {
    let mimeType, convertedData;
    // ============ convert to TXT ============
    if (this.mimeType === 'text/markdown') {
      if (extension === '.html') {
        const rawData = await this.getData();
        convertedData = md.render(rawData.toString());
        mimeType = 'text/html';
      } else if (extension === '.txt') {
        convertedData = (await this.getData()).toString();
        mimeType = 'text/plain';
      }
    }
    if (this.mimeType === 'text/html') {
      if (extension === '.txt') {
        convertedData = (await this.getData()).toString();
        mimeType = 'text/plain';
      }
    }
    if (this.mimeType === 'text/plain') {
      if (extension === '.txt') {
        convertedData = (await this.getData()).toString();
        mimeType = 'text/plain';
      }
    }
    // // ============ convert to JSON ============
    if (this.mimeType === 'application/json') {
      if (extension === '.txt') {
        convertedData = (await this.getData()).toString();
        mimeType = 'text/plain';
      }
    }
    // use .replace(/(\r?\n)?$/, '') to remove trailing newline
    convertedData = convertedData.replace(/(\r?\n)?$/, '');
    return { convertedData, mimeType };
  }
}

module.exports.Fragment = Fragment;
