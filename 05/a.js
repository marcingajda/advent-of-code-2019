const program = [3,225,1,225,6,6,1100,1,238,225,104,0,1101,34,7,225,101,17,169,224,1001,224,-92,224,4,224,1002,223,8,223,1001,224,6,224,1,224,223,223,1102,46,28,225,1102,66,83,225,2,174,143,224,1001,224,-3280,224,4,224,1002,223,8,223,1001,224,2,224,1,224,223,223,1101,19,83,224,101,-102,224,224,4,224,102,8,223,223,101,5,224,224,1,223,224,223,1001,114,17,224,1001,224,-63,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1102,60,46,225,1101,7,44,225,1002,40,64,224,1001,224,-1792,224,4,224,102,8,223,223,101,4,224,224,1,223,224,223,1101,80,27,225,1,118,44,224,101,-127,224,224,4,224,102,8,223,223,101,5,224,224,1,223,224,223,1102,75,82,225,1101,40,41,225,1102,22,61,224,1001,224,-1342,224,4,224,102,8,223,223,1001,224,6,224,1,223,224,223,102,73,14,224,1001,224,-511,224,4,224,1002,223,8,223,101,5,224,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1008,677,677,224,1002,223,2,223,1006,224,329,1001,223,1,223,1007,226,226,224,1002,223,2,223,1005,224,344,101,1,223,223,1008,226,226,224,1002,223,2,223,1006,224,359,101,1,223,223,8,226,677,224,102,2,223,223,1006,224,374,101,1,223,223,1107,677,226,224,1002,223,2,223,1005,224,389,101,1,223,223,1008,677,226,224,102,2,223,223,1006,224,404,1001,223,1,223,1108,677,677,224,102,2,223,223,1005,224,419,1001,223,1,223,1107,677,677,224,102,2,223,223,1006,224,434,1001,223,1,223,1108,226,677,224,1002,223,2,223,1006,224,449,101,1,223,223,8,677,226,224,1002,223,2,223,1005,224,464,101,1,223,223,108,226,677,224,102,2,223,223,1005,224,479,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,494,101,1,223,223,108,677,677,224,1002,223,2,223,1005,224,509,1001,223,1,223,7,677,226,224,1002,223,2,223,1006,224,524,101,1,223,223,1007,677,677,224,1002,223,2,223,1006,224,539,1001,223,1,223,107,226,226,224,102,2,223,223,1006,224,554,101,1,223,223,107,677,677,224,102,2,223,223,1006,224,569,1001,223,1,223,1007,226,677,224,1002,223,2,223,1006,224,584,101,1,223,223,108,226,226,224,102,2,223,223,1006,224,599,1001,223,1,223,7,226,226,224,102,2,223,223,1006,224,614,1001,223,1,223,8,226,226,224,1002,223,2,223,1006,224,629,1001,223,1,223,7,226,677,224,1002,223,2,223,1005,224,644,101,1,223,223,1108,677,226,224,102,2,223,223,1006,224,659,101,1,223,223,107,226,677,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226];

// const { terminal: term } = require('terminal-kit');

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
        return "\t" + value + (index%4 === 3 ? "\n" : '');
      })
      .join('');
  };
}

class Processor {
  constructor(memory) {
    this.memory = memory;
    this.counter = 0;
  }

  moveCounter(increment) {
    this.counter += increment;
  };

  getInstruction() {
    const value = this.memory.read(this.counter).toString().padStart(5, '0');
    const opcode = Number(value.substr(-2));

    const paramsMode = value
      .substring(0, 3)
      .split('')
      .reverse()
      .map(mode => Number(mode));

    return { opcode, paramsMode };
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

  saveInput(paramsMode) {
    const [pointer] = this.getInstructionParams(1);
    this.memory.write(pointer, 1);
    this.moveCounter(2);
  }

  getOutput(paramsMode) {
    const [input] = this.getInstructionParams(1);
    const output = this.resolveParam(input, paramsMode[0]);
    this.moveCounter(2);

    return `OUTPUT: ${output}`;
  }

  halt() {
    return false;
  }

  makeStep() {
    const { opcode, paramsMode } = this.getInstruction();

    if (opcode === 1) {
      return this.sum(paramsMode);
    }
    if (opcode === 2) {
      return this.multiplication(paramsMode);
    }
    if (opcode === 3) {
      return this.saveInput(paramsMode);
    }
    if (opcode === 4) {
      return this.getOutput(paramsMode);
    }
    if (opcode === 99) {
      return this.halt();
    }

    process.exit(0);
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

  run(param1, param2) {
    if (param1 !== undefined) {
      this.memory.write(1, param1);
      this.memory.write(2, param2);
    }

    this.turnOn();

    while(this.isWorking()) {
      const output = this.processor.makeStep();

      if(output === false) {
        this.shutDown();
      } else if (output !== undefined) {
        console.log(output)
      }
    }
  }

  accessMemory(pointer) {
    return this.memory.read(pointer);
  };

  debug() {
    console.log(this.memory.serialize());
  }
}

const computer = new Computer(program);
computer.run();
