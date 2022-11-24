/**
 * Allows the authenticated user to delete one of their existing fragments with the given id.
 */

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id.split('.')[0];
  try {
    const fragment = await Fragment.byId(req.user, id);
    if (!fragment) return res.status(404).json(createErrorResponse(404, 'Id not found'));

    await Fragment.delete(req.user, id);
    // Return a 204 'No Content' response
    res.status(204).json(createSuccessResponse(`Fragment ${id} deleted`));
  } catch (e) {
    res.status(500).json(createErrorResponse(500, e.message));
  }
};
