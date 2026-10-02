////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
class EffectsChain {
  constructor() {
    //initializing all effects
    this.lowPass = new p5.LowPass();
    this.distortion = new p5.Distortion();
    this.compressor = new p5.Compressor();
    this.reverb = new p5.Reverb();
    
    //effect states
    this.states = {
      lowPass: { active: false, currentParam: null },
      distortion: { active: false, currentParam: null },
      compressor: { active: false, currentParam: null },
      reverb: { active: false, currentParam: null }
    };
    
    //settingdefault parameters
    this.params = {
      lowPass: {
        cutoff: { value: 22050, dryWet: 0 },
        resonance: { value: 0.001, dryWet: 0 },
        outputLevel: 1
      },
      distortion: {
        amount: { value: 0, dryWet: 0 },
        oversample: { value: 'none', dryWet: 0 },
        outputLevel: 1
      },
      compressor: {
        attack: { value: 0.003, dryWet: 0 },
        knee: { value: 0, dryWet: 0 },
        ratio: { value: 1, dryWet: 0 },
        threshold: { value: 0, dryWet: 0 },
        release: { value: 0.25, dryWet: 0 },
        outputLevel: 1
      },
      reverb: {
        duration: { value: 0, dryWet: 0 },
        decay: { value: 0, dryWet: 0 },
        reverse: false,
        outputLevel: 1
      }
    };
    
    this.updateAllEffects();
  }
  
  connectToSound(sound) {
    if (sound) {
      sound.disconnect();
      
      //chain: sound → lowpass → distortion → compressor → reverb → output
      sound.connect(this.lowPass);
      this.lowPass.connect(this.distortion);
      this.distortion.connect(this.compressor);
      this.compressor.connect(this.reverb);
      this.reverb.connect();
      
    }
  }

//====================REVERB====================

selectReverbParam(param) {
  //setting the selected reverb parameter
  this.states.reverb.currentParam = param;
  this.states.reverb.active = true;

  if (param === 'reverse') {
    //toggle reverse effect
    this.params.reverb.reverse = !this.params.reverb.reverse;

    //updating reverb with new reverse setting
    this.reverb.set(
      Math.max(0.1, this.params.reverb.duration.value),
      Math.max(0.1, this.params.reverb.decay.value),
      this.params.reverb.reverse
    );
  }

  return param;
}

setReverbDurationDryWet(dryWet) {
  //setting the reverb duration based on dry/wet value
  const duration = 0.1 + (dryWet * 9.9);
  this.params.reverb.duration.value = duration;
  
  this.reverb.set(duration, Math.max(0.1, this.params.reverb.decay.value), this.params.reverb.reverse);
  this.reverb.drywet(Math.min(dryWet * 2, 1));
}

setReverbDecayDryWet(dryWet) {
  //setting the reverb decay based on dry/wet value
  const decay = 0.1 + (dryWet * 9.9);
  this.params.reverb.decay.value = decay;

  this.reverb.set(Math.max(0.1, this.params.reverb.duration.value), decay, this.params.reverb.reverse);
  this.reverb.drywet(Math.min(dryWet * 2, 1));
}

setReverbOutputLevel(val) {
  //setting the output level for reverb
  this.params.reverb.outputLevel = val;
  this.reverb.amp(val);
}

  //====================LOWPASSFILTER====================
  selectLowPassParam(param) {
    //selecting lowpass filter parameter
    this.states.lowPass.currentParam = param;
    this.states.lowPass.active = true;
    return param;
  }
  
  setLowPassCutoffDryWet(dryWet) {
    //setting the lowpass filter cutoff frequency based on dry/wet parameter
    this.params.lowPass.cutoff.dryWet = dryWet;
    const minFreq = 20;
    const maxFreq = 22050;
    //exponential scaling
    const freq = minFreq * Math.pow(maxFreq / minFreq, dryWet); 
    this.params.lowPass.cutoff.value = freq;
    this.lowPass.freq(freq);
  }
  
  setLowPassResonanceDryWet(dryWet) {
    //setting the resonance of the lowpass filter
    this.params.lowPass.resonance.dryWet = dryWet;
    //exponential scaling
    const res = 0.001 * Math.pow(50000, dryWet); 
    this.params.lowPass.resonance.value = res;
    this.lowPass.res(res);
  }
  
  setLowPassOutputLevel(val) {
    //setting the output level for lowpass filter
    this.params.lowPass.outputLevel = val;
    this.lowPass.amp(val);
  }
  
  //====================DISTORTION====================
  selectDistortionParam(param) {
    //selectting distortion parameter
    this.states.distortion.currentParam = param;
    this.states.distortion.active = true;
    return param;
  }
  
  setDistortionAmountDryWet(dryWet) {
    //setting distortion amount based on dry/wet parameter
    this.params.distortion.amount.dryWet = dryWet;
    //quadratic scaling for smooth control
    const amount = dryWet * dryWet * 0.99; 
    this.params.distortion.amount.value = amount;
    this.distortion.set(amount, this.params.distortion.oversample.value);
    //full wet signal
    this.distortion.drywet(1); 
  }
  
  setDistortionOversampleDryWet(dryWet) {
    //setting the oversampling for distortion based on dry/wet parameter
    this.params.distortion.oversample.dryWet = dryWet;
    let oversample;
    if (dryWet < 0.33) oversample = 'none';
    else if (dryWet < 0.66) oversample = '2x';
    else oversample = '4x';
    this.params.distortion.oversample.value = oversample;
    this.distortion.set(this.params.distortion.amount.value, oversample);
  }
  
  setDistortionOutputLevel(val) {
    //setting the output level for distortion
    this.params.distortion.outputLevel = val;
    this.distortion.amp(val);
  }
  
  //====================COMPRESSOR====================
  selectCompressorParam(param) {
    //selecting compressor parameter
    this.states.compressor.currentParam = param;
    this.states.compressor.active = true;
    return param;
  }
  
  setCompressorAttackDryWet(dryWet) {
    //setting the attack time for the compressor based on dry/wet parameter
    this.params.compressor.attack.dryWet = dryWet;
    //exponential scaling
    const attack = 0.003 * Math.pow(333.33, dryWet); 
    this.params.compressor.attack.value = attack;
    
    this.compressor.set(
      attack,
      this.params.compressor.knee.value,
      this.params.compressor.ratio.value,
      this.params.compressor.threshold.value,
      this.params.compressor.release.value
    );
    //full wet signal
    this.compressor.drywet(1); 
  }
  
  setCompressorRatioDryWet(dryWet) {
    //setting the compression ratio based on dry/wet parameter
    this.params.compressor.ratio.dryWet = dryWet;
    //exponential scaling
    const ratio = 1 + (Math.pow(dryWet, 2) * 19); 
    this.params.compressor.ratio.value = ratio;
    
    this.compressor.set(
      this.params.compressor.attack.value,
      this.params.compressor.knee.value,
      ratio,
      this.params.compressor.threshold.value,
      this.params.compressor.release.value
    );
    this.compressor.drywet(1);
  }

  setCompressorKneeDryWet(dryWet) {
    //setting the knee for the compressor based on dry/wet parameter
    this.params.compressor.knee.dryWet = dryWet;
    const knee = dryWet * 40; 
    this.params.compressor.knee.value = knee;
    
    this.compressor.set(
      this.params.compressor.attack.value,
      knee,
      this.params.compressor.ratio.value,
      this.params.compressor.threshold.value,
      this.params.compressor.release.value
    );
    this.compressor.drywet(1);
  }
  
  setCompressorThresholdDryWet(dryWet) {
    //setting the threshold for the compressor based on dry/wet parameter
    this.params.compressor.threshold.dryWet = dryWet;
    const threshold = -100 + (dryWet * 100); 
    this.params.compressor.threshold.value = threshold;
    
    this.compressor.set(
      this.params.compressor.attack.value,
      this.params.compressor.knee.value,
      this.params.compressor.ratio.value,
      threshold,
      this.params.compressor.release.value
    );
    this.compressor.drywet(1);
  }
  
  setCompressorReleaseDryWet(dryWet) {
    //setting the release time for the compressor based on dry/wet parameter
    this.params.compressor.release.dryWet = dryWet;
    const release = 0.01 * Math.pow(100, dryWet);
    this.params.compressor.release.value = release;
    
    this.compressor.set(
      this.params.compressor.attack.value,
      this.params.compressor.knee.value,
      this.params.compressor.ratio.value,
      this.params.compressor.threshold.value,
      release
    );
    this.compressor.drywet(1);
  }
  
  setCompressorOutputLevel(val) {
    //setting the output level for compressor
    this.params.compressor.outputLevel = val;
    this.compressor.amp(val);
  }

  updateAllEffects() {
    //updating all effects with the current parameters
    this.lowPass.freq(this.params.lowPass.cutoff.value);
    this.lowPass.res(this.params.lowPass.resonance.value);
    this.lowPass.amp(this.params.lowPass.outputLevel);
    
    this.distortion.set(
      this.params.distortion.amount.value,
      this.params.distortion.oversample.value
    );
    this.distortion.drywet(0);
    this.distortion.amp(this.params.distortion.outputLevel);
    
    this.compressor.set(
      this.params.compressor.attack.value,
      this.params.compressor.knee.value,
      this.params.compressor.ratio.value,
      this.params.compressor.threshold.value,
      this.params.compressor.release.value
    );
    this.compressor.drywet(0);
    this.compressor.amp(this.params.compressor.outputLevel);
    
    this.reverb.set(
      //minimum duration to avoid issues
      0.01,
      //minimum decay 
      0.01, 
      this.params.reverb.reverse
    );
    this.reverb.drywet(0);
    this.reverb.amp(this.params.reverb.outputLevel);
  }
  
  clearAllEffects() {
    //reseting all effect states and parameters to their defaults
    this.states = {
      lowPass: { active: false, currentParam: null },
      distortion: { active: false, currentParam: null },
      compressor: { active: false, currentParam: null },
      reverb: { active: false, currentParam: null }
    };
    
    this.params = {
      lowPass: {
        cutoff: { value: 22050, dryWet: 0 },
        resonance: { value: 0.001, dryWet: 0 },
        outputLevel: 1
      },
      distortion: {
        amount: { value: 0, dryWet: 0 },
        oversample: { value: 'none', dryWet: 0 },
        outputLevel: 1
      },
      compressor: {
        attack: { value: 0.003, dryWet: 0 },
        knee: { value: 0, dryWet: 0 },
        ratio: { value: 1, dryWet: 0 },
        threshold: { value: 0, dryWet: 0 },
        release: { value: 0.25, dryWet: 0 },
        outputLevel: 1
      },
      reverb: {
        duration: { value: 0, dryWet: 0 },
        decay: { value: 0, dryWet: 0 },
        reverse: false,
        outputLevel: 1
      }
    };
    
    this.updateAllEffects();
  }
  
  getConfiguration() {
    //returning the current effect states and parameters
    return {
      states: JSON.parse(JSON.stringify(this.states)),
      params: JSON.parse(JSON.stringify(this.params))
    };
  }
  
  loadConfiguration(config) {
    //loading saved configuration into the effect chain
    if (config && config.states && config.params) {
      this.states = config.states;
      this.params = config.params;
      this.updateAllEffects();
    }
  }
  
  getOutputEffect() {
    //returning the final output effect
    return this.reverb;
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////