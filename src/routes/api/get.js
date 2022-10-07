const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug('GET request', JSON.stringify(req.query));
  const optExpand = req.query.expand === true;
  try {
    const fragments = await Fragment.byUser(req.user, optExpand);
    res.status(200).json(createSuccessResponse({ data: fragments }));
    logger.debug('Fragment data: ' + JSON.stringify(fragments, null, 2));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error.message));
    logger.error('Fragment not found: ' + error);
  }
};
