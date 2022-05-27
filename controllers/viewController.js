exports.getChatHomepage = (req, res, next) => {
    res.status(200).render('messages', {
      title: 'Messages',
    })
}

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: "Log into your account"
    })
}
exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up for new account",
  });
};