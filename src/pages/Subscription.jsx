import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "./Firebase";
import { initFirebase } from "./Firebase";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth"; // Import signOut from firebase/auth

const Subscription = () => {
  const app = initFirebase();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check if user is signed in
    if (!auth.currentUser) {
      navigate("/register"); // Redirect to sign-in page if not signed in
    }
  }, [auth.currentUser, navigate]);

  useEffect(() => {
    const fetchEmail = async () => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email);
      } else {
        // Redirect to sign-in page if user is not logged in
        navigate("/register");
      }
    };
    fetchEmail();
  }, [auth.currentUser, navigate]);

  const upgradeToPremium = async () => {
    // Implement upgrade logic
  };

  const manageSubscription = async () => {
    // Implement manage subscription logic
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth); // Sign out using Firebase auth
      navigate("/register"); // Redirect to sign-in page after signing out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <h2>Welcome, {email}</h2>
      <button onClick={upgradeToPremium}>Upgrade to Premium</button>
      <button onClick={manageSubscription}>Manage Subscription</button>
      <button onClick={signOut}>Sign Out</button>
      <div>
        <stripe-pricing-table
          pricing-table-id="prctbl_1OiY7ISFOw7Ey39fAmjVjhHe"
          publishable-key="pk_test_51MzFD7SFOw7Ey39fBis2AB55FOOtfhr9NFRCAUVfwQYam9bp03MSvvpsxzWmKcVXkmE9gteq4DFwTKJEKx9lZCii00Cfmat261"
        ></stripe-pricing-table>
      </div>
    </div>
  );
};

export default Subscription;
