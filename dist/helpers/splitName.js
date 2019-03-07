'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @description This function splits fullname into first and last names
 * @param {*} fullName Full name string to be split
 * @returns {object} An object of the split names
 */

function splitName(fullName) {
  var names = fullName.name;
  var splitNames = names.split(' ', 2);
  var splitNamesObject = { firstname: splitNames[0], lastname: splitNames[1] };
  return splitNamesObject;
}

exports.default = splitName;