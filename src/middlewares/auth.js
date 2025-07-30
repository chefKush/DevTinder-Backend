const adminAuth = (req, res, next) => {
    const token = 'abc'
    const isValidToken = token === 'abc';
    if (!isValidToken) {
        res.status(401).send('Unauthorized Access');
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = 'abcdddddd'
    const isValidToken = token === 'abc';
    if (!isValidToken) {
        res.status(401).send('Unauthorized Access');
    } else {
        next();
    }
}

module.exports = {adminAuth , userAuth};