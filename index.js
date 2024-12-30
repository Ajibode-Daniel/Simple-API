const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path"); // Import the path module

const PORT = 8000;
const app = express();

app.use(express.json());

// Get all products
app.get("/products", (req, res) => {
    const filepath = path.join(__dirname, "products.json");
    fs.readFile(filepath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading products file:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        const products = JSON.parse(data); // Parse JSON
        res.json(products);
        console.log("Returned a list of products");
    });
});

// Post Products
app.post("/add_products", (req, res) => {
    const newProduct = req.body; // Get product from the request body

    // Validate input
    if (!newProduct.name || !newProduct.price) {
        return res.status(400).json({ error: "Product must have a name and price" });
    }

    const filepath = path.join(__dirname, "products.json");

    // Read the current products
    fs.readFile(filepath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading products file:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        const products = JSON.parse(data);

        // Add a Unique ID for the new product
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        newProduct.id = newId;

        // Append the new product
        products.push(newProduct);

        // Write the updated products list to the file
        fs.writeFile(filepath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Error writing to products file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.status(201).json(newProduct); // Newly created product
            console.log("New product added:", newProduct);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
