const fs = require("fs");
const path = require("path");

const folders = [
  "src/config",
  "src/models",
  "src/modules/auth",
  "src/modules/products",
  "src/modules/variants",
  "src/modules/media",
  "src/middlewares",
  "src/utils",
  "src/constants",
  "src/seeders",
  "src/migrations"
];

const files = {
  "src/app.js": "",
  "server.js": "",

  "src/config/db.js": "",
  "src/config/jwt.js": "",

  "src/modules/auth/auth.controller.js": "",
  "src/modules/auth/auth.service.js": "",
  "src/modules/auth/auth.routes.js": "",

  "src/modules/products/product.controller.js": "",
  "src/modules/products/product.service.js": "",
  "src/modules/products/product.routes.js": "",

  "src/middlewares/auth.middleware.js": "",
  "src/middlewares/error.middleware.js": "",

  "src/utils/helpers.js": "",
  "src/utils/logger.js": "",
  "src/utils/response.js": "",

  "src/constants/messages.js": "",
  "src/constants/roles.js": "",

  "src/models/index.js": ""
};

folders.forEach((folder) => {
  fs.mkdirSync(folder, { recursive: true });
});

for (const file in files) {
  fs.writeFileSync(file, files[file]);
}

console.log("🚀 Folder structure generated successfully!");
