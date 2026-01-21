const app = require('./src/app');

// ENV PORT fallback
const PORT = process.env.PORT || 3000;

// Start server safely
const startServer = () => {
  try {
    app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log(`\n Server running on: ${url}\n`);
      console.log(` Click here to open: ${url}\n`);
    });
  } catch (error) {
    console.error(" Server failed to start:", error.message);
  }
};

startServer();


// Catch synchronous errors
process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err.message);
  console.error(err.stack);
});

// Catch async errors
process.on("unhandledRejection", (reason) => {
  console.error(" Unhandled Rejection:", reason);
});
