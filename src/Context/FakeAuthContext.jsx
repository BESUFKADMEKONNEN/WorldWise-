import { useContext, useReducer } from "react";
import Login from "../pages/Login";
import { createContext } from "react";
// const FAKE_USER = {
//     name: "besufkad",
//     email: "besu@gmail.com",
//     password: "abc123",
//     avatar: "https://i.pravatar.cc/100?u=zz",
//   };

const FAKE_USER = {
  name: "besu",
  email: "besu@gmail.com",
  password: "abc123",
  avatar: "https://i.pravatar.cc/100?u=zz",
};


const FakeAuthContext=createContext()
function FakeAuthProvider({ children }) {
  const initialStates = { user: null, isAuthenticated: false };
  function reducer(state, action) {
    switch (action.type) {
      case "login":
        return { ...state, user: action.payload, isAuthenticated: true };
      case "logout":
        return { ...state, user: null, isAuthenticated: false };
      default:
        throw new Error("unknown action");
    }
  }

  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialStates
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <FakeAuthContext.Provider value={{ login, logout,user,isAuthenticated }}>
      {children}
    </FakeAuthContext.Provider>
  );
}
function useFakeAuth() {
  const context = useContext(FakeAuthContext);
  if (context === undefined)
    throw new Error(
      "FakeAuthContextProvide context used outside FakeAuthContextProvide provider"
    );

  return context;
}

export {FakeAuthProvider,useFakeAuth}
