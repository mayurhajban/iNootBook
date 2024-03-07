import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
const Login = (props) => {

  const [credential, setCredential] = useState({ email: "", password: "" })
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credential.email, password: credential.password })
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      //save the auth token and redirect
      localStorage.setItem('token', json.authtoken)
      props.showAlert("Loggedin Successfully", "success")
      navigate("/");
    }
    else {
      props.showAlert("Invalid Details", "danger")
    }
  }
  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value })
  }
  return (
    <div className="container mt-3">
      <h2>Login to continue to iNoteBook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" value={credential.email} onChange={onChange} id="email" name='email' aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" value={credential.password} onChange={onChange} id="password" name='password' />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login
