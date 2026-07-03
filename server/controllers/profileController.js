exports.getProfile = async (req, res) => {

    try {

        const user = req.user;

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};