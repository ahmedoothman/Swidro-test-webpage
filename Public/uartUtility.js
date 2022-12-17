const url = 'http://127.0.0.1:8000';

const connectPort = (port) => {
  let data = JSON.stringify({
    port,
  });
  $.ajax({
    url: `${url}/connect`,
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data,
    processData: false,
  }).done((response) => {
    console.log(response);
    if (response.status === 'Success') {
      connectContainer.classList.remove('deactive');
      connectContainer.classList.add('active');
    }
  });
};
const sendDataToPort = (message) => {
  let data = JSON.stringify({
    data: message,
  });
  /* Send Data */
  $.ajax({
    url: `${url}/sendData`,
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data,
    processData: false,
  }).done((response) => {
    console.log(response);
  });
};

const readDataFromPort = () => {
  /* get request to get data*/
  $.ajax({
    url: `${url}/ReadData`,
    type: 'GET',
    success: function (res) {
      console.log(res);
      const data = res.data;
      let recData = '';
      console.log(data.charCodeAt(0));
      console.log('0x' + data.charCodeAt(0).toString(16));
      recData = '0x' + data.charCodeAt(0).toString(16);
      consolePort.innerHTML = recData;
    },
  });
};
const readBpm = (returnData) => {
  /* get request to get data*/
  $.ajax({
    url: `${url}/getBpm`,
    type: 'GET',
    success: function (res) {
      console.log(res);
      const data = res.data;
      returnData(data);
    },
  });
};
const readO2 = (returnData) => {
  /* get request to get data*/
  $.ajax({
    url: `${url}/getO2`,
    type: 'GET',
    success: function (res) {
      console.log(res);
      const data = res.data;
      returnData(data);
    },
  });
};
const readAcc = (returnData) => {
  /* get request to get data*/
  $.ajax({
    url: `${url}/getAcc`,
    type: 'GET',
    success: function (res) {
      console.log(res);
      const data = res.data;
      returnData(data);
    },
  });
};
const disconnect = () => {
  /* get request to close port*/
  $.ajax({
    url: `${url}/disconnect`,
    type: 'GET',
    success: function (res) {
      if (res.status === 'Success') {
        connectContainer.classList.add('deactive');
        connectContainer.classList.remove('active');
      }
    },
  });
};

// export { connectPort, sendDataToPort, readDataFromPort, disconnect };
