import {
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { Chart } from "./Chart";
// Define types for the data fetched from GitHub
interface Repo {
  name: string;
  html_url: string;
  description: string;
}

interface GithubUser {
  login: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const provider = new GithubAuthProvider();
  provider.addScope("repo");

  const [logged] = useState<boolean>(false);

  async function login() {
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Get the credential to extract the access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const credentialToken = credential?.accessToken;

      if (credentialToken) {
        console.log("credential access token", credentialToken);
        console.log(result.user);

        // GitHub username or organization name

        async function getUserName() {
          const responseUser = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${credentialToken}`,
              "Accept": "application/vnd.github.v3+json",
            },
          });

          const dataUsername: GithubUser = await responseUser.json();
          console.log("API to get username is given below", dataUsername);

          const username = dataUsername.login;
          console.log(username);

          async function fetchRepos() {
            console.log(username);
            const url = `https://api.github.com/users/${username}/repos`; // For a user
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const repos: Repo[] = await response.json();
              console.log("Repositories:", repos);
              navigate("/", { state: { repos: repos } });
            } else {
              console.error(
                "Error fetching repositories:",
                response.status,
                response.statusText
              );
            }
          }
          fetchRepos();
        }
        getUserName();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {logged ? (
        <h1>Logged in</h1>
      ) : (
        <button onClick={login}>Github Login</button>
      )}
      <Chart />
    </div>
  );
};

export default Login;
