class Memory {
  constructor(initialMemory = []) {
    this.memory = initialMemory;
  }

  read(base, offset = 0) {
    return this.memory[base + offset] ? this.memory[base + offset] : 0;
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
    this.base = 0;
  }

  adjustBase(value) {
    this.base += value;
  }

  getBase() {
    return this.base;
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

  getValue(pointer, mode) {
    if (mode === 0) {
      return this.memory.read(pointer);
    } else if (mode === 1) {
      return pointer;
    } else if (mode === 2) {
      return this.memory.read(this.getBase(), pointer);
    }
  }

  writeMemory(pointer, value, mode) {
    if (mode === 0) {
      return this.memory.write(pointer, value);
    } else if (mode === 1) {
      throw new Error('Immediate write!');
    } else if (mode === 2) {
      return this.memory.write(this.getBase() + pointer, value);
    }
  }

  sum(paramsMode) {
    const [input1, input2, output] = this.getInstructionParams(3);

    const value1 = this.getValue(input1, paramsMode[0]);
    const value2 = this.getValue(input2, paramsMode[1]);

    this.writeMemory(output, value1 + value2, paramsMode[2]);
    this.moveCounter(4);
  }

  multiplication(paramsMode) {
    const [input1, input2, output] = this.getInstructionParams(3);

    const value1 = this.getValue(input1, paramsMode[0]);
    const value2 = this.getValue(input2, paramsMode[1]);

    this.writeMemory(output, value1 * value2, paramsMode[2]);
    this.moveCounter(4);
  }

  writeInputToMemory(paramsMode) {
    const [pointer] = this.getInstructionParams(1);

    const input = this.takeInput();

    if (input === undefined) {
      return { signal: 'INPUT' };
    } else {
      this.writeMemory(pointer, input, paramsMode[0]);
      this.moveCounter(2);
    }
  }

  readOutputFromMemory(paramsMode) {
    const [input] = this.getInstructionParams(1);
    const output = this.getValue(input, paramsMode[0]);

    this.setOutput(output);
    this.moveCounter(2);

    return { signal: 'OUTPUT' };
  }

  jumpIfTrue(paramsMode) {
    const [param1, param2] = this.getInstructionParams(2);
    const condition = this.getValue(param1, paramsMode[0]);
    const target = this.getValue(param2, paramsMode[1]);

    if (condition !== 0) {
      this.setCounter(target);
    } else {
      this.moveCounter(3);
    }
  }

  jumpIfFalse(paramsMode) {
    const [param1, param2] = this.getInstructionParams(2);
    const condition = this.getValue(param1, paramsMode[0]);
    const target = this.getValue(param2, paramsMode[1]);

    if (condition === 0) {
      this.setCounter(target);
    } else {
      this.moveCounter(3);
    }
  }

  isLessThan(paramsMode) {
    const [param1, param2, output] = this.getInstructionParams(3);
    const first = this.getValue(param1, paramsMode[0]);
    const second = this.getValue(param2, paramsMode[1]);

    if (first < second) {
      this.writeMemory(output, 1, paramsMode[2]);
    } else {
      this.writeMemory(output, 0, paramsMode[2]);
    }

    this.moveCounter(4);
  }

  isEqual(paramsMode) {
    const [param1, param2, output] = this.getInstructionParams(3);

    const first = this.getValue(param1, paramsMode[0]);
    const second = this.getValue(param2, paramsMode[1]);

    if (first === second) {
      this.writeMemory(output, 1, paramsMode[2]);
    } else {
      this.writeMemory(output, 0, paramsMode[2]);
    }

    this.moveCounter(4);
  }

  changeMemoryBase(paramsMode) {
    const [param1] = this.getInstructionParams(1);
    const value = this.getValue(param1, paramsMode[0]);

    this.adjustBase(value);
    this.moveCounter(2);
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
    if (opcode === 9) {
      return this.changeMemoryBase(paramsMode);
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

        if (result.signal === 'OUTPUT') {
          this.pause();
          return this.processor.getOutput();
        }

        if (result.signal === 'INPUT') {
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

const program = [1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,0,3,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1102,252,1,1023,1102,36,1,1008,1102,24,1,1017,1101,25,0,1013,1102,479,1,1026,1101,0,259,1022,1102,1,38,1001,1102,1,713,1024,1101,0,708,1025,1102,1,22,1006,1101,0,32,1010,1101,476,0,1027,1102,1,516,1029,1102,1,34,1009,1101,0,23,1016,1102,1,37,1011,1102,525,1,1028,1101,0,35,1004,1102,31,1,1002,1102,39,1,1019,1102,28,1,1015,1102,1,1,1021,1101,0,30,1007,1101,0,27,1014,1101,21,0,1018,1101,0,29,1005,1102,26,1,1000,1102,1,0,1020,1101,0,20,1012,1101,33,0,1003,109,13,21108,40,40,6,1005,1019,199,4,187,1106,0,203,1001,64,1,64,1002,64,2,64,109,15,1205,-7,221,4,209,1001,64,1,64,1105,1,221,1002,64,2,64,109,-25,1208,-3,26,63,1005,63,243,4,227,1001,64,1,64,1106,0,243,1002,64,2,64,109,25,2105,1,-5,1001,64,1,64,1106,0,261,4,249,1002,64,2,64,109,-4,21108,41,42,-8,1005,1016,281,1001,64,1,64,1106,0,283,4,267,1002,64,2,64,109,-6,1206,2,301,4,289,1001,64,1,64,1105,1,301,1002,64,2,64,109,-4,21102,42,1,2,1008,1016,42,63,1005,63,323,4,307,1106,0,327,1001,64,1,64,1002,64,2,64,109,-7,2108,35,1,63,1005,63,343,1105,1,349,4,333,1001,64,1,64,1002,64,2,64,109,-13,1208,7,35,63,1005,63,369,1001,64,1,64,1106,0,371,4,355,1002,64,2,64,109,24,21102,43,1,-1,1008,1017,42,63,1005,63,391,1105,1,397,4,377,1001,64,1,64,1002,64,2,64,109,-13,2101,0,-4,63,1008,63,38,63,1005,63,419,4,403,1105,1,423,1001,64,1,64,1002,64,2,64,109,21,1206,-5,435,1106,0,441,4,429,1001,64,1,64,1002,64,2,64,109,-22,21101,44,0,10,1008,1014,44,63,1005,63,463,4,447,1105,1,467,1001,64,1,64,1002,64,2,64,109,25,2106,0,-2,1106,0,485,4,473,1001,64,1,64,1002,64,2,64,109,-19,2107,37,-2,63,1005,63,501,1106,0,507,4,491,1001,64,1,64,1002,64,2,64,109,8,2106,0,10,4,513,1001,64,1,64,1105,1,525,1002,64,2,64,109,-6,21107,45,46,0,1005,1012,547,4,531,1001,64,1,64,1105,1,547,1002,64,2,64,109,-5,1202,-1,1,63,1008,63,21,63,1005,63,567,1105,1,573,4,553,1001,64,1,64,1002,64,2,64,109,2,1207,-3,21,63,1005,63,589,1105,1,595,4,579,1001,64,1,64,1002,64,2,64,109,1,1201,-8,0,63,1008,63,34,63,1005,63,619,1001,64,1,64,1106,0,621,4,601,1002,64,2,64,109,-6,2102,1,-1,63,1008,63,33,63,1005,63,643,4,627,1105,1,647,1001,64,1,64,1002,64,2,64,109,10,21101,46,0,3,1008,1017,43,63,1005,63,667,1106,0,673,4,653,1001,64,1,64,1002,64,2,64,109,-13,2102,1,8,63,1008,63,35,63,1005,63,697,1001,64,1,64,1106,0,699,4,679,1002,64,2,64,109,23,2105,1,0,4,705,1105,1,717,1001,64,1,64,1002,64,2,64,109,-1,1205,-3,729,1106,0,735,4,723,1001,64,1,64,1002,64,2,64,109,-15,2101,0,0,63,1008,63,38,63,1005,63,755,1106,0,761,4,741,1001,64,1,64,1002,64,2,64,109,-2,2107,28,-1,63,1005,63,779,4,767,1106,0,783,1001,64,1,64,1002,64,2,64,109,-2,2108,35,0,63,1005,63,801,4,789,1105,1,805,1001,64,1,64,1002,64,2,64,109,1,1201,-5,0,63,1008,63,26,63,1005,63,831,4,811,1001,64,1,64,1105,1,831,1002,64,2,64,109,-5,1207,5,30,63,1005,63,849,4,837,1106,0,853,1001,64,1,64,1002,64,2,64,109,2,1202,-2,1,63,1008,63,26,63,1005,63,879,4,859,1001,64,1,64,1105,1,879,1002,64,2,64,109,15,21107,47,46,0,1005,1017,899,1001,64,1,64,1105,1,901,4,885,4,64,99,21102,1,27,1,21101,915,0,0,1106,0,922,21201,1,66416,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21102,942,1,0,1105,1,922,21202,1,1,-1,21201,-2,-3,1,21102,1,957,0,1105,1,922,22201,1,-1,-2,1105,1,968,22102,1,-2,-2,109,-3,2105,1,0];

const computer = new Computer(program);

while(!computer.isHalted()) {
  console.log('$ ', computer.run(2));
}
