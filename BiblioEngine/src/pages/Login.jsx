import React, { useState } from 'react';
import { Grid, Container, Paper, Typography, TextField, Button, Link } from '@material-ui/core'

import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import { validateLogin } from '../api/customers.api'
import logo from '../public/assets/images/BibWE.png'
import { Formik, Form, ErrorMessage } from 'formik';

//const socket = io("http://localhost:4001");

const Login = ({newUser, handleCambio, logNewUser}) => {

  const [errorValidationMesage, setValidationErrorMessage] = useState({ errorValidation: '' })
  
  let navigate = useNavigate();

  function storageCustomerId(id){
    sessionStorage.setItem("customerId", id);
  }

  return (

      <div className="background">
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          component='main'>

          <Container sx={{ padding: 4, borderRadius: 4, textAlign: 'center' }} component={Paper} elevation={5} maxWidth='xs'>
            <div className="div">
              <div>
                <center><img src={logo} className="logoImage" alt="Logotipo aplicacion Bibliometric"></img></center>
              </div>

              <div>
                <Typography component='h1' variant='h5'>Iniciar sesion</Typography>
                <Formik
                  initialValues={{
                    username: '',
                    password: ''
                  }}
                  onSubmit={async (values, { resetForm }) => {
                    resetForm();
                    try {

                      const session = await validateLogin(values.username, values.password);
                      const sessionData = session.data;
                      if (sessionData) {
                        //Inicio de sesion correcto
                        console.log("Se ha iniciado sesion correctamente")
                        storageCustomerId(sessionData.id)
                        console.log(sessionData.id)
                        navigate('/home')
                      } else {
                        //Fallo inicio de sesion
                        console.log("Fallo en el inicio de sesion")
                        setValidationErrorMessage({ errorValidation: 'Credenciales incorrectas' })
                        setTimeout(() => setValidationErrorMessage(''), 3000);
                      }
                    } catch (error) {
                      setValidationErrorMessage({ errorValidation: 'Credenciales incorrectas' })
                      setTimeout(() => setValidationErrorMessage(''), 3000);
                    }
                  }}
                  //Validaciones para el formulario
                  validate={(values) => {
                    const errors = {}
                    if (!values.username) {
                      errors.username = 'Rellena el campo del nombre de usuario'
                    }
                    if (!values.password) {
                      errors.password = 'Rellena el campo de contraseña'
                    }

                    return errors;
                  }}
                >

                  {({ values, errors, handleChange, handleBlur}) => (
                    <Form>

                      <TextField
                        fullWidth
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Nombre de usuario'
                        // value={body.username}
                        // onChange={inputChange}
                        name='username'
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      
                      <ErrorMessage name="username" component={() =>
                        (<div className='error'>{errors.username}</div>)
                      } />
                      <TextField
                        fullWidth
                        type='password'
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Contraseña'
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage name="password" component={() =>
                        (<div className='error'>{errors.password}</div>)
                      } />

                      <Grid sx={{ margin: 5 }}>
                        <Link href='#'>¿Contraseña olvidada?</Link>
                        <Button
                          type='submit'
                          variant='contained'
                          className="buttonSumbit"
                          sx={{ marginTop: 3, }}
                          
                        >
                          Iniciar sesion
                        </Button>

                      </Grid>
                      {errorValidationMesage && <div className='error'>{errorValidationMesage.errorValidation}</div>}
                    </Form>
                  )}
                </Formik>
                <Link href='/register'>Registrate aqui!</Link>
              </div>
            </div>
          </Container>
        </Grid>
      </div>

  )
}

export default Login