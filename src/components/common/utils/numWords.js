//Copied from num-words library and modified to support 10 digits

const a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
const b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const regex = /^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;

const getLT20 = (n) => a[Number(n)];
const getGT20 = (n) => b[n[0]] + " " + a[n[1]];

export function numWords(input) {
  const num = Number(input);
  if (isNaN(num)) return "";
  if (num === 0) return "zero";

  const numStr = num.toString();
  if (numStr.length > 10) {
    throw new Error("overflow"); // Does not support converting more than 9 digits yet
  }

  const [, n0, n1, n2, n3, n4, n5] = ("0000000000" + numStr)
    .substr(-10)
    .match(regex); // left pad zeros

  let str = "";
  /* eslint-disable eqeqeq */
  str += n0 != 0 ? getLT20(n0) + "hundred " : "";
  str += n1 != 0 && str != "" ? "and " : "";
  str +=
    n1 != 0 ? (getLT20(n1) || getGT20(n1)) + "crore " : n0 != 0 ? "crore " : "";
  str += n2 != 0 ? (getLT20(n2) || getGT20(n2)) + "lakh " : "";
  str += n3 != 0 ? (getLT20(n3) || getGT20(n3)) + "thousand " : "";
  str += n4 != 0 ? getLT20(n4) + "hundred " : "";
  str += n5 != 0 && str != "" ? "and " : "";
  str += n5 != 0 ? getLT20(n5) || getGT20(n5) : "";

  return str.trim();
}
