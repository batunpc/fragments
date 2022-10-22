const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug('get-id-info : ', req.user, req.params.id);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    !fragment
      ? res.status(404).json(createErrorResponse(404, 'Fragment not found'))
      : res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error({ err }, 'Error getting fragment by id');
    res.status(500).json(createErrorResponse(500, 'Error getting fragment information'));
  }
};
