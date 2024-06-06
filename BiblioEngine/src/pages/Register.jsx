import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            pswd: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/customers/register', values);
                if (response.status === 200) {
                    alert('Usuario registrado exitosamente');
                    navigate('/login');
                }
            } catch (error) {
                alert('Error al registrar el usuario: ' + error.message);
            }
        },
    });

    return (
        <div className="background">
            <div className="container">
                <div className="div">
                    <FaArrowLeft className="back-arrow" onClick={() => navigate('/login')} />
                    <h2>Registro</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                name="Usernaname"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                required
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                name="pswd"
                                onChange={formik.handleChange}
                                value={formik.values.pswd}
                                required
                            />
                        </div>
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
