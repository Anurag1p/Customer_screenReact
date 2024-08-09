import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


const VideoStream = () => {
  const videoRef = useRef(null);
  const playButtonRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlayButtonClick = () => {
      if (videoRef.current) {
        videoRef.current.style.display = 'block'; // Make the video visible
        videoRef.current.play().then(() => {
          // Video playback started; try to request fullscreen
          requestFullScreen(videoRef.current);
        }).catch(err => {
          console.error("Playback was prevented.", err);
          // Handle playback failure, e.g., show a message to the user
        });
        setIsPlaying(true);
      }
    };

    const requestFullScreen = (element) => {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    };

    if (playButtonRef.current) {
      playButtonRef.current.addEventListener('click', handlePlayButtonClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (playButtonRef.current) {
        playButtonRef.current.removeEventListener('click', handlePlayButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.display = 'block'; // Make the video visible
      videoRef.current.play().then(() => {
        // Video playback started; try to request fullscreen
        requestFullScreen(videoRef.current);
      }).catch(err => {
        console.error("Playback was prevented.", err);
        // Handle playback failure, e.g., show a message to the user
      });
    }
  }, [isPlaying]);

  return (
    <div>
      <video ref={videoRef} controls style={{ display: 'none' }}>
        <source src="./static/img/Grocery_Store_Tour_The_Produce_Section.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button ref={playButtonRef} style={{ display: isPlaying ? 'none' : 'block' }}>
        Play Video
      </button>
      <div className="centerChild">
        <div className="textBox" role="alert">
          <p className="counterText">Counter Closed !!</p>
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
