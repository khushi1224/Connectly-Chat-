import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from "../assets/loader.gif";
import { setAvatarRoute } from '../utils/APIRoutes';
import { useNavigate } from "react-router-dom";

export default function SetAvatar() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const fetchUserAndAvatars = async () => {
            const user = JSON.parse(localStorage.getItem("Connectly User"));

            if (!user || !user._id) {
                navigate("/login");
            } else {
                await fetchAvatars();
            }
        };

        fetchUserAndAvatars();
    }, [navigate]);

    const fetchAvatars = async () => {
        try {
            setIsLoading(true);
            const data = [];
            for (let i = 0; i < 4; i++) {
                const response = await axios.get(`https://api.multiavatar.com/2367826/${Math.round(Math.random() * 1000)}`, { responseType: 'arraybuffer' });
                const base64 = arrayBufferToBase64(response.data);
                data.push(base64);
            }
            setAvatars(data);
        } catch (error) {
            console.error("Error fetching avatars:", error);
            toast.error("Failed to load avatars", toastOptions);
        } finally {
            setIsLoading(false);
        }
    };

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            try {
                const user = JSON.parse(localStorage.getItem("Connectly User"));
                if (!user || !user._id) {
                    toast.error("User not found. Please log in again.", toastOptions);
                    navigate("/login");
                    return;
                }

                const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                    image: avatars[selectedAvatar],
                });

                if (data.isSet) {
                    user.isAvatarImageSet = true;
                    user.avatarImage = data.image;
                    localStorage.setItem("Connectly User", JSON.stringify(user));
                    navigate("/");
                } else {
                    toast.error("Failed to set avatar. Please try again!", toastOptions);
                }
            } catch (error) {
                console.error("Error setting profile picture:", error);
                toast.error("An error occurred. Please try again!", toastOptions);
            }
        }
    };

    const arrayBufferToBase64 = (arrayBuffer) => {
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => (
                            <div
                                className={`avatar ${
                                    selectedAvatar === index ? "selected" : ""
                                }`}
                                key={index}
                                onClick={() => setSelectedAvatar(index)}
                            >
                                <img
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      cursor: pointer;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
