import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

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
        // GitHub username or organization name
        async function getUserName() {
          const responseUser = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${credentialToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          const dataUsername: GithubUser = await responseUser.json();
          const username = dataUsername.login;
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
              navigate("/", {
                state: { repos: repos, photoUrl: result.user.photoURL },
              });
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
    <div className="flex w-full min-h-[100vh] bg-[#161B21] flex-col items-center justify-center gap-8">
      <div className="relative w-[50%] h-[300px] mb-16">
        <img
          src="/assets/login-robots.png"
          alt="Robot logo"
          className="object-contain w-full absolute top-0 left-0 animate-float z-[10]"
        />
        <div className="absolute z-[5] blob -top-[20px] -left-[30%] bg-blue-500 w-[120%] h-[350px] rounded-full opacity-70"></div>
      </div>
      <div className="flex flex-col gap-[4px] w-full items-center justify-center">
      <div className="text-[34px] font-[900] text-[#C9D1D9] ">GitHub Repository Insights</div>
      <div className="text-center text-[#C9D1D9]/60 max-w-[50%] px-4">
        Discover how to leverage advanced analytics to gain deep insights into
        your GitHub repositories. From tracking commit history to monitoring
        pull requests, we'll showcase powerful tools to elevate your project
        management and code quality
      </div>
      </div>
      {logged ? (
        <h1>Logged in</h1>
      ) : (
        <button className="mt-4  px-6 py-2 bg-blue-500 text-[#C9D1D9] rounded-[8px] hover:bg-blue-600 transition-colors" 
          onClick={login}>Github Login</button>
      )}
    </div>
  );
};

export default Login;
