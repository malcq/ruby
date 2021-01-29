/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
module.exports = postgreSqlEscapeSingleQuotes = string => string.replace(/'/g, "''");
