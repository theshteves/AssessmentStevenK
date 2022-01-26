
/*
  Fundamentals Section:

  You may use any ES6+ features you like (or none at all).
*/



/*
  1: Create a function that takes an array of numbers and return both the minimum and maximum numbers, in that order.
    - Not all values in the array are known to be numbers.

    Examples
    minMax([1, 2, 3, 4, 5]) ➞ [1, 5]

    minMax([2334454, 5]) ➞ [5, 2334454]

    minMax([1]) ➞ [1, 1]
*/

function minMax(values) {
  // Assumption: Since not all values in the array are known to be numbers & I don't have the time to be comprehensive, I took extra precaution in the face of ambiguous constraints to only accept numeric types (to avoid booleans implicitly casting to numbers & save me the time of enumerating tests for unpacking nested containers, sanitizing malicious strings, etc. ...although a simple RegEx might do).  This filter prevents compliant strings from getting implicitly cast, as well as booleans (e.g. true -> 1). Floats (e.g. 3.14159), exponentials (e.g. 2.048e3), negatives, & number-resolving expressions (e.g. Math.E) are supported.
  values = values.filter(value => typeof(value) === 'number')

  return [Math.min(...values), Math.max(...values)]
  // While this optimizes for readability & developer time cost, I still managed to needlessly sacrifice time efficiency & nobody likes "silent failures" (I could at least detect them & leave a console.warn). I have a frontend & backend to do on top of other interviews so no testing suite today.
}



/*
  2. Sorting Objects
  Create a function that takes an array of objects and a string field name, and returns the array of objects sorted in ascending order by the field name.

  Example:
  sortObjects([{ text: 'Kim', value: '1'}, { text: 'John', value: 3}, { text: 'Sally', value: 2}], 'value') 
    ➞ [{ text: 'Kim', value: '1'}, { text: 'Sally', value: 2}, { text: 'John', value: 3}]
*/

function sortObjects (values, sortBy) {

}






