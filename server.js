require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const errorHandler = require("./utilities/errorHandler");
const inventoryRoutes = require("./routes/inventoryRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/inventory", inventoryRoutes);

// 404 Error Handling for invalid routes (must be last route)
app.use((req, res) => {
    res.status(404).render("errors/404", { title: "404 - Not Found" });
});

// Error handler middleware for 500 errors
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
