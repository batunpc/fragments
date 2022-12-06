const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const API_URL = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    // If fragment content type is trying to be converted
    // 400 Bad Request
    if (req.get('Content-Type') !== fragment.type) {
      logger.error('Bad Request');
      return res.status(400).json(createErrorResponse(400, 'Bad Request'));
    }
    fragment.setData(req.body); // set the new data to the fragment
    res.set('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error({ err }, 'Error getting fragment by id');

    res.status(404).json(createErrorResponse(404, 'Error getting fragment information'));
  }
};
