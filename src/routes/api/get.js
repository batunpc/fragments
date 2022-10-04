// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragment = await Fragment.byUser(req.user);
  if (fragment) {
    res.status(200).json(createSuccessResponse({ fragment }));
    logger.debug('Fragment data: ' + JSON.stringify(fragment, null, 2));
  } else {
    res.status(500).json(createErrorResponse('Internal server error'));
    logger.warn('Fragment cannot be created - Internal server error');
  }
};
