const validator = require('validator');
const bcrypt = require('bcrypt')

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error('First name and last name are required');
    }
    else if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('Password must be strong');
    }
}

const validateProfileUpdateData = (req) => {
    const allowedUpdateFields = ['firstName', 'lastName', 'age', 'about', 'profilePicture', 'skills', "gender"]

    const isAllowed = Object.keys(req.body).every((field) => allowedUpdateFields.includes(field));
    console.log('Profile update fields validation:', isAllowed);
    return isAllowed;
}

const validateUpdatePassword = async (req) => {
    const { currentPassword, newPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(currentPassword, req.user.password);

    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }
    if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
    }
    else if (!validator.isStrongPassword(newPassword)) {
        throw new Error('New password must be strong');
    }

}

module.exports = { validateSignUpData, validateProfileUpdateData, validateUpdatePassword };