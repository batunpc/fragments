// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData().then((data) => data.toString());
    const size = data.length;
    const type = fragment.type;
    res
      .set({ 'Content-Type': type, 'Content-Length': size })
      .status(200)
      .json(createSuccessResponse({ data }));

    logger.debug('Fragment data: ' + JSON.stringify(fragment, null, 2));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    logger.error('Fragment not found: ' + err);
  }
};
