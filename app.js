const express = require('express');
const path = require('node:path');
const app = express();
const User = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    
    res.render('index'); // Render the index.ejs template
});

app.get('/read', async (req, res) => {
    try {
        let users = await User.find({});
        res.render('read', { users });
    } catch (err) {
        res.send("Error fetching users");
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('update', { user });
    } catch (err) {
        res.send("Error fetching user");
    }
});

app.post('/update/:id', async (req, res) => {
    const { name, email, image } = req.body;

    if (!name || !email) {
        return res.send("Name and Email are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.send("Invalid email format");
    }

    try {
        await User.findByIdAndUpdate(req.params.id, {
            name,
            email,
            image
        });

        res.redirect('/read');
    } catch (err) {
        res.send("Error updating user");
    }
});

app.post('/create', async (req, res) => {
    const { name, email, image } = req.body;

    // 🔹 Required fields
    if (!name || !email) {
        return res.send("Name and Email are required");
    }

    // 🔹 Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.send("Invalid email format");
    }

    // 🔹 Image URL (optional)
    if (image && !image.startsWith("http")) {
        return res.send("Image must be a valid URL");
    }

    try {
        await User.create({ name, email, image });
        res.redirect('/read');
    } catch (err) {
        res.send("Error creating user");
    }
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.redirect('/read');
    } catch (err) {
        res.send("Error deleting user");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});