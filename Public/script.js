const bpm = document.querySelector('#heart-value');
const so2 = document.querySelector('#oxygen-value');
const xValue = document.querySelector('#x-value');
const yValue = document.querySelector('#y-value');
const zValue = document.querySelector('#z-value');
let bpmValue = 0;
let o2 = 0;
let accelo = { x: 0, y: 0, z: 0 };
const saveDataBpm = (data) => {
  bpmValue = data;
  bpm.innerHTML = bpmValue;
};
const saveDataO2 = (data) => {
  o2 = data;
  so2.innerHTML = o2;
};
const saveDataAcc = (data) => {
  accelo = data;
  xValue.innerHTML = accelo.x;
  yValue.innerHTML = accelo.y;
  zValue.innerHTML = accelo.z;
};
const main = () => {
  readBpm(saveDataBpm);
  readO2(saveDataO2);
  readAcc(saveDataAcc);
};
setInterval(function () {
  main();
}, 1000);
