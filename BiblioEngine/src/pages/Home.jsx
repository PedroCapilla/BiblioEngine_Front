import {Button, Container, CssBaseline, Grid, Paper, TextField, Typography} from '@material-ui/core';
import React, {useState} from 'react';
import Header from "../components/Header";
import {Field, Form, Formik, FieldArray } from "formik";
import '../styles/createProject.css'
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import {Checkbox, FormControlLabel} from "@mui/material";

function Home() {
    const customerId = sessionStorage.getItem("customerId")
    const [mostrarPeriodos, setMostrarPeriodos] = useState(false);


    const handleSubmit = (values) => {
        const projectInfo = {
            customerId : customerId,
            projectName : values.projectName,
            databaseUrl : values.file.name,
            searchPeriods : values.yearStart+","+values.yearEnd
        }

        axios.post('http://localhost:8090/projects', projectInfo)
            .then(response=>{
                console.log("Proyecto creado correctamente", response)
        }).catch(error =>{
            console.log("Proyecto no creado", error)
        });

        let formData = new FormData();

        formData.append("file", values.file);

        axios.post('http://localhost:8090/projects/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
           console.log("Fichero subido correctamente", response)
        }).catch(error => {
            console.log("Fichero no subido", error)
        });


    };

    return (

        // <>
        //     <Header/>
        //
        //     <div className='centerDiv'>
        //         <Grid container component='main'>
        //             <CssBaseline/>
        //             <Container component={Paper} elevation={5} maxWidth='xs'>
        //                 <div className='containerLogin'>
        //                     <Typography component='h1' variant='h5'>Crear Proyecto </Typography>
        //                     <Formik
        //                         initialValues={{ projectName: '', file: null, yearStart: '', yearEnd: '' }}
        //                         onSubmit={handleSubmit}
        //                         validate={(values) => {
        //                             const errors = {};
        //                             if (!values.projectName) {
        //                                 errors.projectName = "Se requiere el nombre del proyecto";
        //                             }
        //                             if (!values.file) {
        //                                 errors.file = "Se requiere un archivo";
        //                             } else if (!values.file.name.endsWith('.csv')) {
        //                                 errors.file = "Solo se admiten archivos CSV";
        //                             }
        //                             // Valida los años si mostrarPeriodos es true
        //                             if (mostrarPeriodos) {
        //                                 if (!values.yearStart) {
        //                                     errors.yearStart = "Se requiere el año de inicio";
        //                                 }
        //                                 if (!values.yearEnd) {
        //                                     errors.yearEnd = "Se requiere el año de fin";
        //                                 }
        //                             }
        //                             return errors;
        //                         }}
        //                     >
        //                         {({ setFieldValue, values }) => (
        //                             <Form>
        //                                 <Field name="projectName">
        //                                     {({ field }) => (
        //                                         <TextField
        //                                             {...field}
        //                                             label="Nombre del Proyecto"
        //                                             fullWidth
        //                                             margin="normal"
        //                                         />
        //                                     )}
        //                                 </Field>
        //                                 <Field name="file">
        //                                     {({ field }) => (
        //                                         <input
        //                                             id="file"
        //                                             name="file"
        //                                             type="file"
        //                                             onChange={(event) => {
        //                                                 setFieldValue("file", event.currentTarget.files[0]);
        //                                             }}
        //                                             className="form-control"
        //                                         />
        //                                     )}
        //                                 </Field>
        //                                 <FormControlLabel
        //                                     control={
        //                                         <Checkbox
        //                                             checked={mostrarPeriodos}
        //                                             onChange={() => setMostrarPeriodos(!mostrarPeriodos)}
        //                                             name="mostrarPeriodos"
        //                                         />
        //                                     }
        //                                     label="¿Quieres periodos de búsqueda?"
        //                                 />
        //                                 {mostrarPeriodos && (
        //                                     <>
        //                                         <Field name="yearStart">
        //                                             {({ field }) => (
        //                                                 <TextField
        //                                                     {...field}
        //                                                     label="Año de inicio"
        //                                                     fullWidth
        //                                                     margin="normal"
        //                                                 />
        //                                             )}
        //                                         </Field>
        //                                         <Field name="yearEnd">
        //                                             {({ field }) => (
        //                                                 <TextField
        //                                                     {...field}
        //                                                     label="Año de fin"
        //                                                     fullWidth
        //                                                     margin="normal"
        //                                                 />
        //                                             )}
        //                                         </Field>
        //                                     </>
        //                                 )}
        //                                 <button type="submit">Guardar</button>
        //                             </Form>
        //                         )}
        //                     </Formik>
        //                 </div>
        //             </Container>
        //         </Grid>
        //     </div>
        // </>
        <>
            <Header />
            <div className='centerDiv'>
                <Grid container component='main'>
                    <CssBaseline />
                    <Container component={Paper} elevation={5} maxWidth='xs'>
                        <div className='containerLogin'>
                            <Typography component='h1' variant='h5'>Crear Proyecto</Typography>
                            <Formik
                                initialValues={{ projectName: '', file: null, periods: [] }}
                                onSubmit={handleSubmit}
                                validate={(values) => {
                                    const errors = {};
                                    if (!values.projectName) {
                                        errors.projectName = "Se requiere el nombre del proyecto";
                                    }
                                    if (!values.file) {
                                        errors.file = "Se requiere un archivo";
                                    } else if (!values.file.name.endsWith('.csv')) {
                                        errors.file = "Solo se admiten archivos CSV";
                                    }
                                    if (mostrarPeriodos && values.periods.length === 0) {
                                        errors.periods = "Se requiere al menos un periodo";
                                    }
                                    // Agregar más validaciones aquí si es necesario
                                    return errors;
                                }}
                            >
                                {({ setFieldValue, values }) => (
                                    <Form>
                                        <Field name="projectName">
                                            {({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Nombre del Proyecto"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                            )}
                                        </Field>
                                        <input
                                            id="file"
                                            name="file"
                                            type="file"
                                            onChange={(event) => {
                                                setFieldValue("file", event.currentTarget.files[0]);
                                            }}
                                            className="form-control"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={mostrarPeriodos}
                                                    onChange={() => setMostrarPeriodos(!mostrarPeriodos)}
                                                    name="mostrarPeriodos"
                                                />
                                            }
                                            label="¿Quieres periodos de búsqueda?"
                                        />
                                        {mostrarPeriodos && (
                                            <FieldArray name="periods">
                                                {({ insert, remove, push }) => (
                                                    <div>
                                                        {values.periods.length > 0 &&
                                                            values.periods.map((period, index) => (
                                                                <div key={index}>
                                                                    <Field name={`periods.${index}.yearStart`}>
                                                                        {({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Año de inicio"
                                                                                fullWidth
                                                                                margin="normal"
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <Field name={`periods.${index}.yearEnd`}>
                                                                        {({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Año de fin"
                                                                                fullWidth
                                                                                margin="normal"
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => push({ yearStart: '', yearEnd: '' })}
                                                        >
                                                            Agregar Periodo
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        )}
                                        <button type="submit">Guardar</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Container>
                </Grid>
            </div>
        </>
    );
}

export default Home;



