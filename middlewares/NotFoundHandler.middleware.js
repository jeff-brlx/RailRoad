const notFoundHandler = (req, res, next) => {
    res.status(404).send("Path not found . Please enter a valid URL");
};

module.exports={
    notFoundHandler
}