// @ts-check
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

// Root of the monorepo (3 levels up from scripts/)
const monorepoRoot = path.resolve(__dirname, "../../../");
const appsDir = path.join(monorepoRoot, "apps");
const swSource = path.resolve(__dirname, "../src/sw-template.js");

if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir);

  apps.forEach((app) => {
    const appPath = path.join(appsDir, app);
    const publicDir = path.join(appPath, "public");

    if (fs.existsSync(publicDir)) {
      console.log(`Copying service worker to ${app}/public...`);
      fs.copyFileSync(
        swSource,
        path.join(publicDir, "firebase-messaging-sw.js")
      );
    }
  });
} else {
  console.log(
    "No apps directory found. Make sure this matches your monorepo structure."
  );
}
