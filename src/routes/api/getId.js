const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  logger.debug(`GET request for fragment ${req.params.id}`);
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    res.status(200).json(createSuccessResponse({ data: data.toString() }));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error.message));
    logger.error('Fragment not found: ' + error);
  }
};
