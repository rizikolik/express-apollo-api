// Winston will be used for normal logs and Morgan will be used for Htpps logs
const { transports, createLogger } = require("winston");
// Built in module fs for read,create files/folders
const fs = require("fs");
// Built in module Path
// eslint-disable-next-line no-unused-vars
const path = require("path");
// Define the folder for holding log records
const logsDir = "logs";
// Check if there is a folder and create a folder if not
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define an Options for DRY
const options = {
  file: {
    level: "info",
    filename: "logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

export const logger = createLogger({
  transports: [new transports.File(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});

// Combining with Morgan logs cause Morgan just write to Consol.With this Stream,2 logs will be combined
logger.stream = {
  write: function (message: string) {
    logger.info(message);
  },
};
