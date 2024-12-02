// export const BACKEND_API_URL =
//   process.env.REACT_APP_ENV === "development"
//     ? process.env.REACT_APP_API_ENDPOINT || "https://sqa-api.anitra.co.in"
//     : process.env.REACT_APP_API_ENDPOINT || "https://api.anitra.co.in";
  
  // "http://localhost:3001"

// export const BACKEND_API_URL = "https://sqa-api.anitra.co.in";

export const BACKEND_API_URL = "https://api.anitra.co.in"

// console.log("BACKEND_API_URL", BACKEND_API_URL, process.env.REACT_APP_ENV);

export const URLS = {
  STUDENT_URL: "student",
  CORPORATE_URL: "corporate",
};

export const GENDER_DATA = [
  {
    id: "male",
    name: "Male",
  },
  {
    id: "female",
    name: "Female",
  },
];

export const OFFER_TYPE_DATA = [
  {
    id: "online",
    name: "Online",
  },
  {
    id: "offline",
    name: "Offline",
  },
];

export const IMAGE_MIME_TYPES = [
  "image/bmp",
  "image/jpeg",
  "image/x-png",
  "image/png",
  "image/gif",
];

export const NATIONALITY = [
  {
    id: "india",
    name: "India",
  },
  {
    id: "other",
    name: "Other",
  },
];

export const GENDER = [
  {
    id: "male",
    name: "Male",
  },
  {
    id: "female",
    name: "Female",
  },
  {
    id: "other",
    name: "Other",
  },
];

export const USER_ROLES = [
  {
    name: "Farmer",
    value: "FARMER",
  },
  {
    name: "Ace",
    value: "ACE",
  },
  {
    name: "Trader",
    value: "TRADER",
  },
];
export const MITHUN_USER_ROLES = [
  {
    name: "Farmer",
    value: "FARMER",
  },
  {
    name: "ADC",
    value: "ADC",
  },
];

export const PHONE_REG_EXP =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const PINCODE_REG_EXP = /^[1-9][0-9]{5}$/;
export const AADHAR_REG_EXP = /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/gm;

export const BUY_STATUS = [
  {
    name: "Closed",
    value: "CLOSED",
  },
  {
    name: "Open",
    value: "OPEN",
  },
];

export const ANIMAL_ACTIVITY_STATUS = [
  { name: "UPLOADED", value: "UPLOADED" },
  { name: "REGISTERED", value: "REGISTERED" },
  { name: "VACCINATED", value: "VACCINATED" },
  { name: "NOT_VACCINATED", value: "NOT_VACCINATED" },
  { name: "VERIFIED", value: "VERIFIED" },
  { name: "UPLOADED", value: "UPLOADED" },
  { name: "UPDATED", value: "UPDATED" },
  { name: "FAILED", value: "FAILED" },
  { name: "SUCCESS", value: "SUCCESS" },
  { name: "TREATED", value: "TREATED" },
  { name: "CONTRACTED", value: "CONTRACTED" },
];

export function Capitalize(str) {
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export const calvings = [
  { name: "0", value: "0" },
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
];
