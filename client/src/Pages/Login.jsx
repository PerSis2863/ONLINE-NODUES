import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    // AUTHORIZATION
    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollno');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedRollNumber && storedPassword && expirationDate > new Date()) {
            navigate('/form');
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

    const [rollno, setRollno] = useState("");
    const [password, setPassword] = useState("");
    const isValidRollno = (rollno) => {
        
        const rollnoYear = parseInt(rollno.substring(0, 2));

        if (rollnoYear < 0) {
            return false;
        }

        const rollnoRegex = new RegExp(`^([0-9]{2})([A-Za-z]{2})([0-9]{4})$`);
        const match = rollno.match(rollnoRegex);

        if (!match) {
            return false;
        }

        return true;
    };

    const loginStudent = async (e) => {
        e.preventDefault();

        if (rollno === "" || password === "") {
            alert("Enter your Roll number and password");
            return;
        }

        if (!isValidRollno(rollno)) {
            alert("Invalid roll number");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/student/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rollNumber: rollno, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to three days from now

                    localStorage.setItem("rollno", rollno);
                    localStorage.setItem("password", password);
                    localStorage.setItem("expirationDate", expirationDate.toISOString());

                    navigate("/form");
                } else {
                    alert("Authentication failed");
                }
            } else {
                throw new Error('Failed to login');
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred while logging in");
        }
    };

    const handleRollnoChange = (e) => {
        const inputValue = e.target.value;
        const uppercaseRollno = inputValue.replace(/\s/g, "").toUpperCase();
        setRollno(uppercaseRollno);
    };
    
    return (
        <>
            <div className="loginpage">
                <NavLink to="/admin/login" className="goToAdminBtn"> RAIT Faculty</NavLink>
                <div className="loginform">
                    <h2>No Dues Form Application</h2>
                    <form onSubmit={loginStudent}>
                        <div className="detailslogin">
                            <label htmlFor="rollno">Roll no. :</label>
                            <input
                                autoComplete="off"
                                type="text"
                                id="rollno"
                                name="rollno"
                                onChange={handleRollnoChange}
                                value={rollno}
                                placeholder=""
                                className="form-input"
                            />

                            <label htmlFor="password">Password :</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder=""
                                className="form-input"
                            />
                            <p style={{ fontSize : "12px", margin : "0", color : "white" , padding : "10px", borderRadius : "10px" , background :"#ffffff7a"}}>Default Password : dypatil@123</p>
                            <input
                                type="submit"
                                value="Submit"
                                className="submit-btn"
                            />
                        </div>
                    </form>
                </div>
            <footer className="madebyFooter">
                Made by <a href="" target="_blank" rel="noreferrer" >Aditya Bhatt </a>, <a target="_blank" rel="noreferrer" href="" >Pracheta Ghosalkar</a>, 
                <a href=""  target="_blank" rel="noreferrer"> Sahil Singh </a>, <a href=""  target="_blank" rel="noreferrer"> Aryan Nair </a>
            </footer>
            </div>
        </>
    );
};

export default Login;   
