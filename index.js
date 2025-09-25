/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const log = require("./logger/log.js");

const rootDir = __dirname;
const configDevPath = path.join(rootDir, "config.dev.json");
const configPath = path.join(rootDir, "config.json");

/**
 * If config.dev.json is missing but config.json exists,
 * copy config.json -> config.dev.json so other parts that require
 * config.dev.json won't crash (this fixes Render's "Invalid JSON file /config.dev.json" error).
 *
 * This is a non-destructive fallback: it only copies when config.dev.json does NOT exist.
 */
function ensureConfigDev() {
  try {
    if (!fs.existsSync(configDevPath)) {
      if (fs.existsSync(configPath)) {
        fs.copyFileSync(configPath, configDevPath);
        log.info("config.dev.json not found — copied config.json to config.dev.json");
      } else {
        log.warn("Neither config.dev.json nor config.json exist. Please add one of them.");
      }
    } else {
      // Optional: validate JSON parseability of config.dev.json
      try {
        const raw = fs.readFileSync(configDevPath, "utf8");
        JSON.parse(raw);
      } catch (err) {
        log.error("config.dev.json exists but contains invalid JSON. Please fix the file.");
      }
    }
  } catch (err) {
    log.error("Error while ensuring config.dev.json: " + err.message);
  }
}

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code == 2) {
      log.info("Restarting Project...");
      startProject();
    }
  });
}

/* Ensure config.dev.json exists (or copy from config.json) before starting */
ensureConfigDev();
startProject();

startProject();
