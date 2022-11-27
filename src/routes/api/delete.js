const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    const fragment = await Fragment.byId(req.user, id);
    if (!fragment) return res.status(404).json(createErrorResponse(404, 'Id not found'));

    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (e) {
    res.status(500).json(createErrorResponse(500, e.message));
  }
};
