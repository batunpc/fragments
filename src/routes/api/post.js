const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug('Data: ' + req.body);

  if (!Buffer.isBuffer(req.body)) {
    logger.debug('Unsupported Content-Type');
    return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
  }
  if (!process.env.API_URL) throw new Error('missing env var: API URL');

  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(req.body);
    res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    logger.debug(`'Location', ${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));

    logger.debug('New fragment data: ' + JSON.stringify(fragment, null, 2));
  } catch (error) {
    logger.debug('Fragment cannot be created due to ' + error);
    return res.status(500).json(createErrorResponse(500, error.message));
  }
};
