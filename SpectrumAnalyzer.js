////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
class SpectrumAnalyzer {
  constructor() {
    this.fftInput = new p5.FFT(0.8, 1024);  
    this.fftOutput = new p5.FFT(0.8, 1024); 
    this.canvasInput = null; 
    this.canvasOutput = null; 
    this.ctxInput = null; 
    this.ctxOutput = null; 
    this.currentSound = null; 
    this.currentEffect = null; 
  }
  
  //connectting the input sound to the FFT analyzer
  connectInput(sound) {
    if (sound) {
      this.currentSound = sound;
      this.fftInput.setInput(sound);
    }
  }
  
  //connectting the output effect to the FFT analyzer
  connectOutput(effect) {
    if (effect) {
      this.currentEffect = effect;
      this.fftOutput.setInput(effect);
    }
  }
  
  //reseting all connections 
  resetConnections() {
    this.fftInput.setInput();
    this.fftOutput.setInput();
    this.currentSound = null;
    this.currentEffect = null;
  }
  
  //reconnecting the input and output FFT analyzers
  reconnect() {
    if (this.currentSound) {
      this.fftInput.setInput(this.currentSound);
    }
    if (this.currentEffect) {
      this.fftOutput.setInput(this.currentEffect);
    }
  }
  
  //setting up the canvases for displaying the spectrums
  setupCanvases() {
    const spectrumInBox = document.getElementById('spectrum-in-box');
    const spectrumOutBox = document.getElementById('spectrum-out-box');
    
    if (spectrumInBox && spectrumOutBox) {
      spectrumInBox.innerHTML = '<h3>Spectrum<br>In</h3>';
      spectrumOutBox.innerHTML = '<h3>Spectrum<br>Out</h3>';
      
      //creating input canvas
      this.canvasInput = document.createElement('canvas');
      this.canvasInput.width = 400;
      this.canvasInput.height = 150;
      this.canvasInput.style.marginTop = '10px';
      this.canvasInput.style.border = '2px solid #000';
      this.canvasInput.style.borderRadius = '8px';
      spectrumInBox.appendChild(this.canvasInput);
      this.ctxInput = this.canvasInput.getContext('2d');
      
      //creatingg output canvas
      this.canvasOutput = document.createElement('canvas');
      this.canvasOutput.width = 400;
      this.canvasOutput.height = 150;
      this.canvasOutput.style.marginTop = '10px';
      this.canvasOutput.style.border = '2px solid #000';
      this.canvasOutput.style.borderRadius = '8px';
      spectrumOutBox.appendChild(this.canvasOutput);
      this.ctxOutput = this.canvasOutput.getContext('2d');
    }
  }
  
  //drawing the input and output spectrums on their respective canvases
  drawSpectrums() {
    if (!this.canvasInput || !this.canvasOutput) return;
    if (!this.ctxInput || !this.ctxOutput) return;
    
    //drawing input spectrum
    this.drawSpectrum(this.fftInput, this.canvasInput, this.ctxInput, true);  
    //drawing output spectrum
    this.drawSpectrum(this.fftOutput, this.canvasOutput, this.ctxOutput, false); 
  }
  
  //drawing a spectrum on a given canvas
  drawSpectrum(fft, canvas, ctx, isInput) {
    const spectrum = fft.analyze();
    const w = canvas.width;
    const h = canvas.height;
    
    //clearing the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    const barWidth = w / spectrum.length;
    
    //drawing each bar representing the frequency data
    for (let i = 0; i < spectrum.length; i++) {
      const barHeight = this.mapValue(spectrum[i], 0, 255, 0, h - 10);
      const x = i * barWidth;
      
      //determining bar color based on the spectrum value
      let r, g, b;
      const ratio = spectrum[i] / 255;
      
      if (isInput) {
        r = Math.floor(10 + ratio * 19);
        g = Math.floor(74 + ratio * 117);
        b = Math.floor(107 + ratio * 148);
      } else {
        r = Math.floor(29 + ratio * 226);
        g = Math.floor(191 + ratio * 64);
        b = Math.floor(45 - ratio * 45);
      }
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
    }
    
    //adding border and label
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, w, h);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(isInput ? 'ORIGINAL' : 'PROCESSED', 10, 20);
  }
  
  //mapping a value from one range to another
  mapValue(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////