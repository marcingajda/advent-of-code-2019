const memory = [1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,5,19,23,2,6,23,27,1,27,5,31,2,9,31,35,1,5,35,39,2,6,39,43,2,6,43,47,1,5,47,51,2,9,51,55,1,5,55,59,1,10,59,63,1,63,6,67,1,9,67,71,1,71,6,75,1,75,13,79,2,79,13,83,2,9,83,87,1,87,5,91,1,9,91,95,2,10,95,99,1,5,99,103,1,103,9,107,1,13,107,111,2,111,10,115,1,115,5,119,2,13,119,123,1,9,123,127,1,5,127,131,2,131,6,135,1,135,5,139,1,139,6,143,1,143,6,147,1,2,147,151,1,151,5,0,99,2,14,0,0];

let counter = 0;
let work = true;

const getCommand = (pointer) => {
  return {
    opcode: memory[pointer],
    input1: memory[pointer+1],
    input2: memory[pointer+2],
    output: memory[pointer+3],
  };
};

const read = (pointer) => {
  return memory[pointer];
};

const write = (pointer, value) => {
  memory[pointer] = value;
};

while (work) {
  const { code, input1, input2, output } = getCommand(counter);

  switch(code) {
    case 1:
      const sum = read(input1) + read(input2);
      write(output, sum);
      break;
    case 2:
      const product = read(input1) * read(input2);
      write(output, product);
      break;
    case 99:
      work = false;
      break;
    default:
      throw new Error(`Unknown code ${code}`);
  }

  counter = counter + 4;
}

const display = memory.map((cell, index) => {
  const value = cell.toString().padStart(3, '0');
  return "\t" + value + (index%4 === 3 ? "\n" : '');
});

console.log(display.join(''));

