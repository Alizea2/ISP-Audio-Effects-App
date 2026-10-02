////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
class UIController {
  constructor(audioManager, effectsChain, soundLibrary, spectrumAnalyzer) {
    //initializing UIController with dependencies
    this.audioManager = audioManager;
    this.effectsChain = effectsChain;
    this.soundLibrary = soundLibrary;
    this.spectrumAnalyzer = spectrumAnalyzer;
    this.isLooping = false;
    this.recordingInterval = null;
    this.setupEventListeners();  
    this.updateRecordingsDisplay(); 
  }
  
  setupEventListeners() {
    //adding event listeners for various controls and buttons
    const soundButtons = document.querySelectorAll('.sound-btn');
    soundButtons.forEach((btn, index) => {
      //sound selection
      btn.addEventListener('click', () => this.handleSoundSelection(index));  
    });
    
    //playback control buttons
    document.querySelector('.playback-controls .playback-btn:nth-child(1)')
      .addEventListener('click', () => this.handlePlayPause());  
    document.querySelector('.playback-controls .playback-btn:nth-child(2)')
      .addEventListener('click', () => this.handleStop());
    document.querySelector('.playback-controls .playback-btn:nth-child(3)')
      .addEventListener('click', () => this.handleLoop());  
    document.querySelector('.playback-controls .playback-btn:nth-child(4)')
      .addEventListener('click', () => this.handleSkipToStart());  
    
    //master volume slider
    document.querySelector('.master-slider')
       //adjusting volume
      .addEventListener('input', (e) => this.handleMasterVolume(e.target.value));  
    
    //edit,delete,record,and other action buttons
    document.querySelector('.edit-btn')
      .addEventListener('click', () => this.handleEdit());
    document.querySelector('.delete-btn')
      .addEventListener('click', () => this.handleDelete());
    document.querySelector('.record-btn')
      .addEventListener('click', () => this.handleRecord());
    document.querySelectorAll('.panel-action-btn')[0]
      .addEventListener('click', () => this.handleClearFilters());
    document.querySelector('.save-btn')
      .addEventListener('click', () => this.handleSave());
    
    this.setupEffectControls();  
  }
  
  setupEffectControls() {
    //initializing control elements for each audio effect
    const effectBoxes = document.querySelectorAll('.effect-box');
    
    this.setupLowPassControls(effectBoxes[0]);
    this.setupDistortionControls(effectBoxes[1]);
    this.setupCompressorControls(effectBoxes[2]);
    this.setupReverbControls(effectBoxes[3]);
  }
  
  //setup controls for lowpass filter
  setupLowPassControls(box) {
    const buttons = box.querySelectorAll('.param-btn');
    const sliders = box.querySelectorAll('.effect-slider');
    
    buttons[0].addEventListener('click', () => {
      this.effectsChain.selectLowPassParam('cutoff');
      this.highlightButton(buttons, 0);
      sliders[0].value = this.effectsChain.params.lowPass.cutoff.dryWet;
    });
    
    buttons[1].addEventListener('click', () => {
      this.effectsChain.selectLowPassParam('resonance');
      this.highlightButton(buttons, 1);
      sliders[0].value = this.effectsChain.params.lowPass.resonance.dryWet;
    });
    
    sliders[0].addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const currentParam = this.effectsChain.states.lowPass.currentParam;
      
      if (currentParam === 'cutoff') {
        this.effectsChain.setLowPassCutoffDryWet(val);
      } else if (currentParam === 'resonance') {
        this.effectsChain.setLowPassResonanceDryWet(val);
      }
    });
    
    sliders[1].addEventListener('input', (e) => {
      this.effectsChain.setLowPassOutputLevel(parseFloat(e.target.value));
    });
  }
  
  //setup controls for distortion effect
  setupDistortionControls(box) {
    const buttons = box.querySelectorAll('.param-btn');
    const sliders = box.querySelectorAll('.effect-slider');
    
    buttons[0].addEventListener('click', () => {
      this.effectsChain.selectDistortionParam('amount');
      this.highlightButton(buttons, 0);
      sliders[0].value = this.effectsChain.params.distortion.amount.dryWet;
    });
    
    buttons[1].addEventListener('click', () => {
      this.effectsChain.selectDistortionParam('oversample');
      this.highlightButton(buttons, 1);
      sliders[0].value = this.effectsChain.params.distortion.oversample.dryWet;
    });
    
    sliders[0].addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const currentParam = this.effectsChain.states.distortion.currentParam;
      
      if (currentParam === 'amount') {
        this.effectsChain.setDistortionAmountDryWet(val);
      } else if (currentParam === 'oversample') {
        this.effectsChain.setDistortionOversampleDryWet(val);
      }
    });
    
    sliders[1].addEventListener('input', (e) => {
      this.effectsChain.setDistortionOutputLevel(parseFloat(e.target.value));
    });
  }
  
  //setup controls for compressor effect
  setupCompressorControls(box) {
    const buttons = box.querySelectorAll('.param-btn');
    const sliders = box.querySelectorAll('.effect-slider');
    
    buttons[0].addEventListener('click', () => {
      this.effectsChain.selectCompressorParam('attack');
      this.highlightButton(buttons, 0);
      sliders[0].value = this.effectsChain.params.compressor.attack.dryWet;
    });
    
    buttons[1].addEventListener('click', () => {
      this.effectsChain.selectCompressorParam('ratio');
      this.highlightButton(buttons, 1);
      sliders[0].value = this.effectsChain.params.compressor.ratio.dryWet;
    });
    
    buttons[2].addEventListener('click', () => {
      this.effectsChain.selectCompressorParam('knee');
      this.highlightButton(buttons, 2);
      sliders[0].value = this.effectsChain.params.compressor.knee.dryWet;
    });
    
    buttons[3].addEventListener('click', () => {
      this.effectsChain.selectCompressorParam('threshold');
      this.highlightButton(buttons, 3);
      sliders[0].value = this.effectsChain.params.compressor.threshold.dryWet;
    });
    
    buttons[4].addEventListener('click', () => {
      this.effectsChain.selectCompressorParam('release');
      this.highlightButton(buttons, 4);
      sliders[0].value = this.effectsChain.params.compressor.release.dryWet;
    });
    
    sliders[0].addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const currentParam = this.effectsChain.states.compressor.currentParam;
      
      if (currentParam === 'attack') {
        this.effectsChain.setCompressorAttackDryWet(val);
      } else if (currentParam === 'ratio') {
        this.effectsChain.setCompressorRatioDryWet(val);
      } else if (currentParam === 'knee') {
        this.effectsChain.setCompressorKneeDryWet(val);
      } else if (currentParam === 'threshold') {
        this.effectsChain.setCompressorThresholdDryWet(val);
      } else if (currentParam === 'release') {
        this.effectsChain.setCompressorReleaseDryWet(val);
      }
    });
    
    sliders[1].addEventListener('input', (e) => {
      this.effectsChain.setCompressorOutputLevel(parseFloat(e.target.value));
    });
  }
  
  //setup controls for reverb effect
  setupReverbControls(box) {
    const buttons = box.querySelectorAll('.param-btn');
    const sliders = box.querySelectorAll('.effect-slider');
    
    buttons[0].addEventListener('click', () => {
      this.effectsChain.selectReverbParam('duration');
      this.highlightButton(buttons, 0);
      sliders[0].value = this.effectsChain.params.reverb.duration.dryWet;
    });
    
    buttons[1].addEventListener('click', () => {
      this.effectsChain.selectReverbParam('decay');
      this.highlightButton(buttons, 1);
      sliders[0].value = this.effectsChain.params.reverb.decay.dryWet;
    });
    
    buttons[2].addEventListener('click', () => {
      this.effectsChain.selectReverbParam('reverse');
      buttons[2].classList.toggle('active');
    });
    
    sliders[0].addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const currentParam = this.effectsChain.states.reverb.currentParam;
      
      if (currentParam === 'duration') {
        this.effectsChain.setReverbDurationDryWet(val);
      } else if (currentParam === 'decay') {
        this.effectsChain.setReverbDecayDryWet(val);
      }
    });
    
    sliders[1].addEventListener('input', (e) => {
      this.effectsChain.setReverbOutputLevel(parseFloat(e.target.value));
    });
  }
  
  //highlight the active button in a group of buttons
  highlightButton(buttons, activeIndex) {
    buttons.forEach((btn, index) => {
      if (index === activeIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  //handling sound selection from the UI
  handleSoundSelection(index) {
    if (this.audioManager.selectSound(index)) {
      this.soundLibrary.selectSound(index);
      const sound = this.audioManager.getCurrentSound();
      
      this.effectsChain.connectToSound(sound);
      this.spectrumAnalyzer.connectInput(sound);
      this.spectrumAnalyzer.connectOutput(this.effectsChain.getOutputEffect());
      
      //updating UI for sound selection
      document.querySelectorAll('.sound-btn').forEach((btn, i) => {
        if (i === index) {
          btn.style.backgroundColor = '#e0e0e0';
          btn.style.fontWeight = 'bold';
        } else {
          btn.style.backgroundColor = 'white';
          btn.style.fontWeight = 'normal';
        }
      });
      
      this.updateRecordingsDisplay();
      
      const config = this.soundLibrary.loadEffectConfiguration(index);
      if (config) {
        this.effectsChain.loadConfiguration(config);
        this.updateUIFromConfig(config);
      }
    }
  }
  
  //handling play/pause button click
  handlePlayPause() {
    this.audioManager.togglePlayPause();
    const btn = document.querySelector('.playback-controls .playback-btn:nth-child(1)');
    
    if (this.audioManager.isCurrentlyPlaying()) {
      btn.textContent = 'Pause';
      btn.style.backgroundColor = '#1dbf2d';
    } else {
      btn.textContent = 'Play';
      btn.style.backgroundColor = '#0a4a6b';
    }
  }
  
  //handling stop button click
  handleStop() {
    this.audioManager.stop();
    const btn = document.querySelector('.playback-controls .playback-btn:nth-child(1)');
    btn.textContent = 'Play';
    btn.style.backgroundColor = '#0a4a6b';
  }
  
  //handling loop toggle button click
  handleLoop() {
    this.isLooping = this.audioManager.toggleLoop();
    const btn = document.querySelector('.playback-controls .playback-btn:nth-child(3)');
    if (this.isLooping) {
      btn.style.backgroundColor = '#1dbf2d';
    } else {
      btn.style.backgroundColor = '#0a4a6b';
    }
  }
  
  //handling skip to start button click
  handleSkipToStart() {
    this.audioManager.skipToStart();
  }
  
  //handling master volume slider input
  handleMasterVolume(value) {
    this.audioManager.setMasterVolume(parseFloat(value));
  }
  
  //handling edit button click 
  handleEdit() {
    const selectedSoundIndex = this.soundLibrary.getSelectedIndex();
    const selectedRecordingIndex = this.soundLibrary.getSelectedRecordingIndex();
    
    if (selectedSoundIndex >= 0) {
      const config = this.soundLibrary.loadEffectConfiguration(selectedSoundIndex);
      if (config) {
        this.effectsChain.loadConfiguration(config);
        this.updateUIFromConfig(config);
        alert(`Loaded effect configuration for Sound ${selectedSoundIndex + 1}`);
      } else {
        alert(`No saved configuration for Sound ${selectedSoundIndex + 1}`);
      }
    } else if (selectedRecordingIndex >= 0) {
      const recording = this.soundLibrary.getSelectedRecording();
      if (recording && recording.effectConfig) {
        this.effectsChain.loadConfiguration(recording.effectConfig);
        this.updateUIFromConfig(recording.effectConfig);
        alert(`Loaded effect configuration for ${recording.name}`);
      } else {
        alert(`No effect configuration for this recording`);
      }
    } else {
      alert('Please select a sound or recording first');
    }
  }
  
  //handlingg delete button click 
  handleDelete() {
    const selectedSoundIndex = this.soundLibrary.getSelectedIndex();
    const selectedRecordingIndex = this.soundLibrary.getSelectedRecordingIndex();
    
    if (selectedSoundIndex >= 0) {
      if (confirm(`Delete effect configuration for Sound ${selectedSoundIndex + 1}?`)) {
        this.soundLibrary.deleteEffectConfiguration(selectedSoundIndex);
        this.effectsChain.clearAllEffects();
        this.resetAllUI();
        alert(`Configuration deleted for Sound ${selectedSoundIndex + 1}`);
      }
    } else if (selectedRecordingIndex >= 0) {
      const recording = this.soundLibrary.getSelectedRecording();
      if (confirm(`Delete ${recording.name}?`)) {
        this.soundLibrary.deleteRecording(selectedRecordingIndex);
        this.updateRecordingsDisplay();
        alert(`${recording.name} deleted`);
      }
    } else {
      alert('Please select a sound or recording first');
    }
  }
  
  //handling record button click
  async handleRecord() {
    const recordBtn = document.querySelector('.record-btn');
    
    if (!this.audioManager.getRecordingStatus()) {
      if (this.audioManager.getCurrentSoundIndex() < 0) {
        alert('⚠️ Please select a sound first');
        return;
      }
      
      if (!this.audioManager.isCurrentlyPlaying()) {
        alert('⚠️ Please click Play first!');
        return;
      }
      
      const outputEffect = this.effectsChain.getOutputEffect();
      if (this.audioManager.startRecording(outputEffect)) {
        recordBtn.style.backgroundColor = '#ff6666';
        recordBtn.style.fontWeight = 'bold';
        recordBtn.innerHTML = '🔴 REC...<br><span style="font-size:14px">Click to Stop</span>';
        this.startRecordingIndicator();
      }
    } else {
      this.stopRecordingIndicator();
      recordBtn.innerHTML = ' Saving...';
      recordBtn.style.backgroundColor = '#ffa500';
      
      try {
        const recordedSound = await this.audioManager.stopRecording();
        
        if (recordedSound && recordedSound.buffer) {
          const currentConfig = this.effectsChain.getConfiguration();
          const recordingIndex = this.soundLibrary.addRecording(recordedSound, currentConfig);
          
          this.updateRecordingsDisplay();
          
          recordBtn.style.backgroundColor = '#f0e0d0';
          recordBtn.style.fontWeight = 'normal';
          recordBtn.textContent = 'Record New';
          
          this.audioManager.saveRecordingAsWAV();
          
          alert(`Recording ${recordingIndex + 1} saved!`);
        } else {
          recordBtn.style.backgroundColor = '#f0e0d0';
          recordBtn.style.fontWeight = 'normal';
          recordBtn.textContent = 'Record New';
          alert(' Recording failed!');
        }
      } catch (error) {
        recordBtn.style.backgroundColor = '#f0e0d0';
        recordBtn.style.fontWeight = 'normal';
        recordBtn.textContent = 'Record New';
        alert(' Recording error');
      }
    }
  }
  
  //starting recording indicator/updating every sec
  startRecordingIndicator() {
    this.recordingInterval = setInterval(() => {
      const duration = this.audioManager.getRecordingDuration();
      const recordBtn = document.querySelector('.record-btn');
      recordBtn.innerHTML = `🔴 REC ${duration}s<br><span style="font-size:14px">Click to Stop</span>`;
    }, 100);
  }
  
  //stoping recording indicator
  stopRecordingIndicator() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
  }
  
  //clearing all filter settings
  handleClearFilters() {
    if (confirm('Clear all filter settings?')) {
      this.effectsChain.clearAllEffects();
      this.resetAllUI();
      alert('All filters cleared');
    }
  }
  
  //reseting all UI elements to their default states
  resetAllUI() {
    document.querySelectorAll('.param-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const effectBoxes = document.querySelectorAll('.effect-box');
    effectBoxes.forEach(box => {
      const sliders = box.querySelectorAll('.effect-slider');
      sliders[0].value = 0;
      sliders[1].value = 1;
    });
  }
  
  //saving effect configuration for the selected sound or recording
  handleSave() {
    const selectedSoundIndex = this.soundLibrary.getSelectedIndex();
    const selectedRecordingIndex = this.soundLibrary.getSelectedRecordingIndex();
    
    if (selectedSoundIndex >= 0) {
      const config = this.effectsChain.getConfiguration();
      this.soundLibrary.saveEffectConfiguration(selectedSoundIndex, config);
      alert(`Effect configuration saved for Sound ${selectedSoundIndex + 1}`);
    } else if (selectedRecordingIndex >= 0) {
      const config = this.effectsChain.getConfiguration();
      this.soundLibrary.updateRecordingEffectConfig(selectedRecordingIndex, config);
      alert(`Effect configuration updated for recording`);
    } else {
      alert('Please select a sound or recording first');
    }
  }
  
  //updating UI based on the configuration
  updateUIFromConfig(config) {
    if (!config) return;
    
    const effectBoxes = document.querySelectorAll('.effect-box');
    
    const lpSliders = effectBoxes[0].querySelectorAll('.effect-slider');
    lpSliders[0].value = 0;
    lpSliders[1].value = config.params.lowPass.outputLevel;
    
    const dstSliders = effectBoxes[1].querySelectorAll('.effect-slider');
    dstSliders[0].value = 0;
    dstSliders[1].value = config.params.distortion.outputLevel;
    
    const cmpSliders = effectBoxes[2].querySelectorAll('.effect-slider');
    cmpSliders[0].value = 0;
    cmpSliders[1].value = config.params.compressor.outputLevel;
    
    const rvSliders = effectBoxes[3].querySelectorAll('.effect-slider');
    rvSliders[0].value = 0;
    rvSliders[1].value = config.params.reverb.outputLevel;
  }
  
  //updating the display of recordings in the UI
  updateRecordingsDisplay() {
    const ellipsisDiv = document.querySelector('.ellipsis');
    const recordings = this.soundLibrary.getRecordings();
    
    //if there are no recordings then show an empty state
    if (recordings.length === 0) {
      ellipsisDiv.innerHTML = '...';
      ellipsisDiv.style.cursor = 'default';
      ellipsisDiv.style.display = 'flex';
      ellipsisDiv.style.justifyContent = 'center';
      ellipsisDiv.style.alignItems = 'center';
    } else {
      //if there are recordings then display them in a list
      ellipsisDiv.innerHTML = '';
      ellipsisDiv.style.display = 'flex';
      ellipsisDiv.style.flexDirection = 'column';
      ellipsisDiv.style.gap = '10px';
      ellipsisDiv.style.padding = '15px';
      ellipsisDiv.style.maxHeight = '300px';
      ellipsisDiv.style.overflowY = 'auto';
      
      recordings.forEach((recording, index) => {
        const recBtn = document.createElement('button');
        recBtn.textContent = `🎵 ${recording.name}`;
        recBtn.className = 'recording-btn';
        recBtn.style.padding = '12px';
        recBtn.style.fontSize = '16px';
        recBtn.style.fontWeight = 'bold';
        recBtn.style.border = '3px solid #000';
        recBtn.style.borderRadius = '10px';
        recBtn.style.backgroundColor = 'white';
        recBtn.style.cursor = 'pointer';
        recBtn.style.transition = 'all 0.2s';
        recBtn.style.textAlign = 'left';
        
        //highlighting the selected recording button
        if (index === this.soundLibrary.getSelectedRecordingIndex()) {
          recBtn.style.backgroundColor = '#1dbf2d';
          recBtn.style.color = 'white';
        }
        
        recBtn.addEventListener('click', () => this.handleRecordingSelection(index));
        recBtn.addEventListener('mouseenter', () => {
          if (index !== this.soundLibrary.getSelectedRecordingIndex()) {
            recBtn.style.backgroundColor = '#f0f0f0';
            recBtn.style.transform = 'translateX(5px)';
          }
        });
        recBtn.addEventListener('mouseleave', () => {
          if (index !== this.soundLibrary.getSelectedRecordingIndex()) {
            recBtn.style.backgroundColor = 'white';
            recBtn.style.transform = 'translateX(0)';
          }
        });
        
        ellipsisDiv.appendChild(recBtn);
      });
    }
  }
  
  //handling selection of a recording
  handleRecordingSelection(index) {
    if (this.soundLibrary.selectRecording(index)) {
      const recording = this.soundLibrary.getSelectedRecording();
      
      //stoping any current playback
      this.audioManager.stop(); 
      
      //if the recording has sound then play it
      if (recording.sound && recording.sound.buffer) {
        recording.sound.loop();
      }
      
      //updating UI based on the selected recording
      document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.fontWeight = 'normal';
      });
      
      this.updateRecordingsDisplay();
    }
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////