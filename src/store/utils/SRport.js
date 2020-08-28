const SerialPort = window.require('serialport');
const InterByteTimeout = window.require('@serialport/parser-inter-byte-timeout');

const methods = {
  open1: [0xfe, 0x05, 0x00, 0x00, 0xff, 0x00, 0x98, 0x35],
  open2: [0xfe, 0x05, 0x00, 0x01, 0xff, 0x00, 0xc9, 0xf5],
  open3: [0xfe, 0x05, 0x00, 0x02, 0xff, 0x00, 0x39, 0xf5],
  open4: [0xfe, 0x05, 0x00, 0x03, 0xff, 0x00, 0x68, 0x35],
  openall: [0xfe, 0x0f, 0x00, 0x00, 0x00, 0x04, 0x01, 0xff, 0x31, 0xd2],
  close1: [0xfe, 0x05, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xc5],
  close2: [0xfe, 0x05, 0x00, 0x01, 0x00, 0x00, 0x88, 0x05],
  close3: [0xfe, 0x05, 0x00, 0x02, 0x00, 0x00, 0x78, 0x05],
  close4: [0xfe, 0x05, 0x00, 0x03, 0x00, 0x00, 0x29, 0xc5],
  closeall: [0xfe, 0x0f, 0x00, 0x00, 0x00, 0x04, 0x01, 0x00, 0x71, 0x92],
  read1: [0xfe, 0x02, 0x00, 0x00, 0x00, 0x01, 0xad, 0xc5],
  read2: [0xfe, 0x02, 0x00, 0x01, 0x00, 0x01, 0xfc, 0x05],
  read3: [0xfe, 0x02, 0x00, 0x02, 0x00, 0x01, 0x0c, 0x05],
  read4: [0xfe, 0x02, 0x00, 0x03, 0x00, 0x01, 0x5d, 0xc5],
  readoutall: [0xfe, 0x01, 0x00, 0x00, 0x00, 0x04, 0x29, 0xc6],
  readinall: [0xfe, 0x02, 0x00, 0x00, 0x00, 0x04, 0x6d, 0xc6],
};

async function getPortPath(productId = 'EA60') {
  const portArr = await SerialPort.list();
  const targetPorts = portArr.map(item => {
    if (item.productId.toLowerCase() === productId.toLowerCase()) {
      return item.path;
    }
  });
  return targetPorts;
}

async function getPort() {
  const portPaths = await getPortPath();

  if (portPaths.length === 0) return;

  const port = new SerialPort(portPaths[0], {
    autoOpen: true,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  });

  const parser = port.pipe(new InterByteTimeout({ interval: 30 }));
  return {port , parser};
}


function open(port, target) {
  const argus = arguments;
  port.write(methods['open' + target]);
  port.drain(async () => {
    const res = await read(target, 'out');
    let state = false;

    // 查询单路输出状态
    if (res && target !== 'all') {
      state = res[target];
    }

    // 查询4路输出状态
    if (res && target === 'all') {
      state = Object.values(res).every(item => item);
    }

    if (!state || res) {
      open(port, target);
    }
  }
  )
  // setTimeout(() =>{}, 30);
}

async function close(port, target) {
  port.write(methods['close' + target]);
  port.drain(async () => {
    const res = await read(target, 'out');
    let state = true;
    // 查询单路输出状态
    if (res && target !== 'all') {
      state = res[target];
    }
    // 查询4路输出状态
    if (res && target === 'all') {
      state = Object.values(res).some(item => item);
    }
    if (state || !res) {
      close(port, target);
    }
  })

  // setTimeout(() => {}, 50);
}

function read(port, parser, target, type) {
  if (!target || !type) return;

  return new Promise((resolve, reject) => {
    parser.on('data', function (data) {
      const state = data[3];
      const res = binParser(state);
      console.log('data:' + data);
      console.log('res:' + JSON.stringify(res));

      // 读输出
      if (type.toLowerCase() === 'out' && data[1] === 1) {
        resolve(res);
        port._events.data = [];
      }

      // 读输入
      if (type.toLowerCase() === 'in' && data[1] === 2) {
        // 查询单路输出状态
        if (target !== 'all') {
          resolve(res[target]);
        }

        // 查询4路输出状态
        if (target === 'all') {
          resolve(res);
        }
        port._events.data = [];
      }
    });

    port.write(methods[`read${type}all`]);
  });
}

function binParser(hex) {
  if (!hex) return;

  let obj = {};

  switch (hex) {
    case 0:
      obj = { 1: false, 2: false, 3: false, 4: false };
      break;
    case 1:
      obj = { 1: true, 2: false, 3: false, 4: false };
      break;
    case 2:
      obj = { 1: false, 2: true, 3: false, 4: false };
      break;
    case 3:
      obj = { 1: true, 2: true, 3: false, 4: false };
      break;
    case 4:
      obj = { 1: false, 2: false, 3: true, 4: false };
      break;
    case 5:
      obj = { 1: true, 2: false, 3: true, 4: false };
      break;
    case 6:
      obj = { 1: false, 2: true, 3: true, 4: false };
      break;
    case 7:
      obj = { 1: true, 2: true, 3: true, 4: false };
      break;
    case 8:
      obj = { 1: false, 2: false, 3: false, 4: true };
      break;
    case 9:
      obj = { 1: true, 2: false, 3: false, 4: true };
      break;
    case 10:
      obj = { 1: false, 2: true, 3: false, 4: true };
      break;
    case 11:
      obj = { 1: true, 2: true, 3: false, 4: true };
      break;
    case 12:
      obj = { 1: false, 2: false, 3: true, 4: true };
      break;
    case 13:
      obj = { 1: true, 2: false, 3: true, 4: true };
      break;
    case 14:
      obj = { 1: false, 2: true, 3: true, 4: true };
      break;
    case 15:
      obj = { 1: true, 2: true, 3: true, 4: true };
      break;
  }

  return obj;
}

function Task(method, target) {
  if (!method || !target || !port || !parser || port.opening) return;

  console.log('Task running');

  switch (method) {
    case 'open':
      open(target);
      break;
    case 'close':
      close(target);
      break;
    default:
      break;
  }
}

module.exports = {
  getPort,
  open,
  close,
  read,
  Task
}
