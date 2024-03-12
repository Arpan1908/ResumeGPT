import React, { useState } from "react";
import { database } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [login, setLogin] = useState(false);

  const history = useNavigate();

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type === "signup") {
      createUserWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/resume");
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      signInWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/resume");
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };

  const handleReset = () => {
    history("/reset");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Registration and login Screen */}
      <div className="flex mb-4 gap-between">
        <button
          className={login ? "text-blue-500 cursor-pointer" : "cursor-pointer"}
          onClick={() => setLogin(false)}
        >
          SignUp
        </button>
        <button
          className={!login ? "text-blue-500 cursor-pointer" : "cursor-pointer"}
          onClick={() => setLogin(true)}
        >
          SignIn
        </button>
      </div>
      <h1 className="text-2xl mb-4">{login ? "SignIn" : "SignUp"}</h1>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create and account
              </h1>
      <form
        onSubmit={(e) => handleSubmit(e, login ? "signin" : "signup")}
        className="space-y-4 md:space-y-6"
      >
        <input
          name="email"
          placeholder="Email"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <p className="text-blue-500 cursor-pointer mb-4" onClick={handleReset}>
          Forgot Password?
        </p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md">
          {login ? "SignIn" : "SignUp"}
        </button>
      </form>
      </div>
      </div>
    </div>
  );
}
export default Register;
