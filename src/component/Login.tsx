import {
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
// import { Chart } from "./Chart";
import { motion } from "framer-motion";
import { PullRequestChart } from "./PR_Chaart";
// Define types for the data fetched from GitHub
interface Repo {
  name: string;
  html_url: string;
  description: string;
}

interface GithubUser {
  login: string;
}


const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

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
        console.log('photo url is', result.user.photoURL)
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
              navigate("/", { state: { repos: repos, photoUrl: result.user.photoURL } });
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
      <motion.svg
        width="600"
        height="600"
        viewBox="0 0 600 600"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          stroke="#ff0055"
          variants={draw}
          custom={1}
        />
        <motion.line
          x1="220"
          y1="30"
          x2="360"
          y2="170"
          stroke="#00cc88"
          variants={draw}
          custom={2}
        />
        <motion.line
          x1="220"
          y1="170"
          x2="360"
          y2="30"
          stroke="#00cc88"
          variants={draw}
          custom={2.5}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="30"
          rx="20"
          stroke="#0099ff"
          variants={draw}
          custom={3}
        />
        <motion.circle
          cx="100"
          cy="300"
          r="80"
          stroke="#0099ff"
          variants={draw}
          custom={2}
        />
        <motion.line
          x1="220"
          y1="230"
          x2="360"
          y2="370"
          stroke="#ff0055"
          custom={3}
          variants={draw}
        />
        <motion.line
          x1="220"
          y1="370"
          x2="360"
          y2="230"
          stroke="#ff0055"
          custom={3.5}
          variants={draw}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="230"
          rx="20"
          stroke="#00cc88"
          custom={4}
          variants={draw}
        />
        <motion.circle
          cx="100"
          cy="500"
          r="80"
          stroke="#00cc88"
          variants={draw}
          custom={3}
        />
        <motion.line
          x1="220"
          y1="430"
          x2="360"
          y2="570"
          stroke="#0099ff"
          variants={draw}
          custom={4}
        />
        <motion.line
          x1="220"
          y1="570"
          x2="360"
          y2="430"
          stroke="#0099ff"
          variants={draw}
          custom={4.5}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="430"
          rx="20"
          stroke="#ff0055"
          variants={draw}
          custom={5}
        />
      </motion.svg>
      <motion.svg width="384.201" height="97.2" viewBox="0 0 384.201 97.2" initial="hidden"
        animate="visible" variants={draw}
        custom={6}>
        <motion.g stroke-linecap="round" fill-rule="evenodd" font-size="9pt" stroke="#000" stroke-width="0.25mm" fill="#000" style={{ stroke: "#000" }}>
          <motion.path d="M 217.8 95.2 L 219.8 87.7 A 9.908 9.908 0 0 0 220.965 88.274 Q 221.788 88.619 222.8 88.9 A 13.514 13.514 0 0 0 225.079 89.317 A 17.358 17.358 0 0 0 226.8 89.4 Q 231 89.4 234.3 86.7 A 12.003 12.003 0 0 0 236.233 84.639 Q 237.981 82.328 239.641 78.475 A 58.58 58.58 0 0 0 240.6 76.1 L 242.9 70.1 L 238.1 70.1 L 217.8 24.4 L 225.8 20.8 L 245.2 64.1 L 260.3 21.2 L 268.6 24.4 L 249.5 76.6 A 71.728 71.728 0 0 1 247.447 81.686 Q 246.345 84.126 245.178 86.114 A 30.86 30.86 0 0 1 243.2 89.1 A 24.268 24.268 0 0 1 240.322 92.311 Q 238.408 94.079 236.305 95.118 A 14.737 14.737 0 0 1 235.7 95.4 Q 231.6 97.2 226.6 97.2 Q 223.6 97.2 221.35 96.6 Q 219.1 96 217.8 95.2 Z M 82.8 74 L 73.8 74 L 73.8 22 L 82.5 22 L 82.5 30.7 Q 85.3 26.5 89.65 23.65 A 17.316 17.316 0 0 1 96.756 21.025 A 22.629 22.629 0 0 1 100 20.8 A 23.225 23.225 0 0 1 105.065 21.318 Q 110.159 22.456 113.15 26.1 Q 117.275 31.126 117.488 39.209 A 33.764 33.764 0 0 1 117.5 40.1 L 117.5 74 L 108.5 74 L 108.5 41.1 A 19.265 19.265 0 0 0 108.158 37.359 Q 107.719 35.145 106.719 33.397 A 10.966 10.966 0 0 0 105.85 32.1 A 8.579 8.579 0 0 0 99.573 28.747 A 12.061 12.061 0 0 0 98.5 28.7 A 13.122 13.122 0 0 0 91.651 30.664 A 17.353 17.353 0 0 0 89.8 31.95 Q 85.7 35.2 82.8 39.6 L 82.8 74 Z M 64.8 71.5 L 56.1 75 L 48.3 55 L 15.9 55 L 8.1 74.8 L 0 71.5 L 27.4 4 L 37.8 4 L 64.8 71.5 Z M 273.1 69.8 L 276.9 62.3 A 18.557 18.557 0 0 0 280.044 64.426 Q 281.598 65.27 283.45 65.95 A 24.073 24.073 0 0 0 291.061 67.387 A 27.464 27.464 0 0 0 291.9 67.4 Q 297.292 67.4 300.135 65.685 A 7.738 7.738 0 0 0 300.35 65.55 Q 303.2 63.7 303.2 60.8 A 7.123 7.123 0 0 0 302.886 58.653 A 6.212 6.212 0 0 0 302.15 57.1 A 6.384 6.384 0 0 0 301.221 56.006 Q 300.207 55.034 298.534 54.081 A 22.3 22.3 0 0 0 298.3 53.95 A 28.462 28.462 0 0 0 296.306 52.957 Q 294.19 51.995 291.201 50.946 A 103.602 103.602 0 0 0 290.2 50.6 A 46.616 46.616 0 0 1 285.802 48.857 Q 283.688 47.883 282.012 46.795 A 19.335 19.335 0 0 1 279.25 44.65 A 11.324 11.324 0 0 1 275.956 38.654 A 16.794 16.794 0 0 1 275.6 35.1 Q 275.6 29.1 280.85 24.95 Q 285.254 21.469 292.508 20.908 A 37.527 37.527 0 0 1 295.4 20.8 A 40.794 40.794 0 0 1 299.846 21.031 Q 302.154 21.284 304.17 21.815 A 25.234 25.234 0 0 1 304.3 21.85 Q 308.2 22.9 311.3 24.5 L 308.8 31.9 Q 306.1 30.3 302.65 29.3 A 25.024 25.024 0 0 0 298.167 28.453 A 31.837 31.837 0 0 0 295 28.3 A 20.632 20.632 0 0 0 292.063 28.495 Q 288.977 28.94 287.1 30.4 A 9.322 9.322 0 0 0 285.742 31.673 Q 285.04 32.492 284.705 33.365 A 4.529 4.529 0 0 0 284.4 35 A 4.921 4.921 0 0 0 285.895 38.552 A 7.082 7.082 0 0 0 286.5 39.1 Q 288.565 40.772 294.498 42.734 A 84.459 84.459 0 0 0 294.7 42.8 A 67.753 67.753 0 0 1 299.762 44.698 Q 305.689 47.217 308.5 50.1 Q 312.4 54.1 312.4 60.1 Q 312.4 66.848 307.149 70.855 A 16.618 16.618 0 0 1 306.75 71.15 Q 302.01 74.547 294.562 75.095 A 40.423 40.423 0 0 1 291.6 75.2 Q 285.7 75.2 280.95 73.7 A 30.883 30.883 0 0 1 277.11 72.215 Q 275.129 71.284 273.548 70.136 A 18.229 18.229 0 0 1 273.1 69.8 Z M 344.9 69.8 L 348.7 62.3 A 18.557 18.557 0 0 0 351.844 64.426 Q 353.398 65.27 355.25 65.95 A 24.073 24.073 0 0 0 362.861 67.387 A 27.464 27.464 0 0 0 363.7 67.4 Q 369.092 67.4 371.935 65.685 A 7.738 7.738 0 0 0 372.15 65.55 Q 375 63.7 375 60.8 A 7.123 7.123 0 0 0 374.686 58.653 A 6.212 6.212 0 0 0 373.95 57.1 A 6.384 6.384 0 0 0 373.021 56.006 Q 372.007 55.034 370.334 54.081 A 22.3 22.3 0 0 0 370.1 53.95 A 28.462 28.462 0 0 0 368.106 52.957 Q 365.99 51.995 363.001 50.946 A 103.602 103.602 0 0 0 362 50.6 A 46.616 46.616 0 0 1 357.602 48.857 Q 355.488 47.883 353.812 46.795 A 19.335 19.335 0 0 1 351.05 44.65 A 11.324 11.324 0 0 1 347.756 38.654 A 16.794 16.794 0 0 1 347.4 35.1 Q 347.4 29.1 352.65 24.95 Q 357.054 21.469 364.308 20.908 A 37.527 37.527 0 0 1 367.2 20.8 A 40.794 40.794 0 0 1 371.646 21.031 Q 373.954 21.284 375.97 21.815 A 25.234 25.234 0 0 1 376.1 21.85 Q 380 22.9 383.1 24.5 L 380.6 31.9 Q 377.9 30.3 374.45 29.3 A 25.024 25.024 0 0 0 369.967 28.453 A 31.837 31.837 0 0 0 366.8 28.3 A 20.632 20.632 0 0 0 363.863 28.495 Q 360.777 28.94 358.9 30.4 A 9.322 9.322 0 0 0 357.542 31.673 Q 356.84 32.492 356.505 33.365 A 4.529 4.529 0 0 0 356.2 35 A 4.921 4.921 0 0 0 357.695 38.552 A 7.082 7.082 0 0 0 358.3 39.1 Q 360.365 40.772 366.298 42.734 A 84.459 84.459 0 0 0 366.5 42.8 A 67.753 67.753 0 0 1 371.562 44.698 Q 377.489 47.217 380.3 50.1 Q 384.2 54.1 384.2 60.1 Q 384.2 66.848 378.949 70.855 A 16.618 16.618 0 0 1 378.55 71.15 Q 373.81 74.547 366.362 75.095 A 40.423 40.423 0 0 1 363.4 75.2 Q 357.5 75.2 352.75 73.7 A 30.883 30.883 0 0 1 348.91 72.215 Q 346.929 71.284 345.348 70.136 A 18.229 18.229 0 0 1 344.9 69.8 Z M 168.6 26.2 L 168.6 22 L 176.8 22 L 176.8 61.4 A 12.15 12.15 0 0 0 176.902 63.036 Q 177.234 65.47 178.65 66.35 Q 180.5 67.5 182.7 67.5 L 180.8 74.5 A 17.722 17.722 0 0 1 176.535 74.028 Q 170.898 72.628 169.303 67.08 A 13.59 13.59 0 0 1 169.2 66.7 A 21.307 21.307 0 0 1 166.09 70.126 A 28.498 28.498 0 0 1 162.95 72.55 Q 159 75.2 152.9 75.2 Q 146.4 75.2 141.1 71.9 A 22.947 22.947 0 0 1 133.687 64.373 A 27.923 27.923 0 0 1 132.65 62.55 A 27.228 27.228 0 0 1 130.02 54.608 A 36.644 36.644 0 0 1 129.5 48.3 A 33.142 33.142 0 0 1 130.497 40.031 A 27.968 27.968 0 0 1 132.65 34.3 Q 135.8 28.1 141.35 24.45 A 22.297 22.297 0 0 1 152.545 20.844 A 27.388 27.388 0 0 1 154.1 20.8 A 22.584 22.584 0 0 1 158.894 21.29 A 18.703 18.703 0 0 1 162.25 22.35 A 26.002 26.002 0 0 1 166.537 24.644 A 22.103 22.103 0 0 1 168.6 26.2 Z M 194.2 57.7 L 194.2 0 L 203.2 0 L 203.2 56.8 A 20.644 20.644 0 0 0 203.388 59.688 Q 203.85 62.952 205.45 64.8 A 7.363 7.363 0 0 0 210.034 67.276 A 10.724 10.724 0 0 0 211.7 67.4 Q 213.6 67.4 215.45 66.95 A 22.192 22.192 0 0 0 216.913 66.544 Q 217.848 66.247 218.6 65.9 L 220.8 73.2 Q 219.401 73.822 217.488 74.323 A 34.978 34.978 0 0 1 216.35 74.6 A 23.816 23.816 0 0 1 213.195 75.085 A 30.514 30.514 0 0 1 210.5 75.2 A 20.862 20.862 0 0 1 205.61 74.646 A 17.544 17.544 0 0 1 202.2 73.45 A 12.683 12.683 0 0 1 196.875 68.685 A 15.856 15.856 0 0 1 196.35 67.8 Q 194.616 64.654 194.28 60.012 A 32.105 32.105 0 0 1 194.2 57.7 Z M 333.4 74 L 324.4 74 L 324.4 22 L 333.4 22 L 333.4 74 Z M 167.8 60.7 L 167.8 32.8 Q 165.1 30.9 161.85 29.75 Q 158.6 28.6 155 28.6 A 15.924 15.924 0 0 0 150.029 29.354 A 14.024 14.024 0 0 0 146.55 31.05 A 16.301 16.301 0 0 0 141.531 36.474 A 19.962 19.962 0 0 0 140.8 37.85 A 20.663 20.663 0 0 0 139.047 43.527 A 27.678 27.678 0 0 0 138.7 48 Q 138.7 53.6 140.8 57.95 A 17.602 17.602 0 0 0 143.906 62.496 A 15.697 15.697 0 0 0 146.6 64.75 Q 150.3 67.2 154.9 67.2 Q 158.7 67.2 162.1 65.35 Q 165.5 63.5 167.8 60.7 Z M 32.1 13.4 L 18.9 47 L 45.2 47 L 32.1 13.4 Z M 324.537 11.288 A 5.973 5.973 0 0 0 328.9 13.1 A 8.175 8.175 0 0 0 330.396 12.969 A 5.647 5.647 0 0 0 333.5 11.35 Q 335.2 9.6 335.2 6.8 A 7.26 7.26 0 0 0 335.2 6.719 A 6.06 6.06 0 0 0 333.35 2.35 A 7.395 7.395 0 0 0 333.292 2.293 A 6.059 6.059 0 0 0 328.9 0.5 A 8.264 8.264 0 0 0 327.244 0.658 A 5.661 5.661 0 0 0 324.3 2.2 A 5.588 5.588 0 0 0 322.829 4.832 A 7.987 7.987 0 0 0 322.6 6.8 A 5.992 5.992 0 0 0 323.092 9.219 A 6.643 6.643 0 0 0 324.45 11.2 A 7.466 7.466 0 0 0 324.537 11.288 Z" vector-effect="non-scaling-stroke" /></motion.g></motion.svg>

      {
        logged ? (
          <h1>Logged in</h1>
        ) : (
          <button onClick={login}>Github Login</button>
        )
      }
      <PullRequestChart />
    </div >
  );
};

export default Login;
