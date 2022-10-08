const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('Data: ' + req.body);

  if (!Buffer.isBuffer(req.body)) {
    logger.warn('Unsupported Content-Type');
    return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
  }

  // if API URL does not exist throw error
  if (process.env.API_URL === undefined) {
    logger.error('API_URL not set');
    return res.status(500).json(createErrorResponse(500, 'API_URL not set'));
  }
  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(req.body);
    logger.info('Fragment saved' + fragment);
    res.set('Content-Type', fragment.type);
    res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (error) {
    logger.error(error);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
