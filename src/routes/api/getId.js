// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);
  const data = await fragment.getData();
  res.status(200).json(createSuccessResponse({ data }));

  logger.debug('Fragment data: ' + JSON.stringify(fragment, null, 2));
};
