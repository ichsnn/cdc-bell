document.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket('ws://192.168.0.103:8080/server');
  const randId = Math.random().toString(36).substring(7);
  const btnClickStateStart = JSON.stringify({
    id: randId,
    activity: 'start',
  });
  const btnClickStateEnd = JSON.stringify({
    id: randId,
    activity: 'end',
  });
  ws.onopen = () => {
    const btn_bell = document.getElementById('btn_bell');
    /**
     * @type {OscillatorNode | null}
     */
    var oscillator;

    function playSound() {
      var audioContext = new AudioContext();
      oscillator = audioContext.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.value = 100;
      oscillator.connect(audioContext.destination);
      oscillator.start();
    }

    function stopSound() {
      if (oscillator) {
        oscillator.stop();
        oscillator = null;
      }
    }

    if ('ontouchstart' in window) {
      btn_bell.addEventListener('touchstart', (e) => {
        if (!btn_bell.disabled) ws.send(btnClickStateStart);
      });

      btn_bell.addEventListener('touchend', (e) => {
        if (!btn_bell.disabled) ws.send(btnClickStateEnd);
      });
    } else {
      btn_bell.addEventListener('mousedown', (e) => {
        if (!btn_bell.disabled) ws.send(btnClickStateStart);
      });

      btn_bell.addEventListener('mouseup', (e) => {
        if (!btn_bell.disabled) ws.send(btnClickStateEnd);
      });
    }
    // check is touch device

    ws.onmessage = (msg) => {
      if (msg.data instanceof Blob) return;
      const data = JSON.parse(msg.data);
      if (data.id !== randId && data.activity === 'start') {
        btn_bell.disabled = true;
        console.log('disabled');
      } else if (data.id !== randId && data.activity === 'end') {
        btn_bell.disabled = false;
      } else if (data.activity === 'start' && data.id === randId) {
        playSound();
      } else if (data.activity === 'end' && data.id === randId) {
        stopSound();
      }
    };
  };
});
