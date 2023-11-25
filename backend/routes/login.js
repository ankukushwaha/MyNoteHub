


app.get("/login", (req,res) => {
    const {username, email, password} = req.body;
    // User.find(username)
    console.log(req.body._id);
    // const hashedPassword = bcrypt.hashSync(password, 10);

})