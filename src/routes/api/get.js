// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byUser(req.user);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    logger.warn('Fragment cannot be created due to ' + error);
    return res.status(500).json(createErrorResponse(500, error.message));
  }
};
