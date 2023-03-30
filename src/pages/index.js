import React, { useRef, useState, useEffect, useCallback } from 'react';
import { isMobile } from 'react-device-detect';

import { initializeIcons } from '@fluentui/font-icons-mdl2';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Inter } from 'next/font/google'

import styles from '@/styles/Home.module.scss'

const inter = Inter({ weight: '400', subsets: ['latin'] })
const interBold = Inter({ weight: '700', subsets: ['latin'] })

initializeIcons();

export default function Home(requestedMedia) {
  
  const remoteVideoRef = useRef();

  const [cameraDevices, setCamera] = React.useState('');
  const [audioOutputDevices, setAudioOutput] = React.useState('');
  const [audioInputDevices, setAudioInput] = React.useState('');
  const [mediaStream, setMediaStream] = React.useState('');
  
  let cameraMode = isMobile
	? {
			facingMode: "user",
	  }
	: true
  const webRtcConstraints = {
    audio: true,
    video: cameraMode,
  }

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(webRtcConstraints);
        setMediaStream(stream);

        if (mediaStream && videoRef.current && !remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = mediaStream;
        }
      } catch(err) {
        
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [mediaStream, webRtcConstraints]);

  const handleCameraChange = (event) => {
    setCamera(event.target.value);
  };
  const handleAudioOuputChange = (event) => {
    setAudioOutput(event.target.value);
  };
  const handleAudioInputChange = (event) => {
    setAudioInput(event.target.value);
  };
  
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      
      <main className={styles.main}>
        
        <div className={styles.left}>
          
          <div className={styles.cameraOff}>
            <span className={styles.icon}>Your camera is turned off</span>
						<video
							id={"remote-video"}
							className={styles.remoteVideo}
							autoPlay={true}
							playsInline={true}
              ref={remoteVideoRef}
						></video>
          </div>

          <div className={styles.video}>
            <div className={styles.controls}>
              <button type={"button"} className={`${styles.mute} ${styles.muted}`}><i></i>Unmute</button>
              <button type={"button"} className={`${styles.camera} ${styles.off}`}><i></i>Turn On</button>
            </div>
          </div>
          
        
        </div>

        <div className={`${styles.right}`}>
          <h1 className={interBold.className}>Start a Call</h1>
          <div className={styles.config}>

            <div className={styles.fieldGroup}>
              <label>Camera</label>
              
              <FormControl className={styles.selectMenu}>
                <InputLabel id="camera-label">Macbook Pro Camera</InputLabel>
                <Select
                  labelId="camera-label"
                  id=""
                  value={cameraDevices}
                  label=""
                  onChange={handleCameraChange}
                  className={styles.cameraSelect}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Macbook Pro Camera</MenuItem>
                  <MenuItem value={20}>Macbook Pro Camera</MenuItem>
                  <MenuItem value={30}>Macbook Pro Camera</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={styles.fieldGroup}>
              <label>Sound</label>
              <FormControl className={styles.selectMenu}>
                <InputLabel id="speaker-label">Internal Mic and Speakers</InputLabel>
                <Select
                  labelId="speaker-label"
                  id=""
                  value={audioOutputDevices}
                  label=""
                  onChange={handleAudioOuputChange}
                  className={styles.audioOutputSelect}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Macbook Pro Speakers</MenuItem>
                  <MenuItem value={20}>Headphones</MenuItem>
                </Select>
              </FormControl>
            
              <FormControl className={styles.selectMenu}>
                <InputLabel id="mic-label">Macbook Pro Microphone</InputLabel>
                <Select
                  labelId="mic-label"
                  id=""
                  value={audioInputDevices}
                  label=""
                  onChange={handleAudioInputChange}
                  className={styles.audioInputSelect}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Macbook Pro Mic</MenuItem>
                  <MenuItem value={20}>External Mic</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={styles.fieldGroup}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Blur my background" />
            </div>

            <Button variant="contained">Join Now</Button>
          </div>

        </div>
        
      </main>
    </>
  )
}
