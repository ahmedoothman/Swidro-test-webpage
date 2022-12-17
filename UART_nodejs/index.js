const express = require('express');
const app = express();
const cors = require('cors');
const serialController = require('./controllers/serialController');
const fs = require('fs/promises');
let localBuffer = 'Empty';
let portObjTemp;
let readings = [];
let ByteCounter = 0;

let byte = [];
let finalIR = 0;
let finalRED = 0;
let finalTime = 0;
let numberOfSamples = 0;
let dataType = 'num';
let IRSamples = [];
let RedSamples = [];
let bpm = 0;
let o2 = 0;
let accelo = {
  x: 0,
  y: 0,
  z: 0,
};
const hexToDecimal = (hex) => {
  return parseInt(hex, 16);
};
const sampleHandler = (data) => {
  // console.log('--- ' + ByteCounter);
  if (data === 'E') {
    numberOfSamples = 0;
    finalIR = 0;
    finalRED = 0;
    ByteCounter = 0;
  } else if (data === 'N') {
    // console.log('------------------------------------');
    finalIR = 0;
    finalRED = 0;
    ByteCounter = 0;
  } else {
    if (ByteCounter === 0) {
      byte[0] = hexToDecimal(data);
    } else if (ByteCounter === 1) {
      byte[1] = hexToDecimal(data);
    } else if (ByteCounter === 2) {
      byte[2] = hexToDecimal(data);
      finalIR = byte[0] | (byte[1] * 256) | (byte[2] * 65536);
    } else if (ByteCounter === 3) {
      byte[3] = hexToDecimal(data);
      finalIR =
        byte[0] | (byte[1] * 256) | (byte[2] * 65536) | (byte[3] * 16777216);
      bpm = finalIR;
    } else if (ByteCounter === 4) {
      byte[4] = hexToDecimal(data);
    } else if (ByteCounter === 5) {
      byte[5] = hexToDecimal(data);
    } else if (ByteCounter === 6) {
      byte[6] = hexToDecimal(data);
    } else if (ByteCounter === 7) {
      byte[7] = hexToDecimal(data);
      finalRED =
        byte[4] | (byte[5] * 256) | (byte[6] * 65536) | (byte[7] * 16777216);
      o2 = finalRED;
    } else if (ByteCounter === 8) {
      byte[8] = hexToDecimal(data);
    } else if (ByteCounter === 9) {
      byte[9] = hexToDecimal(data);
    } else if (ByteCounter === 10) {
      byte[10] = hexToDecimal(data);
    } else if (ByteCounter === 11) {
      byte[11] = hexToDecimal(data);
      finalTime =
        byte[8] | (byte[9] * 256) | (byte[10] * 65536) | (byte[11] * 16777216);
      numberOfSamples++;
      // console.log('Number Of samples : ' + numberOfSamples);
      // console.log('IR LED : ' + finalIR);
      // console.log('RED LED : ' + finalRED);
      // console.log('TIME : ' + finalTime + ' s');
      fs.appendFile('IR.txt', finalIR + '\n', (err) => {
        if (err) throw err;
      });
      fs.appendFile('Red.txt', finalRED + '\n', (err) => {
        if (err) throw err;
      });
      finalTime = ((finalTime * 2) / 1000.0).toFixed(4);
      fs.appendFile('IRTimes.txt', finalTime + '\n', (err) => {
        if (err) throw err;
      });
      fs.appendFile(
        'IRPoints.txt',
        '(' + finalTime + ',' + finalIR + ')' + '\n',
        (err) => {
          if (err) throw err;
        }
      );
    }

    ByteCounter++;
    if (ByteCounter > 11) {
      ByteCounter = 0;
    }
  }
};

const hrOxyHandler = (data) => {
  // console.log('--- ' + ByteCounter);
  if (data === 'E') {
    numberOfSamples = 0;
    finalIR = 0;
    finalRED = 0;
    ByteCounter = 0;
  } else if (data === 'N') {
    console.log('------------------------------------');
    finalIR = 0;
    finalRED = 0;
    ByteCounter = 0;
  } else {
    if (ByteCounter === 0) {
      byte[0] = hexToDecimal(data);
    } else if (ByteCounter === 1) {
      byte[1] = hexToDecimal(data);
    } else if (ByteCounter === 2) {
      byte[2] = hexToDecimal(data);
      finalIR = byte[0] | (byte[1] * 256) | (byte[2] * 65536);
    } else if (ByteCounter === 3) {
      byte[3] = hexToDecimal(data);
      finalIR =
        byte[0] | (byte[1] * 256) | (byte[2] * 65536) | (byte[3] * 16777216);
    } else if (ByteCounter === 4) {
      byte[4] = hexToDecimal(data);
    } else if (ByteCounter === 5) {
      byte[5] = hexToDecimal(data);
    } else if (ByteCounter === 6) {
      byte[6] = hexToDecimal(data);
    } else if (ByteCounter === 7) {
      byte[7] = hexToDecimal(data);

      finalRED =
        byte[4] | (byte[5] * 256) | (byte[6] * 65536) | (byte[7] * 16777216);
    } else if (ByteCounter === 8) {
      byte[8] = hexToDecimal(data);
    } else if (ByteCounter === 9) {
      byte[9] = hexToDecimal(data);
    } else if (ByteCounter === 10) {
      byte[10] = hexToDecimal(data);
    } else if (ByteCounter === 11) {
      byte[11] = hexToDecimal(data);
      finalTime =
        byte[8] | (byte[9] * 256) | (byte[10] * 65536) | (byte[11] * 16777216);
      numberOfSamples++;
      console.log('Number Of samples : ' + numberOfSamples);
      console.log('BPM : ' + finalIR);
      console.log('Avg BPM :' + finalRED);
      fs.appendFile('BBP.txt', finalIR + '\n', (err) => {
        if (err) throw err;
      });
      finalTime = ((finalTime * 2) / 1000.0).toFixed(4);
      console.log('TIME : ' + finalTime + ' s');
    }

    ByteCounter++;
    if (ByteCounter > 11) {
      ByteCounter = 0;
    }
  }
};
const normalNumberHandler = (data) => {
  let number = hexToDecimal(data);
  console.log(number);
};
const decideDataType = (data) => {
  if (data === 'N') {
    dataType = 'num';
  } else if (data === 'R') {
    dataType = 'led';
  } else {
    /* numbers */
    if (dataType === 'num') {
      normalNumberHandler(data);
    } else if (dataType === 'led') {
      irLedHandler(data);
    }
  }
};
const saveData = async (data) => {
  if (data === 'S') {
    dataType = 'S';
    // fs.writeFile('IR.txt', '', (err) => {
    //   if (err) throw err;
    // });
    // finalTime = ((finalTime * 2) / 1000.0).toFixed(4);
    // console.log('TIME : ' + finalTime + ' s');
    // fs.writeFile('IRTimes.txt', '', (err) => {
    //   if (err) throw err;
    // });
    // fs.writeFile('IRPoints.txt', '', (err) => {
    //   if (err) throw err;
    // });
  } else if (data === 'R') {
    dataType = 'R';
    // fs.writeFile('BBP.txt', '', (err) => {
    //   if (err) throw err;
    // });
  } else {
    switch (dataType) {
      case 'S':
        sampleHandler(data);
        break;
      case 'R':
        hrOxyHandler(data);
        break;

      default:
        normalNumberHandler(data);
        break;
    }
  }
  localBuffer = data;
};
/*
const logIT = (data) => {
  console.log('from local ' + data);
};
const { message: openStatus, PortObj: portObj } = serialController.Open('COM3');
console.log(openStatus);
const writeStatus = serialController.sendData('HI From Express', portObj);
console.log(writeStatus);

serialController.readData(portObj, logIT);
*/
const readingPort = () => {
  if (portObjTemp) {
  }
};
/* Turn on reading */
readingPort();
//////////////////////////////////
// Server
app.use(cors());
app.use(express.json({ limit: '50kb' }));
/////////////////////////
// init
app.post('/connect', async (req, res) => {
  /* Writing For Now */
  const port = req.body.port;
  console.log(port);
  const { status, message, PortObj: portObj } = serialController.Open(port);
  /* save object to global variable */
  portObjTemp = portObj;
  /* Turn on reading */
  serialController.readData(portObjTemp, saveData);
  if (status === 'Success') {
    res.status(200).json({
      status,
      message,
    });
  } else {
    res.status(400).json({
      status,
      message,
    });
  }
});
/////////////////////////
// POST Data
app.post('/sendData', async (req, res) => {
  const data = req.body.data;
  const { status, message } = serialController.sendData(data, portObjTemp);

  if (status === 'Success') {
    res.status(200).json({
      status,
      message,
    });
  } else {
    res.status(400).json({
      status,
      message,
    });
  }
});
/////////////////////////
// GET Reading
app.get('/ReadData', async (req, res) => {
  console.log(localBuffer);
  res.status(200).json({
    data: localBuffer,
  });
});

app.get('/getBpm', async (req, res) => {
  res.status(200).json({
    data: bpm,
  });
});
app.get('/getO2', async (req, res) => {
  res.status(200).json({
    data: o2,
  });
});
app.get('/getAcc', async (req, res) => {
  res.status(200).json({
    data: accelo,
  });
});
const port = 8000;
const server = app.listen(port, () => {
  console.log(`works on ${port} ...`);
});

app.get('/disconnect', (req, res) => {
  const { status, message } = serialController.Close(portObjTemp);
  if (status === 'Success') {
    res.status(200).json({
      status,
      message,
    });
  } else {
    res.status(400).json({
      status,
      message,
    });
  }
});
