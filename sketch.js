////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
let audioManager;
let effectsChain;
let spectrumAnalyzer;
let soundLibrary;
let uiController;

function setup() {
  noCanvas();
  
  //initializing all managers
  audioManager = new AudioManager();
  effectsChain = new EffectsChain();
  soundLibrary = new SoundLibrary();
  spectrumAnalyzer = new SpectrumAnalyzer();
  uiController = new UIController(audioManager, effectsChain, soundLibrary, spectrumAnalyzer);
  
  //setup spectrum canvases
  spectrumAnalyzer.setupCanvases();
}

function draw() {
  //drawing spectrum visualizations if a sound is selected and playing
  const currentSound = audioManager.getCurrentSound();
  
  if (currentSound && audioManager.isCurrentlyPlaying()) {
    //drawing both spectrums with live data
    spectrumAnalyzer.drawSpectrums();
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////