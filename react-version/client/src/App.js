import React, {useEffect, useState} from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from './axios/axios'

// axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// axios.defaults.withCredentials = true;



function App() {
  const [loginState, setLoginState] = useState(true);
  const [userid, setUserid] = useState("");

  const [loginPopUpState, setLoginPopUp] = useState("none");

  const [inputs, setInputs] = useState({
    idValue: "",
    pwValue: "",
  });

  //아이디 비밀번호 입력
  const { idValue, pwValue } = inputs;
  const onChange = (e) => {
    const { name, value } = e.target;
 
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const LoginPopBtn = (e) => {
    if (loginPopUpState ==="none"){
      setLoginPopUp("block");
    } else{
      setLoginPopUp("none");
    }
  };

  const registerAction = async () => {
    try {
      const response = await axios.post(
        '/api/auth/register',{
          username: idValue,
          password : pwValue
        },{ withCredentials: true }
      )
      console.log(response)
    } catch (e) {
      console.log(e);
    }
  };

  const loginAction = async () => {
    try {
      const response = await axios.post(
        '/api/auth/login',{
          username: idValue,
          password : pwValue
        },{ withCredentials: true }
      );
      console.log(response.data);
      if(response.data.state === "succes"){
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        localStorage.setItem("refreshToken",response.data.refreshToken);

      }
      alert("로그인 성공");
      document.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  }

  const accessToken = async () => {
    console.log("aaa")
    try {
      const response = await axios.get(
        '/api/auth/accesstoken',{ withCredentials: true }
      );
      console.log(response);
      // document.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.get(
        '/api/auth/refreshtoken',{ withCredentials: true }
      );
      // document.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  }

  const logoutBtn = async () => {
    try {
      const response = await axios.get(
        '/api/auth/logout',{ withCredentials: true }
      );
      document.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    try{
      axios.get(
        '/api/auth/loginsuccess',
        {withCredentials: true}
      )
      .then((result) => {
        if (result.data) {
          setLoginState(false)
          setUserid(result.data.id)
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error){
      console.log(error);
    }
  },[])
  
  return (
    <div className="App">
      <HeaderStyled>
        <MenuStyle>
          <LogoItemStyle fontSize='30px'>
            DEVOCEAN
          </LogoItemStyle>
          <MenuItemStyle>
            블로그 이름
          </MenuItemStyle>
          <MenuItemStyle>
            블로그 설명
          </MenuItemStyle>
          <MenuItemStyle>
            블로그 포스팅
          </MenuItemStyle>
        </MenuStyle>
        <MenuStyle>
          {
            loginState ? (
            <MenuItemStyle
              id="LoginPopBtn"
              onClick={LoginPopBtn}
              display="block"
            >
              로그인
            </MenuItemStyle>)
            :(<MenuItemStyle
              id="LogoutBtn"
              onClick={logoutBtn}
            >
              {userid}
            </MenuItemStyle>)
          }
        </MenuStyle>
      </HeaderStyled>
      <LoginPopUp display={loginPopUpState}>
          <LoginPop>
            <LoginText>로그인</LoginText>
            <CancelBtn 
              width='18px' 
              height='18px'
              onClick={LoginPopBtn}>
              닫기
            </CancelBtn>
            <div style={{
              position:"relative",
            }}>
              <Input 
                name="idValue" 
                placeholder="ID" 
                onChange={onChange} 
                value={idValue} 
              />
              <Input
                name="pwValue"
                placeholder="Password"
                onChange={onChange}
                value={pwValue}
                type="password"
              />
              <LoginPopUpBtn
                type="button"
                name=""
                onClick={loginAction}
                primary
                >
                로그인
              </LoginPopUpBtn>
              <LoginPopUpBtn
                type="button"
                name=""
                onClick={registerAction}
                >
                회원가입
              </LoginPopUpBtn>
            </div>
          </LoginPop>
        </LoginPopUp>
      <main>
        
      </main>
      <button onClick={accessToken}>acc</button>
      <button onClick={refreshToken}>re</button>
    </div>
  );
};



const HeaderStyled = styled.header`
    display : flex;
    justify-content:space-between;
    vertical-align: middle;
    color: black;
`;

const MenuStyle = styled.div`
    display:table
    color : White;
    justify-content:space-around;
    display : flex;
    padding: 20px;
`;

const LogoItemStyle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

const MenuItemStyle = styled.h2`
    font-size: 18px;  
    margin-left: 30px;
    font-weight: 600;
    align-self: center;
    color: black;
`;

const LoginPopUp = styled.div`
  display: ${(props) => props.display};
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999
`

const LoginPop = styled.div`
  width: 480px;
  height: 340px;
  border-radius: 16px;
  background: #fff;
  top: 50%;
  margin: 0 auto;
  position: relative;
  transform: translateY(-50%);
`

const LoginText = styled.h2`
  font-weight: 400;
  font-size: 24px;
  padding: 27px 0 25px 0;
  border-bottom: 1px solid #e2e2e2;
  width: 405px;
  margin: auto;
`

const CancelBtn = styled.button`
  width = ${(props) => props.width};
  height = ${(props) => props.height};
  position: absolute;
  background: #fff;
  top: 30px;
  right: 30px;
  boder: none
`

const Input = styled.input`
  display : block;
  font-size: 18px;
  width:80%;
  padding: 10px;
  margin: 0 auto;
  margin-top: 15px;
  border:none;
  border-bottom: solid;
`;

const LoginPopUpBtn = styled.button`
  display : block;
  font-size:18px;
  width:85%;
  padding: 10px 0px;
  margin: auto;
  margin: 0 auto;
  margin-top: 15px;
  border:none;
  border-radius: 5px;
  background: ${props => props.primary ? "#33b49e" : "white"};
  color: ${props => props.primary ? "white" : "#33b49e"};
`;

export default App;
