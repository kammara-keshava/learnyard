import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarLandingPage from "../components/NavbarLandingPage";

const LogIn = () => {
  const { userdata, fetchUserdata, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState({
    role: "user",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------- FRONTEND VALIDATION --------
    if (!currUser.email.trim() || !currUser.password.trim()) {
      toast.error("Please enter both email and password", {
        position: "top-center",
      });
      return;
    }
    // ------------------------------------

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${currUser.role}/login`,
        {
          role: currUser.role,
          email: currUser.email,
          password: currUser.password,
        }
      );

      // If we reached here, credentials are correct (2xx)
      const { token } = res.data;
      localStorage.setItem("token", token);
      fetchUserdata();

      toast.success("Successfully logged in", {
        position: "top-center",
      });
      // navigate will happen in useEffect once userdata is set
    } catch (err) {
      console.log(err);

      if (err.response) {
        const status = err.response.status;
        const backendMsg = err.response.data?.message;

        if (status === 400 || status === 401) {
          // wrong password / invalid credentials
          toast.error(backendMsg || "Invalid email or password", {
            position: "top-center",
          });
        } else if (status === 404) {
          // user not found
          toast.error(backendMsg || "User not found", {
            position: "top-center",
          });
        } else {
          toast.error(backendMsg || "Login failed, please try again", {
            position: "top-center",
          });
        }
      } else {
        toast.error("Network error, please check your connection", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userdata) {
      navigate("/course");
    }
  }, [userdata, navigate]);

  return (
    <>
      <NavbarLandingPage logout={logout} />
      {/* ToastContainer should ALWAYS be rendered */}
      <ToastContainer />

      <Container>
        <Heading>Log In</Heading>
        <Content>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label htmlFor="role">Role</Label>
              <Select
                name="role"
                id="role"
                value={currUser.role}
                onChange={(e) => {
                  setCurrUser({ ...currUser, role: e.target.value });
                }}
              >
                <StyledOption value="user">User</StyledOption>
                <StyledOption value="instructor">Instructor</StyledOption>
                <StyledOption value="admin">Admin</StyledOption>
              </Select>
            </InputWrapper>

            <InputWrapper>
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
                name="email"
                id="email"
                value={currUser.email}
                onChange={(e) => {
                  setCurrUser({ ...currUser, email: e.target.value });
                }}
              />
            </InputWrapper>

            <InputWrapper>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={currUser.password}
                onChange={(e) => {
                  setCurrUser({ ...currUser, password: e.target.value });
                }}
              />
            </InputWrapper>

            <br />
            <br />
            <br />

            <Button className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Submit"}
            </Button>

            <Signnow>
              Don't have an account?
              <NavLink to="/SignUp"> Sign Up</NavLink>
            </Signnow>
          </Form>
        </Content>

        {loading && (
          <div className="toaster">
            <span className="loader" />
            Backend call in progress...
          </div>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 600px;
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin: 30px auto 30px auto;
  border-radius: 10px;
  box-shadow: 1px 1px 4px #ccc;
  background-color: #fff;

  .loader {
    display: inline-block;
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .toaster {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    z-index: 100000;
    display: flex;
    align-items: center;
    animation: slideIn 0.5s ease-in-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 15px;
`;

const StyledOption = styled.option`
  color: #1732ac;
  background-color: white;
`;

const Heading = styled.div`
  font-size: 28px;
  text-align: center;
  color: black;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Content = styled.div`
  width: 90%;
`;

const Form = styled.form`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Input = styled.input`
  height: 40px;
  width: 100%;
  margin-top: 5px;
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const Button = styled.button`
  height: 40px;
  width: 100%;
  color: white;
  border-radius: 5px;
  background-color: #1732ac;
  border: none;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #3c56cd;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Signnow = styled.div`
  margin-top: 10px;
  a {
    text-decoration: none;
    color: #383fa0;
  }
`;

export default LogIn;
