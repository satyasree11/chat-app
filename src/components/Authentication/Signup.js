import React,{useState} from 'react';
import { FormControl, FormLabel, Input, InputGroup, InputRightElement,Button, VStack, useToast } from '@chakra-ui/react';
import { useHistory } from "react-router";
import axios from "axios";


const Signup = () => {
  const [show,setShow]= useState(false);
  const [name, setName]= useState()
  const [email, setEmail]= useState()
  const [confirmpassword, setConfirmpassword]= useState()
  const [password, setPassword]= useState()
  const history = useHistory();
  

  const [picLoading, setPicLoading] = useState(false);  const toast = useToast();
  const [pic, setPic]= useState()
  const handleClick=() => setShow(!show);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
   const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dfrugsxzs");
      fetch("https://api.cloudinary.com/v1_1/dfrugsxzs/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return <VStack spacing="5px" >
    
    <FormControl id="first-name" isRequired>
      <FormLabel>Name</FormLabel>
      <Input 
      placeholder=" Enter your name"
      onChange={(e)=>setName(e.target.value)}
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel>Email</FormLabel>
      <Input 
      placeholder=" Enter your email"
      onChange={(e)=>setEmail(e.target.value)}
      />
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup size="md">
      <Input 
      type={show ? "text": "password"}
      placeholder=" Enter your password"
      onChange={(e)=>setPassword(e.target.value)}
      />
      <InputRightElement width="4,5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show? "Hide": "Show"}
        </Button>
      </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id=" password" isRequired>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup size="md">
      <Input 
      type={show ? "text": "password"}
      placeholder=" ConfirmPassword"
      onChange={(e)=>setConfirmpassword(e.target.value)}
      />
      <InputRightElement width="4,5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show? "Hide": "Show"}
        </Button>
      </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading
        }

        
      >
        Sign Up
      </Button>
  </VStack>
}

export default Signup;
