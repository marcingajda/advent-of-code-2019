const {range, intersectionBy, last} = require('lodash');

const wire1 = "R995,D933,L284,U580,R453,U355,L352,U363,L506,D130,R300,D112,L751,U245,R174,U901,L586,D70,L348,U307,R596,D401,R311,D328,L612,D214,L161,U488,L813,U298,L299,D807,L791,D813,R946,U958,R258,D972,L72,U698,L170,D131,L552,D14,L760,U812,L203,D92,R483,U698,R800,U345,L947,D206,L991,D447,R832,D52,L134,D946,R108,D477,L818,D101,R784,U409,R23,U359,R981,D458,R786,U445,R874,U244,R381,U206,R86,U279,L787,U683,R52,U740,R210,U162,L748,U747,R283,D964,R782,D386,R205,D898,R774,U421,R908,D280,L567,D667,L302,D795,L822,D908,L160,U279,L58,D914,R828,U621,R338,U982,R471,U724,L509,U444,R377,D473,R307,U331,L529,U855,L474,U725,L905,U409,L881,U702,R162,D717,R498,U458,R119,U744,R2,D82,R337,D988,L235,U831,L373,D122,L310,D107,R685,U864,L356,U213,R246,U373,L809,U593,R582,U488,R847,U792,L182,U219,L232,D695,R183,U164,L730,D660,L581,D931,R36,D291,R614,U408,R928,D93,L685,D879,R37,D113,L563,D340,L212,D907,L557,D522,L610,D927,R11,U556,R571,U668,L834,U603,L407,U966,R245,D408,R822,U163,L265,D230,L144,D786,R479,U208,L781,D787,L146,U476,R561,U70,R879,U562,R805,D897,L44,U709,L773,U747,L806,U140,R953,D628,L752,D666,R916,D351,R175,D504,R232,U463,R415,U492,L252,D30,L574,U100,L333,U313,R403,D68,L976,D702,L205,D992,L552,U55,R216,U548,L894,U764,L919,U475,R656,U712,L754,U638,R33,U709,R643,U299,R151,U762,R767,D542,R581,D752,L701,D589,L312,U189,R922,D915,R975,U26,R244,U48,L971,U755,R889,D726,R126,U978,L275,D435,L732,D982,L654,D704,L98,U153,L983,U770,L429,U530,L545,D44,L36,U456,R442,D58,L321,U473,R657,U307,R314";
const wire2 = "L999,U880,L754,D995,R105,U651,R762,U451,R612,U424,L216,D210,L946,U57,R685,U185,R234,D768,L927,U592,R545,U770,R456,D118,R22,U371,L721,D937,R144,U173,R337,D17,L948,U720,R617,D588,L57,U258,L979,U232,L473,D451,L829,D85,L985,D333,L492,D749,L972,U188,R214,D108,R247,U379,L218,D490,R451,U582,R674,D881,R725,U404,L916,U137,R745,D969,L206,D480,R634,U672,R897,D184,L768,D766,L529,U317,L909,D74,R529,D31,R483,D906,R961,D535,L937,D751,L564,U478,L439,U556,R385,D590,L518,D991,L232,D358,L962,U242,R856,U66,L847,U146,R196,U515,L892,U18,L535,U343,R430,U77,L967,U956,L64,D510,L29,D305,L954,U186,R624,D693,R354,D243,L145,D622,R456,U904,L233,D940,L82,D83,L726,D993,L338,D793,R340,D823,R147,D595,R296,D388,L106,D362,R114,U808,L496,U614,L809,U911,R480,D29,L802,U900,R920,U952,R237,D383,L480,U362,L761,U949,L920,D82,L511,U365,R657,U465,L256,U124,L810,U43,L668,U146,L847,D245,R937,D778,L995,D316,R423,U515,L626,D788,R453,U98,R886,U821,R749,D365,R915,U980,R322,D114,L556,D921,L551,D397,R232,D485,L842,D455,R940,U913,L196,D239,L221,D200,R438,U71,L979,U527,L86,U959,R768,D557,R553,D709,L838,U191,L916,D703,L687,U34,R463,D809,L3,U335,L231,D212,L674,U177,L51,D557,L939,U390,L28,U53,L653,D182,R329,D449,L563,D476,R258,D299,L142,U847,L38,U322,R294,U320,R314,D257,R622,U59,R501,D677,L880,U589,R599,D245,L851,U369,R262,D63,R722,D253,L546,U578,R909,U678,L63,U256,L237,U798,R465,D420,R797,D452,R548,U875,R523,D527,L467,U49,R726,D840,R882,U97,L398,D621,R38,U952,R196,D597,R627,D721,L441,D710,L18,D679,R218";

// const wire1 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
// const wire2 = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

// const wire1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
// const wire2 = "U62,R66,U55,R34,D71,R55,D58,R83";

// const wire1 = "R8,U5,L5,D3";
// const wire2 = "U7,R6,D4,L4";

//###########################################################################################

const history = [];

const addPath = (wireId, x, y) => {
  if (!history[wireId]) {
    history[wireId] = [];
  }

  const distance = Math.abs(x) + Math.abs(y);
  const currentLength = history[wireId].length ? last(history[wireId]).currentLength : 0;

  history[wireId].push({x, y, distance, currentLength: currentLength + 1});
};

const stepByStep = (x, y, horizontal, vertical, wireId) => {
  if (horizontal !== 0 && vertical !== 0) {
    throw new Error('nope');
  }

  const finalX = x + horizontal;
  const finalY = y + vertical;

  range(finalX, x).reverse().forEach((position) => addPath(wireId, position, y));
  range(finalY, y).reverse().forEach((position) => addPath(wireId, x, position));

  return {x: finalX, y: finalY}
};

const navigate = ({x, y}, part, wireId) => {
  const direction = part[0];
  const length = Number(part.substr(1));

  if (direction === 'L') {
    return stepByStep(x, y, -length, 0, wireId);
  }

  if (direction === 'R') {
    return stepByStep(x, y, length, 0, wireId);
  }

  if (direction === 'U') {
    return stepByStep(x, y, 0, length, wireId);
  }

  if (direction === 'D') {
    return stepByStep(x, y, 0, -length, wireId);
  }
};

const generateWire = (wire, wireId) => {
  // addPath(wireId, 0, 0);
  wire.split(',').reduce((currentPosition, part) => {
    return navigate(currentPosition, part, wireId);
  }, {x: 0, y: 0});
};

//###########################################################################################

[wire1, wire2].forEach(generateWire);

const crossings = intersectionBy(history[0], history[1], (item) => {
  return `${item.x} ${item.y}`
});

const sums = crossings.map(({x, y}) => {
  const onWire1 = history[0].find(item => x === item.x && y === item.y);
  const onWire2 = history[1].find(item => x === item.x && y === item.y);

  return {x, y, sum: onWire1.currentLength + onWire2.currentLength};
});

const sorted = sums.sort((a, b) => a.sum - b.sum);

console.log(sorted);
console.log(sorted[0].sum);
