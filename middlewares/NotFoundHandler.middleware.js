// Middleware activated were the path didn't exist or wasn't send
const notFoundHandler = (req, res, next) => {
    res.status(404).send("Path not found . Please enter a valid URL");
};

module.exports={
    notFoundHandler
}