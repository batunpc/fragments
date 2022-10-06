// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragment = await Fragment.byUser(req.user);
  if (!fragment) {
    return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
  res.status(200).json(createSuccessResponse({ fragment }));
  logger.debug('Fragment data: ' + JSON.stringify(fragment, null, 2));
};
