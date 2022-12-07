const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const API_URL = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  try {
    const existingFragment = await Fragment.byId(req.user, req.params.id);

    // If existingFragment content type is trying to be converted
    // 400 Bad Request
    if (req.get('Content-Type') !== existingFragment.type) {
      logger.error('Bad Request');
      return res.status(400).json(createErrorResponse(400, 'Bad Request'));
    }

    const newFragment = new Fragment({
      ownerId: req.user,
      id: req.params.id,
      created: existingFragment.created,
      type: req.get('Content-Type'),
    });
    await newFragment.save();
    await newFragment.setData(req.body);
    /* 
    
    add a toJSON() method to an object, which returns the Object to serialize, and you can strip things out that you don't want

    */
    newFragment.toJSON = () => {
      return {
        id: newFragment.id,
        created: existingFragment.created,
        updated: newFragment.updated,
        size: newFragment.size,
        type: existingFragment.type,
        // create array
        formats: [newFragment.type],
      };
    };

    res.set('Location', `${API_URL}/v1/fragments/${newFragment.id}`);
    res.status(200).json(createSuccessResponse({ newFragment: newFragment }));
  } catch (err) {
    logger.error({ err }, 'Error getting fragment by id');

    res.status(404).json(createErrorResponse(404, 'Error getting fragment information'));
  }
};
