import { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

export default function Login({ currentUser, setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reqBody = {
        email,
        password,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`,
        reqBody
      );

      const { token } = response.data;

      // Save the token in local storage
      localStorage.setItem('jwt', token);

      // Decode the token
      const decoded = jwt_decode(token);

      // Set the user in App's state to be the decoded token
      setCurrentUser(decoded);

      // Redirect to the profile page
      navigate('/profile');
    } catch (err) {
      console.warn(err);
      if (err.response) {
        setMsg(err.response.data.msg);
      } else {
        setMsg('An error occurred during login.');
      }
    }
  };

  return (
    <div>
      {currentUser ? (
        // If the user is logged in, show the Profile component
        <Profile currentUser={currentUser} />
      ) : (
        // If the user is not logged in, show the login form
        <>
          <h1>Login to Your Account:</h1>
          <p>{msg}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="your email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="password..."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
}
