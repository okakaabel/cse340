require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const errorHandler = require("./utilities/errorHandler");
const inventoryRoutes = require("./routes/inventoryRoutes");
const errorRoutes = require("./routes/errorRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/inventory", inventoryRoutes);
app.use("/error", errorRoutes);
app.use((req, res) => res.status(404).render("errors/404", { title: "404 - Not Found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
