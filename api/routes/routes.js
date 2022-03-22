const AuthController = require('../controllers/auth-controller');
const EnvironmentController = require('../controllers/environment-controller');
const jwt = require('jsonwebtoken');
const authController = new AuthController();
const envController = new EnvironmentController();


module.exports = (express) => {
    const router = express.Router();
    router.post('/auth', [], authController.login.bind(authController));
    router.get('/environments/:project', [authController.authMiddleware], envController.list.bind(envController));
    router.post('/environments/:project/:environment', [authController.authMiddleware], envController.set.bind(envController));
    router.get('/environments/:project/:environment', [authController.authMiddleware], envController.get.bind(envController));
    return router;
}