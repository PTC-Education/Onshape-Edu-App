const fetch = require('node-fetch');

const WebhookService = require('./services/webhook-service');
const TranslationService = require('./services/translation-service');
const { onshapeApiUrl } = require('./config');
const { forwardRequestToOnshape } = require('./utils');
const redisClient = require('./redis-client');


const apiRouter = require('express').Router();


/**
 * Add Custom Feature to the Feature List 
 */

apiRouter.post('/createAppElement', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/appelements/d/${req.query.documentId}/w/${req.query.workspaceId}`, req, res);
});

/**
 * Get MateValues from Assembly 
 */
apiRouter.get('/getMateValues', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/assemblies/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}/matevalues`, req, res);
});

/**
 * Set MateValues in Assembly 
 */
apiRouter.post('/setMateValues', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/assemblies/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}/matevalues`, req, res);
}); 

/**
 * Get Assembly Definition
 */
 apiRouter.get('/getAssemblyDefinition', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/assemblies/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}`, req, res);
}); 

/**
 * Transform Assembly Occurrences
 */
 apiRouter.post('/transformOccurrences', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/assemblies/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}`, req, res);
}); 

/**
 * Get the Elements of the current document/workspace.
 * 
 * GET /api/elements
 *      -> 200, [ ...elements ]
 *      -or-
 *      -> 500, { error: '...' }
 */
apiRouter.get('/elements', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/documents/d/${req.query.documentId}/w/${req.query.workspaceId}/elements`, req, res);
});

/**
 * Get the Elements of the current document/workspace.
 * 
 * GET /api/elements
 *      -> 200, [ ...elements ]
 *      -or-
 *      -> 500, { error: '...' }
 */
 apiRouter.get('/getElementChangeId', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/appelements/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.storageId}/content/json?transactionId=&changeId=`, req, res);
});


/**
 * Get the Session info from Onshape to get User ID information
 */
apiRouter.get('/users/sessioninfo', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/users/sessioninfo`, req, res);
});


/**
 * Get AppElements from the document 
 */
 apiRouter.get('/getApplicationStorage', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/documents/d/${req.query.documentId}/w/${req.query.workspaceId}/elements?elementType=APPLICATION&withThumbnails=false`, req, res);
});



/**
 * Get all Feature Studio elements from the document 
 */
apiRouter.get('/getFStudio', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/documents/d/${req.query.documentId}/w/${req.query.workspaceId}/elements?elementType=FEATURESTUDIO&withThumbnails=false`, req, res);
});


/**
 * Get the Feature Studio contents from the onshape document
 */

apiRouter.get('/fsContents', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/featurestudios/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.blockly}`, req, res);
});

/**
 * Update the contents of the target Feature Studio
 */

apiRouter.post('/updateFStudio', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/featurestudios/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.blockly}`, req, res);
});

/**
 * Create a new Feature Studio
 */

apiRouter.post('/createFStudio', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/featurestudios/d/${req.query.documentId}/w/${req.query.workspaceId}`, req, res);
});

/**
 * Create a new Feature Studio
 */

 apiRouter.post('/updateAppElement', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/appelements/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.storageId}/content`, req, res);
});

/**
 * Get the Feature Studio Specs
 */


apiRouter.get('/specsFStudio', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/featurestudios/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.blockly}/featurespecs`, req, res);
});

/**
 * Add Custom Feature to the Feature List 
 */

apiRouter.post('/addFeatureToList', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/partstudios/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}/features`, req, res);
});

/**
 * Get the Feature List of the target Part Studio
 */

apiRouter.get('/getFeatureList', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/partstudios/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.query.elementId}/features`, req, res);
});


/**
 * Get the Parts of the given Element in the current document/workspace.
 * 
 * GET /api/elements/:eid/parts
 *      -> 200, [ ...parts ]
 *      -or-
 *      -> 500, { error: '...' }
 */
apiRouter.get('/elements/:eid/parts', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/parts/d/${req.query.documentId}/w/${req.query.workspaceId}/e/${req.params.eid}`, req, res);
});


/**
 * Get the Parts of the current document/workspace.
 * 
 * GET /api/parts
 *      -> 200, [ ...parts ]
 *      -or-
 *      -> 500, { error: '...' }
 */
apiRouter.get('/parts', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/parts/d/${req.query.documentId}/w/${req.query.workspaceId}`, req, res);
});

/**
 * Receive a webhook event.
 * 
 * POST /api/event
 *      -> 200
 */
apiRouter.post('/event', (req, res) => {
    if (req.body.event === 'onshape.model.translation.complete') {
        // Save in Redis so we can return to client later (& unregister the webhook).
        redisClient.set(req.body.translationId, req.body.webhookId);
    }
    res.status(200).send();
});

module.exports = apiRouter;
