const connectBtn = document.querySelector('#connect');
const port = 'COM4';

connectBtn.addEventListener('click', async () => {
  connectPort(port);
});
