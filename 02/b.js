const initialMemory = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,5,19,23,2,6,23,27,1,27,5,31,2,9,31,35,1,5,35,39,2,6,39,43,2,6,43,47,1,5,47,51,2,9,51,55,1,5,55,59,1,10,59,63,1,63,6,67,1,9,67,71,1,71,6,75,1,75,13,79,2,79,13,83,2,9,83,87,1,87,5,91,1,9,91,95,2,10,95,99,1,5,99,103,1,103,9,107,1,13,107,111,2,111,10,115,1,115,5,119,2,13,119,123,1,9,123,127,1,5,127,131,2,131,6,135,1,135,5,139,1,139,6,143,1,143,6,147,1,2,147,151,1,151,5,0,99,2,14,0,0];

let memory = initialMemory;
let counter = 0;
let work = true;

const extractParams = (instructionPointer, paramsNumber) => {
  return memory.slice(instructionPointer + 1, instructionPointer + 1 + paramsNumber);
};

const read = (pointer) => {
  return memory[pointer];
};

const write = (pointer, value) => {
  memory[pointer] = value;
};

const reset = () => {
  work = true;
  counter = 0;
  memory = [...initialMemory];
};

const moveCounter = (increment) => {
  counter = counter + increment;
};

const formatMemory = () => {
  return memory
    .map((cell, index) => {
      const value = cell.toString().padStart(3, '0');
      return "\t" + value + (index%4 === 3 ? "\n" : '');
    })
    .join('');
};

const sumInstruction = (pointer) => {
  const params = extractParams(pointer, 3);
  const sum = read(params[0]) + read(params[1]);
  write(params[2], sum);
  moveCounter(4);
};

const multiInstruction = (pointer) => {
  const params = extractParams(pointer, 3);
  const product = read(params[0]) * read(params[1]);
  write(params[2], product);
  moveCounter(4);
};

const compute = (input1, input2) => {
  reset();

  if (input1 !== undefined) {
    write(1, input1);
  }

  if (input2 !== undefined) {
    write(2, input2);
  }

  while (work) {
    const opcode = read(counter);
    switch(opcode) {
      case 1:
        sumInstruction(counter);
        break;
      case 2:
        multiInstruction(counter);
        break;
      case 99:
        work = false;
        break;
      default:
        throw new Error(`Unknown opcode ${opcode}`);
    }
  }
};

for(let j = 0; j < 100; j++) {
  for(let k = 0; k < 100; k++) {
    compute(j, k);
    if(memory[0] === 19690720) {
      console.log(100 * j + k);
    }
  }
}

// console.log(formatMemory());
