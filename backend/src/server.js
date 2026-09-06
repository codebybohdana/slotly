const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const healthRoutes = require("./routes/health.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
