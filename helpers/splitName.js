
/**
 * @description This function splits fullname into first and last names
 * @param {object} fullName Full name string to be split
 * @returns {object} An object of the split names
 */
const splitName = (fullName) => {
  const splitNames = fullName.split(' ', 2);
  const splitNamesObject = { firstname: splitNames[0], lastname: splitNames[1] };
  return splitNamesObject;
};

export default splitName;
