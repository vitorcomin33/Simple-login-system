const express = require ("express");
const cors = require ("cors");
const bcrypt = require("bcryptjs");
const db = require("./database");


const app = express();
const PORT = 3001;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// Test if API is working 
app.get("/api/health", (req, res) => {

    res.json({
        status: "ok",
        message: "API funcionando!"
    });
});

// Add an user

app.post("/api/auth/register", async (req, res) =>  {

    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: "Prencha nome, e-mail e senha."
            });
        }   

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName || normalizedName.length > 100) {
            return res.status(400).json({
                error: "O nome deve ter entr 1 e 100 caracteres."
            });
        }

        if(
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            return res.status(400).json({
                error: "Digite um e-mail válido."
            });
        }

        if (password.length < 8 || password.length > 72 ) {
            return res.status(400).json({
                error: "A senha deve ter entre 8 e 72 caracteres."
            });
        }

        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                error: "Este e-mail já está cadastrado"
            });
        } 

        const passwordHash = await bcrypt.hash(password, 12);

        const result = db.prepare(`
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        `).run(normalizedName, normalizedEmail, passwordHash);

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            user: {
                id: result.lastInsertRowid,
                name: normalizedName,
                email: normalizedEmail
            }
        });
    } catch (error) {
        if (
            error.code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
            return res.status(409).json({
                error: "Este e-mail já está cadastrado."
            });
        }

        console.error("Erro ao cadastrar usuário:", error);

        return res.status(500).json({
            error: "Erro interno ao cadastrar usuário."
        });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);

        if (!user) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        return res.json({
            message: "Login realizado com sucesso!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro interno ao fazer login." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});