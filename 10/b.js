const { uniqBy, flatMap, compact, groupBy } = require('lodash');

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

const station = [17, 23];

const points = input.split("\n").map((row) => row.split(''));

//   -2 -1  0  1  2
//-2  #  #  |  .  .
//-1  #  #  |  .  .
// 0  =  =  +  -  -
// 1  .  .  |  .  .
// 2  .  .  |  .  .

const gitInfo = (fromX, fromY) => {
  const results = points.map((row, pointY) => {
    return row.map((point, pointX) => {
      if(point === '.') {
        return null;
      }

      if(fromX === pointX && fromY === pointY) {
        return null;
      }

      const x = pointX - fromX;
      const y = pointY - fromY;

      const rad = Math.atan2(y, x);
      const angle = (rad + Math.PI/2) * (180 / Math.PI);
      const fixedAngle = angle < 0 ? 360 + angle : angle;
      const distance = Math.sqrt(Math.pow(x,2) + Math.pow(y, 2));

      return {distance, angle: fixedAngle, destroyed: false, absolute: {pointX, pointY}, relative: {x, y}}
    });
  });

  const cleaned = compact(flatMap(results));
  return {
    grouped: groupBy(cleaned, (item) => item.angle),
    count: cleaned.length,
  };
};

const info = gitInfo(station[0], station[1]);

const angles = Object.keys(info.grouped).sort((a, b) => a - b);

const destroyed = [];

for(let i = 0; i < info.count; i++) {
  const angle = angles[i%angles.length];
  const group = info.grouped[angle];
  const existing = group.filter(asteroid => asteroid.destroyed === false);

  if(existing.length === 0) {
    continue;
  }

  const closest = existing.sort((a, b) => a.distance - b.distance)[0];

  closest.destroyed = true;
  destroyed.push(closest);
}


const the200 = destroyed[199];

console.log(the200);
console.log(the200.absolute.pointX * 100 + the200.absolute.pointY);


