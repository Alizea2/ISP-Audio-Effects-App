////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
class SoundLibrary {
  constructor() {
    //storing sounds
    this.library = []; 
    this.selectedSoundIndex = -1;
    //storing recordings
    this.recordings = []; 
    this.selectedRecordingIndex = -1;
    //initializing with default sounds
    this.initializeLibrary(); 
  }
  
  //initializing library with 6 default sounds
  initializeLibrary() {
    for (let i = 0; i < 6; i++) {
      this.library.push({
        name: `Sound ${i + 1}`,
        index: i,
        effectConfig: null
      });
    }
  }
  
  //saving effect configuration for a specific sound
  saveEffectConfiguration(soundIndex, config) {
    if (soundIndex >= 0 && soundIndex < this.library.length) {
      this.library[soundIndex].effectConfig = JSON.parse(JSON.stringify(config));
      return true;
    }
    return false;
  }
  
  //loading effect configuration for a specific sound
  loadEffectConfiguration(soundIndex) {
    if (soundIndex >= 0 && soundIndex < this.library.length) {
      const config = this.library[soundIndex].effectConfig;
      if (config) {
        return JSON.parse(JSON.stringify(config));
      }
    }
    return null;
  }
  
  //deleting effect configuration for a specific sound
  deleteEffectConfiguration(soundIndex) {
    if (soundIndex >= 0 && soundIndex < this.library.length) {
      this.library[soundIndex].effectConfig = null;
      return true;
    }
    return false;
  }
  
  //clearing all effect configurations in the library
  clearAllConfigurations() {
    for (let i = 0; i < this.library.length; i++) {
      this.library[i].effectConfig = null;
    }
  }
  
  //selecting a sound from the library
  selectSound(index) {
    if (index >= 0 && index < this.library.length) {
      this.selectedSoundIndex = index;
      this.selectedRecordingIndex = -1; 
      return true;
    }
    return false;
  }
  
  //gettting the selected sound index
  getSelectedIndex() {
    return this.selectedSoundIndex;
  }
  
  //getting the effect configuration of the selected sound
  getSelectedConfig() {
    if (this.selectedSoundIndex >= 0) {
      return this.loadEffectConfiguration(this.selectedSoundIndex);
    }
    return null;
  }
  
  //checking if the selected sound has saved effects
  hasSavedEffects(index) {
    if (index >= 0 && index < this.library.length) {
      return this.library[index].effectConfig !== null;
    }
    return false;
  }
  
  //getting the sound library
  getLibrary() {
    return this.library;
  }
  
  //adding a new recording to the library
  addRecording(recordedSound, effectConfig) {
    const recording = {
      sound: recordedSound,
      effectConfig: effectConfig,
      name: `Recording ${this.recordings.length + 1}`,
      timestamp: new Date().getTime()
    };
    this.recordings.push(recording);
    return this.recordings.length - 1;
  }
  
  //getting all recordings in the library
  getRecordings() {
    return this.recordings;
  }
  
  //selecting a recording from the library
  selectRecording(index) {
    if (index >= 0 && index < this.recordings.length) {
      this.selectedRecordingIndex = index;
      this.selectedSoundIndex = -1; 
      return true;
    }
    return false;
  }
  
  //getting the selected recording
  getSelectedRecording() {
    if (this.selectedRecordingIndex >= 0 && this.selectedRecordingIndex < this.recordings.length) {
      return this.recordings[this.selectedRecordingIndex];
    }
    return null;
  }
  
  //getting the selected recording index
  getSelectedRecordingIndex() {
    return this.selectedRecordingIndex;
  }
  
  //deleting a specific recording from the library
  deleteRecording(index) {
    if (index >= 0 && index < this.recordings.length) {
      const deletedRecording = this.recordings.splice(index, 1)[0];
      
      //adjusting selected recording index
      if (this.selectedRecordingIndex === index) {
        this.selectedRecordingIndex = -1;
      } else if (this.selectedRecordingIndex > index) {
        this.selectedRecordingIndex--;
      }
      
      return true;
    }
    return false;
  }
  
  //updating the effect configuration for a specific recording
  updateRecordingEffectConfig(index, config) {
    if (index >= 0 && index < this.recordings.length) {
      this.recordings[index].effectConfig = JSON.parse(JSON.stringify(config));
      return true;
    }
    return false;
  }
  
  //clearing all recordings in the library
  clearAllRecordings() {
    this.recordings = [];
    this.selectedRecordingIndex = -1;
  }
  
  //exporting the effect configuration of a sound as a json file
  exportConfiguration(soundIndex) {
    const config = this.loadEffectConfiguration(soundIndex);
    if (config) {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sound${soundIndex + 1}_config.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
  
  //importing effect configuration from a json file
  importConfiguration(soundIndex, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        this.saveEffectConfiguration(soundIndex, config);
      } catch (error) {
      }
    };
    reader.readAsText(file);
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////