const AuthController = require('../controllers/auth-controller');
const EnvironmentController = require('../controllers/environment-controller');

const authController = new AuthController();
const envController = new EnvironmentController();

module.exports = (express) => {
    const router = express.Router();
    router.post('/auth', [], authController.login.bind(authController));
    router.post('/environments', [], envController.set.bind(envController));
    router.get('/environments/:project', [], envController.list.bind(envController));
    router.get('/environments/:project/:environment', [], envController.get.bind(envController));
    return router;
}