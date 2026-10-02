////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////
class AudioManager {
  constructor() {
    //initializing variables for sound management
    this.sounds = [];
    this.currentSound = null;
    this.currentSoundIndex = -1;
    this.isPlaying = false;
    this.isLooping = false;
    this.recorder = null;
    this.recordedSound = null;
    this.isRecording = false;
    //setting default volume
    this.masterVolume = 0.5;  
    this.recordingStartTime = 0;
    //loading the sounds when the AudioManager is created
    this.loadSounds(); 
  }
  
  loadSounds() {
    //list of sound file paths
    const soundPaths = [
      './sound/sound1.mp3',
      './sound/sound2.mp3',
      './sound/sound3.mp3',
      './sound/sound4.mp3',
      './sound/sound5.mp3',
      './sound/sound6.mp3'
    ];
    
    //looping through the sound paths and loadingg them
    for (let i = 0; i < soundPaths.length; i++) {
      this.sounds.push({
        audio: loadSound(soundPaths[i]),  
        name: `Sound ${i + 1}`,           
        index: i                         
      });
    }
  }
  
  selectSound(index) {
    //selecting a sound based on the index
    if (index >= 0 && index < this.sounds.length) {
      //stoping current sound before selecting a new one
      this.stop(); 
      this.currentSoundIndex = index;
      this.currentSound = this.sounds[index].audio;
      //setting volume to master volume
      this.currentSound.setVolume(this.masterVolume);  
      return true;
    }
    return false; 
  }
  
  play() {
    //starting to playing the selected sound
    if (this.currentSound && !this.isPlaying) {
      //loop if isLooping is true
      this.currentSound.loop(this.isLooping);  
      this.isPlaying = true;
    }
  }
  
  pause() {
    //pausing the sound if it is currently playing
    if (this.currentSound && this.isPlaying) {
      this.currentSound.pause();
      this.isPlaying = false;
    }
  }
  
  togglePlayPause() {
    //toggle between play and pause
    if (this.currentSound) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  }
  
  stop() {
    //stoping the sound completely
    if (this.currentSound) {
      this.currentSound.stop();
      this.isPlaying = false;
    }
  }
  
  toggleLoop() {
    //toggle looping behavior
    this.isLooping = !this.isLooping;
    if (this.currentSound && this.isPlaying) {
      this.currentSound.setLoop(this.isLooping);
    }
    return this.isLooping;
  }
  
  skipToStart() {
    //skiping to the start of the current sound
    if (this.currentSound) {
      this.currentSound.jump(0);
    }
  }
  
  setMasterVolume(vol) {
    //seting the master volume for all sounds
    this.masterVolume = vol;
    if (this.currentSound) {
      this.currentSound.setVolume(vol);
    }
  }
  
  getCurrentSound() {
    //return the currently selected sound
    return this.currentSound;
  }
  
  getCurrentSoundIndex() {
    //returning the index of the currently selected sound
    return this.currentSoundIndex;
  }
  
  isCurrentlyPlaying() {
    //returning whether a sound is currently playing
    return this.isPlaying;
  }
  
  startRecording(processedAudio) {
    //starting recording the sound if it's playing
    if (!this.isRecording && processedAudio) {
      if (!this.isPlaying) {
        return false;
      }
      
      try {
        this.recorder = new p5.SoundRecorder();
        this.recordedSound = new p5.SoundFile();
        
        //connecting to the recorder to the audio source
        this.recorder.setInput(processedAudio);
        
        //start recording
        this.recorder.record(this.recordedSound);
        
        this.isRecording = true;
        this.recordingStartTime = millis();
        

        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
  
  stopRecording() {
    //stoping the recording if its in progress
    if (this.isRecording && this.recorder) {
      try {
        this.recorder.stop();
        this.isRecording = false;
        
        const recordingDuration = (millis() - this.recordingStartTime) / 1000;
        
        return new Promise((resolve) => {
          setTimeout(() => {
            if (this.recordedSound && this.recordedSound.buffer) {
              resolve(this.recordedSound);
            } else {
              resolve(null);
            }
          }, 300);
        });
      } catch (error) {
        this.isRecording = false;
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }
  
  saveRecordingAsWAV() {
    //saving the recorded sound as a wav file
    if (this.recordedSound && this.recordedSound.buffer) {
      try {
        const timestamp = new Date().getTime();
        const filename = `recording_${timestamp}.wav`;
        saveSound(this.recordedSound, filename);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
  
  getRecordingStatus() {
    //returning whether the recording is in progress
    return this.isRecording;
  }
  
  getRecordingDuration() {
    //returning the duration of the recording
    if (this.isRecording) {
      return ((millis() - this.recordingStartTime) / 1000).toFixed(1);
    }
    return 0;
  }
  
  getLastRecording() {
    //returning the last recorded sound
    return this.recordedSound;
  }
}
////////////////////////////////////////////////////////////////mycode///////////////////////////////////////////////////////////////