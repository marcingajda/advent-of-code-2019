let results = [];

const measureGroups = (text) => {
  const groups = text.split('').reduce((info, letter) => {
    if (info.last === letter) {
      info.sizes[info.sizes.length - 1]++;
    } else {
      info.last = letter;
      info.sizes.push(1);
    }

    return info;
  }, {last: '', sizes: []});

  return groups.sizes;
};

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

  const groupsSizes = measureGroups(number);

  if (groupsSizes.every((size) => size !== 2)) {
    return false;
  }

  return true;
};


for (let i = 165432; i <= 707912; i++) {
  check(i.toString()) ? results.push(i) : null;
}

console.log(results.length);
