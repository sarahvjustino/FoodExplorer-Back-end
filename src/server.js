const express = require('express');

const database = require("./database/sqlite")
const AppError = require("./utils/AppError");
const routes = require("./routes");
const app = express();

app.use(express.json());

app.use(routes);

database();

app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.log(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
})

const PORT = 4002;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));