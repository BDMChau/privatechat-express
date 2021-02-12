
const authMsg = {
    // log out
    signOut_success: 'Logout success!',
    signOut_error: 'Logout failed!',
    userIdExist_error: 'Please log in first!',

    // sign in
    userExist_error: 'Email does not exist!',
    credential_error: 'Missing credentials!',
    matchingPass_error: 'Invalid password, please try again!',
    login_success: 'Login success!',
    login_error: 'Login failed, please try again!',

    // sign up
    emailExist_true: 'Email is already exists!',
    signUpFields_missing: 'Please fill in all fields!',
    signUpMessage_success1: 'Created new account successfully!',
    signUpMessage_success2: 'Now you can login!',

    //  send mail
    mailSent_success: 'A mail is sent, please check your email!',

    // reset password
    resetPass_success: 'Password is updated!',
    resetPass_expired: 'Please try again, your request is expired!'
}

module.exports = authMsg;