import React, {useState ,useEffect} from 'react'
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from '../utils/APIRoutes';
function Chat() {
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const[currentUser,setCurrentUser] = useState(undefined);
  useEffect(async ()=>{
    if(!localStorage.getItem("Connectly User")){
    navigate("/login");
  } else{
    setCurrentUser(await JSON.parse(localStorage.getItem("Connectly User")));
  }
},[])
  useEffect(async ()=>{
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        const data = axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);

      }else{
        navigate("/setavatar");
      }
    }
  },[currentUser])
  return (
    <Container>
      <div className="container">

      </div>
    </Container>
  )
}
const Container = styled.div`
height:100vh;
width:100vw;
display: flex;
  flex-direction: column;
  justify-content: center;
  gap:1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height:85vh;
    width:80vw;
    background-color:#00000076;
    display: flex;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and(max-width:1080px)
    grid-template-columns 35% 65%; 
        @media screen and (min-width:360px) and(max-width:480px)
    grid-template-columns 35% 65%;
    
  }
`;
export default Chat