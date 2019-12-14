const { uniqBy, flatMap, compact } = require('lodash');

const input = `.###..#######..####..##...#
########.#.###...###.#....#
###..#...#######...#..####.
.##.#.....#....##.#.#.....#
###.#######.###..##......#.
#..###..###.##.#.#####....#
#.##..###....#####...##.##.
####.##..#...#####.#..###.#
#..#....####.####.###.#.###
#..#..#....###...#####..#..
##...####.######....#.####.
####.##...###.####..##....#
#.#..#.###.#.##.####..#...#
..##..##....#.#..##..#.#..#
##.##.#..######.#..#..####.
#.....#####.##........#####
###.#.#######..#.#.##..#..#
###...#..#.#..##.##..#####.
.##.#..#...#####.###.##.##.
...#.#.######.#####.#.####.
#..##..###...###.#.#..#.#.#
.#..#.#......#.###...###..#
#.##.#.#..#.#......#..#..##
.##.##.##.#...##.##.##.#..#
#.###.#.#...##..#####.###.#
#.####.#..#.#.##.######.#..
.#.#####.##...#...#.##...#.`;

const list = input.split("\n").join("").split('');
const points = input.split("\n").map((row) => row.split(''));

// A
// ..&##
// ..&##
// --+--
// ..|..
// ..|..

// B
// ..|..
// ..|..
// --+==
// ..|##
// ..|##

// C
// ..|..
// ..|..
// --+--
// ##&..
// ##&..

// D
// ##|..
// ##|..
// ==+--
// ..|..
// ..|..

//   -2 -1  0  1  2
//-2  #  #  |  .  .
//-1  #  #  |  .  .
// 0  =  =  +  -  -
// 1  .  .  |  .  .
// 2  .  .  |  .  .

const getLetter = (x, y) => {
  if (y < 0 && x >= 0) {
    return 'A';
  }
  if (y >= 0 && x > 0) {
    return 'B';
  }
  if (y > 0 && x <= 0) {
    return 'C';
  }
  if (y <= 0 && x < 0) {
    return 'D';
  }
};

const groupFrom = (fromX, fromY) => {
  const groups = points.map((row, pointY) => {
    return row.map((point, pointX) => {
      if(point === '.') {
        return null;
      }

      const x = pointX - fromX;
      const y = pointY - fromY;

      const letter = getLetter(x, y);
      const ratio = y/x;

      return [letter, ratio]
    });
  });

  return uniqBy(compact(flatMap(groups)), ([a, b]) => `${a} ${b}`);
};

const result = points.map((row, y) => {
  return row.map((point, x) => {
    if (point === '.') {
      return null;
    }

    return {x, y, result: groupFrom(x,y).length - 1};
  });
});

const stats = compact(flatMap(result));

console.log(stats.sort((a, b) => a.result - b.result).reverse()[0]);
