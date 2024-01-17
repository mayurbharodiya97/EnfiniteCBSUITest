const { addDays } = require("date-fns");
var add = require("date-fns/add");
var format = require("date-fns/format");

// console.log({a:1, b:2}.hasOwnProperty("c"))

// console.log("asdqwdqwdq", [1,2,3].filter(el => el == 1))
// console.log("asdqwdqwdq", format(add(new Date(), {hours: 1000}), "dd/MM/yyyy"))

// const a={ab:1, bc:2, cd:3}

// b=a
// b = {...a, ab:11}

// console.log(a,b)
// console.log(Object.keys({PERSONAL_TAB: {}}))
// console.log("asdasdasd",["prefix","nm", "abcdivider", "abcDivider"].map(el => {
//     // if(el == 1) return el
//     if(el.includes("divider") || el.includes("Divider")) {

//     } else return el
// }))

// let a = [1,2,3]
// let b = a.map(el => {
//     if(el>2) return el
// })
// console.log(a, b)
// a= [1,2,3]
// a.filter(el => el>2)
// console.log(a)

// a = [10,2,3,5]
// a.filter(el => el<5)
// console.log(a)

console.log(
  format(addDays(new Date(), 99), "dd-MMM-yy")
);
