const _ = require("lodash");
const validUrl = require("valid-url");
const config = require("./config.json");
const moment = require('moment');

const isNumber = (value) => {
  return _.isNumber(value);
};

const isArray = (value) => {
  return Array.isArray(value);
};

const arrayIsNotEmpty = (array) => {
  return array && array.length >= 1;
};

const isPasswordValid = (value) => {
  return value.length >= 8;
};

const isUserTypeValid = (value) => {
  return config.userTypes.includes(value);
};

const isPhoneNumberValid = (value) => {
  let regex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  return regex.test(value);
};

const isValidEmailOrPhone = (value) => {
  return (
    /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value) ||
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  );
};

const isValidEmail = (value) => {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(value);
};

const isValidObjectId = (value) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
};

const isValidDeviceType = (value) => {
  return config.deviceTypes.includes(value);
};

const isValidUrl = (value) => {
  return value ? validUrl.isUri(value) : true;
};

const isValidName = (name) => {
  let regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(name);
};

const isValidE164 = (phone) => {
  return /^\+[1-9]\d{0,2}\d+$/.test(phone)
}

const isValidDOB = (value) => {// checks for YYYY-MM-DD
  return /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$/.test(value)
}

const isValidGender = (value) => {
  return config.genderTypes.includes(value)
}

function validateDate(date) {
  //checks valid DD/MM/YYYY
  const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(date)

}

function validateOffset(offset) {
  //checks valid +HH:MM or -HH:MM
  const offsetRegex = /^[-+]\d{2}:\d{2}$/;
  return offsetRegex.test(offset)

}

function validateMomentTime(inputTime) {
  //validates this format 2024-04-17T09:24:13+05:00
  const parsedTime = moment(inputTime, 'YYYY-MM-DDTHH:mm:ssZ', true); // Using strict parsing mode

  if (!parsedTime.isValid()) {
    return false;
  }

  return true;
}


module.exports = {
  isNumber,
  isArray,
  arrayIsNotEmpty,
  isPasswordValid,
  isUserTypeValid,
  isPhoneNumberValid,
  isValidEmailOrPhone,
  isValidEmail,
  isValidObjectId,
  isValidDeviceType,
  isValidUrl,
  isValidName,
  isValidE164,
  isValidDOB,
  isValidGender,
  validateDate,
  validateOffset,
  validateMomentTime
};
