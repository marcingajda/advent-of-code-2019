let results = [];

const check = (number) => {
  if(number.length !== 6) {
    return false;
  }

  const pairs = ["00", "11", "22", "33", "44", "55", "66", "77", "88", "99"];

  if(!pairs.some(pair => number.includes(pair))) {
    return false;
  }

  const biggest = number.split('').reduce((previous, current) => {
    return Number(current) >= Number(previous) ? current : Infinity;
  }, 0);

  if (biggest === Infinity) {
    return false;
  }

  return true;
};


for (let i = 165432; i <= 707912; i++) {
  check(i.toString()) ? results.push(i) : null;
}

console.log(results.length);
