/* Basic Header based auth which matches credentials from request header to users in database
*/

// users hardcoded for simplicity, stored in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', Name: 'Test' }];

module.exports = async function auth(req, res, next) {

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    var user = users.find(u => u.username === username && u.password === password);
    
    // Delete to Assigning Test User for this assesment, effectively skipping auth check.
    // var user = { id: 1, username: 'test', password: 'test', Name: 'Test' };

    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // User is verified.
    next();
}
