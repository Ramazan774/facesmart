import React, { useState, useEffect } from "react";
import * as faceapi from '@vladmandic/face-api';
import ParticlesBg from "particles-bg";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import Navigation from "../components/Navigation/Navigation";
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";
import Logo from "../components/Logo/Logo";
import Rank from "../components/Rank/Rank";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadModels();
    checkSavedSession();
  }, []);

  const checkSavedSession = () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsSignedIn(true);
        setRoute('home');
        console.log('User session restored');
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  };

  const loadModels = async () => {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
      console.log('Face detection models loaded');
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const loadUser = (data) => {
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const calculateFaceLocation = (detection) => {
    const image = document.getElementById("inputimage");
    const displayedWidth = Number(image.width);
    const displayedHeight = Number(image.height); 

    const originalWidth = Number(image.naturalWidth);
    const originalHeight = Number(image.naturalHeight);

    const box = detection.box;
    
    const scaleX = displayedWidth / originalWidth;
    const scaleY = displayedHeight / originalHeight;

    return {
      leftCol: box.x * scaleX,
      topRow: box.y * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = async () => {
    
    if (!modelsLoaded) {
      alert('Face detection models are still loading. Please wait...');
      return;
    }

    if (!input.trim()) {
      alert('Please enter an image URL!');
      return;
    }
    setImageUrl(input);
    
    setTimeout(() => {
      const img = document.getElementById("inputimage");
      
      if (!img) {
        console.error('Image element not found');
        return;
      }

      const waitForImageLoad = () => {
        if (img.complete && img.naturalWidth > 0) {
          detectFaces(img);
        } else {
          img.onload = () => {
            detectFaces(img);
          };
          img.onerror = (e) => {
            alert('Failed to load image. Try a different URL or use images from Unsplash.');
          };
        }
      };
      waitForImageLoad();
    }, 500);
  };

  const detectFaces = async (img) => {
    try {
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
        alert('Image failed to load. Please try again.');
        return;
      }

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      
      if (detections && detections.length > 0) {
        const token = localStorage.getItem('token');
        
        try {
          const response = await fetch(`${API_URL}/image`, {
            method: "put",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              id: user.id,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update count');
          }
          
          const count = await response.json();
          
          const updatedUser = { ...user, entries: count };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Error updating count:', err);
        }
        
        const box = calculateFaceLocation(detections[0].detection);
        displayFaceBox(box);
      } else {
        alert('No faces detected in this image. Try another one!');
      }
    } catch (error) {
      alert('Error detecting face: ' + error.message);
    }
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setInput("");
      setImageUrl("");
      setBox({});
      setRoute("signin");
      setIsSignedIn(false);
      setUser({
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      });
    } else if (route === "home") {
      setIsSignedIn(true);
      setRoute(route);
    } else {
      setRoute(route);
    }
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home'
        ? <div>
            <Logo />
            <Rank
              name={user.name}
              entries={user.entries}
            />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
            {!modelsLoaded && (
              <p style={{ color: 'white' }}>Loading face detection models...</p>
            )}
          </div>
        : (
          route === 'signin'
            ? <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          )
      }
    </div>
  );
}

export default App;