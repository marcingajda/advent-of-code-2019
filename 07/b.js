const program = [3,8,1001,8,10,8,105,1,0,0,21,38,47,72,97,122,203,284,365,446,99999,3,9,1001,9,3,9,1002,9,5,9,1001,9,4,9,4,9,99,3,9,102,3,9,9,4,9,99,3,9,1001,9,2,9,102,5,9,9,101,3,9,9,1002,9,5,9,101,4,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,2,9,9,102,3,9,9,1001,9,2,9,4,9,99,3,9,101,3,9,9,102,2,9,9,1001,9,4,9,1002,9,2,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99];
const testProgram = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26, 27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];
const testProgram2 = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
  -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
  53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

function permute(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = permute(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]])
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

class Memory {
  constructor(initialMemory = []) {
    this.memory = initialMemory;
  }

  read(base, offset = 0) {
    return this.memory[base + offset];
  };

  write(pointer, value) {
    this.memory[pointer] = value;
  };

  readVector(start, length) {
    return this.memory.slice(start, start + length);
  };

  serialize() {
    return this.memory
      .map((cell, index) => {
        const value = cell.toString().padStart(3, '0');
        return "\t" + value + (index % 4 === 3 ? "\n" : '');
      })
      .join('');
  };
}

class Processor {
  constructor(memory) {
    this.memory = memory;
    this.counter = 0;
    this.input = [];
    this.output = null;
  }

  setInput(value) {
    this.input = value;
  }

  takeInput() {
    const input = this.input;
    this.input = undefined;

    return input;
  }

  setOutput(value) {
    this.output = value;
  }

  getOutput() {
    return this.output;
  }

  moveCounter(increment) {
    this.counter += increment;
  };

  setCounter(value) {
    this.counter = value;
  };

  getInstruction() {
    const value = this.memory.read(this.counter).toString().padStart(5, '0');
    const opcode = Number(value.substr(-2));

    const paramsMode = value
      .substring(0, 3)
      .split('')
      .reverse()
      .map(mode => Number(mode));

    return {opcode, paramsMode};
  }

  getInstructionParams(count) {
    return this.memory.readVector(this.counter + 1, count);
  }

  resolveParam(value, mode) {
    return mode === 0 ? this.memory.read(value) : value;
  }

  sum(paramsMode) {
    const [input1, input2, output] = this.getInstructionParams(3);

    const value1 = this.resolveParam(input1, paramsMode[0]);
    const value2 = this.resolveParam(input2, paramsMode[1]);

    this.memory.write(output, value1 + value2);
    this.moveCounter(4);
  }

  multiplication(paramsMode) {
    const [input1, input2, output] = this.getInstructionParams(3);

    const value1 = this.resolveParam(input1, paramsMode[0]);
    const value2 = this.resolveParam(input2, paramsMode[1]);

    this.memory.write(output, value1 * value2);
    this.moveCounter(4);
  }

  writeInputToMemory() {
    const [pointer] = this.getInstructionParams(1);
    const input = this.takeInput();

    if (input === undefined) {
      return { signal: 'PAUSE' };
    } else {
      this.memory.write(pointer, input);
      this.moveCounter(2);
    }
  }

  readOutputFromMemory(paramsMode) {
    const [input] = this.getInstructionParams(1);
    const output = this.resolveParam(input, paramsMode[0]);

    this.setOutput(output);
    this.moveCounter(2);
  }

  jumpIfTrue(paramsMode) {
    const [param1, param2] = this.getInstructionParams(2);
    const condition = this.resolveParam(param1, paramsMode[0]);
    const target = this.resolveParam(param2, paramsMode[1]);

    if (condition !== 0) {
      this.setCounter(target);
    } else {
      this.moveCounter(3);
    }
  }

  jumpIfFalse(paramsMode) {
    const [param1, param2] = this.getInstructionParams(2);
    const condition = this.resolveParam(param1, paramsMode[0]);
    const target = this.resolveParam(param2, paramsMode[1]);

    if (condition === 0) {
      this.setCounter(target);
    } else {
      this.moveCounter(3);
    }
  }

  isLessThan(paramsMode) {
    const [param1, param2, output] = this.getInstructionParams(3);
    const first = this.resolveParam(param1, paramsMode[0]);
    const second = this.resolveParam(param2, paramsMode[1]);

    if (first < second) {
      this.memory.write(output, 1);
    } else {
      this.memory.write(output, 0);
    }

    this.moveCounter(4);
  }

  isEqual(paramsMode) {
    const [param1, param2, output] = this.getInstructionParams(3);

    const first = this.resolveParam(param1, paramsMode[0]);
    const second = this.resolveParam(param2, paramsMode[1]);

    if (first === second) {
      this.memory.write(output, 1);
    } else {
      this.memory.write(output, 0);
    }

    this.moveCounter(4);
  }

  halt() {
    return { signal: 'HALT' };
  }

  makeStep() {
    const {opcode, paramsMode} = this.getInstruction();

    if (opcode === 1) {
      return this.sum(paramsMode);
    }
    if (opcode === 2) {
      return this.multiplication(paramsMode);
    }
    if (opcode === 3) {
      return this.writeInputToMemory(paramsMode);
    }
    if (opcode === 4) {
      return this.readOutputFromMemory(paramsMode);
    }
    if (opcode === 5) {
      return this.jumpIfTrue(paramsMode);
    }
    if (opcode === 6) {
      return this.jumpIfFalse(paramsMode);
    }
    if (opcode === 7) {
      return this.isLessThan(paramsMode);
    }
    if (opcode === 8) {
      return this.isEqual(paramsMode);
    }
    if (opcode === 99) {
      return this.halt();
    }

    return `Undefined opcode ${opcode}`;
  }
}

class Computer {
  constructor(program = []) {
    this.memory = new Memory([...program]);
    this.processor = new Processor(this.memory);
    this.state = 'WORKS';
  }

  setProgram(program) {
    this.memory = new Memory([...program]);
    this.processor = new Processor(this.memory);
  }

  start() {
    this.state = 'WORKS';
  }

  halt() {
    this.state = 'HALTED';
  }

  pause() {
    this.state = 'PAUSED';
  }

  isWorking() {
    return this.state === 'WORKS'
  }

  isPaused() {
    return this.state === 'PAUSED';
  }

  isHalted() {
    return this.state === 'HALTED';
  }

  run(input) {
    this.start();
    this.processor.setInput(input);

    while (this.isWorking()) {
      const result = this.processor.makeStep();

      if (result) {
        if (result.signal === 'HALT') {
          this.halt();
        }

        if (result.signal === 'LOG') {
          console.log(result.output)
        }

        if (result.signal === 'PAUSE') {
          this.pause();
        }
      }
    }

    return this.processor.getOutput();
  }

  accessMemory(pointer) {
    return this.memory.read(pointer);
  };

  debug() {
    console.log(this.memory.serialize());
  }
}

const permutations = permute([5, 6, 7, 8, 9]);
// const permutations = [[9,8,7,6,5]];

const results = permutations.map((phases) => {
  const programTuRun = program;

  const amp1 = new Computer(programTuRun);
  const amp2 = new Computer(programTuRun);
  const amp3 = new Computer(programTuRun);
  const amp4 = new Computer(programTuRun);
  const amp5 = new Computer(programTuRun);

  amp1.run(phases[0]);
  amp2.run(phases[1]);
  amp3.run(phases[2]);
  amp4.run(phases[3]);
  amp5.run(phases[4]);

  const amplifiers = [amp1, amp2, amp3, amp4, amp5];

  let i = 0;
  let output = 0;

  while(true) {
    const amp = amplifiers[i%5];
    output = amp.run(output);
    console.log(output);

    if (amplifiers.every((amp) => amp.isHalted())) {
      return output;
    }

    i = i + 1;
  }
});

// console.log(results);
console.log('-----------');
console.log(results.sort((a, b) => a - b).reverse()[0]);
