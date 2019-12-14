const program = [3,8,1001,8,10,8,105,1,0,0,21,38,47,72,97,122,203,284,365,446,99999,3,9,1001,9,3,9,1002,9,5,9,1001,9,4,9,4,9,99,3,9,102,3,9,9,4,9,99,3,9,1001,9,2,9,102,5,9,9,101,3,9,9,1002,9,5,9,101,4,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,2,9,9,102,3,9,9,1001,9,2,9,4,9,99,3,9,101,3,9,9,102,2,9,9,1001,9,4,9,1002,9,2,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99];

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

  setInputVector(value) {
    this.input = [...value];
  }

  getSingleInput() {
    return this.input.shift();
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

  writeInput() {
    const [pointer] = this.getInstructionParams(1);
    this.memory.write(pointer, this.getSingleInput());
    this.moveCounter(2);
  }

  readOutput(paramsMode) {
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
    return false;
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
      return this.writeInput(paramsMode);
    }
    if (opcode === 4) {
      return this.readOutput(paramsMode);
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
    this.work = true;
  }

  setProgram(program) {
    this.memory = new Memory([...program]);
    this.processor = new Processor(this.memory);
  }

  turnOn() {
    this.work = true;
  }

  shutDown() {
    this.work = false;
  }

  isWorking() {
    return this.work;
  }

  run(input) {
    this.turnOn();
    this.processor.setInputVector(input);

    while (this.isWorking()) {
      const signal = this.processor.makeStep();

      if (signal === false) {
        this.shutDown();
      } else if (signal !== undefined) {
        console.log(signal)
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

const permutations = permute([0, 1, 2, 3, 4]);

const computer = new Computer(program);

const results = permutations.map((order) => {
  return order.reduce((output, phase) => {
    computer.setProgram(program);
    return computer.run([phase, output]);
  }, 0);
});

console.log(results.sort()[results.length - 1]);
