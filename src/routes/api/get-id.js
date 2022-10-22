const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const fragmentData = await fragment.getData();

    res.header('Content-Type', fragment.type);
    res.status(200).send(fragmentData);
    logger.info(
      createSuccessResponse({
        fragmentData: fragmentData,
        contentType: fragment.type,
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error getting fragment by id');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
