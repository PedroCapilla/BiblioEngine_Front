import Header from "../components/Header";
import {Link} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import '../styles/GreaterThan.css';
import axios from "axios";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme


function MoreCitations() {

    const json = {
        "ROOT": {
            "l1": {
                "task": "load",
                "value": "src/main/java/org/scimat_plus/bibliometicwe/executorWorker/parsed_LIS_2003-2022.csv"
            }
        },
        "BRANCH": {
            "f1": {
                "task": "GreaterThan",
                "params": {
                    "row": "Citations",
                    "number": "0"
                },
                "args": {
                    "a": "l1"
                }
            }
        },
        "LEAF": {
            "p1": {
                "task": "saveDataset",
                "params": {
                    "description": "GreaterThan"
                },
                "args": {
                    "a": "f1"
                }
            }
        }
    };


    const projectId = sessionStorage.getItem("projectId")
    const [keyword, setKeyword] = useState('');
    const [updatedFinalJson, setUpdatedFinalJson] = useState(json);
    const projectName = sessionStorage.getItem("projectName")
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([{}]);


    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const registerProject = async () => {
        setLoading(true);
        console.log("entrando en registerProject")
        try {
            const url = 'http://localhost:8080/tasks';
            let workflowToString = JSON.stringify(updatedFinalJson);
            const body = {
                "_id": projectId,
                "user": "Pedro",
                "project": projectName,
                "workflow": workflowToString,
                "execute": true
            }
            console.log("body to post: ", JSON.stringify(body, null, 2));
            const response = await axios.post(url, JSON.stringify(body), { // Asegúrate de enviar la cadena serializada.
                headers: {
                    'Content-Type': 'application/json' // Establece el encabezado 'Content-Type' a 'application/json'.
                }
            })
            if (response && response.data) {
                console.log("Task response: ", response.data)
                let resultsId = response.data.id
                await sleep(5000);

                try {
                    console.log("getInfoProject 1:   " +  resultsId)
                    const url = `http://localhost:8080/results/${resultsId}/GreaterThan`;
                    const results = await axios.get(url);
                    if (results && results.data) {
                        console.log("Response data:", results.data);
                        setRowData(results.data);
                        console.log("getInfoProject 2" + rowData)
                    } else {
                        console.error('No data returned from getProjectResults');
                    }
                } catch (error) {
                    console.error('An error occurred while fetching project results:', error);

                }



            } else {
                console.error('No data returned from the task execution');
            }
        } catch (error) {
            console.error('An error occurred while executing the task:', error);
        }
    }

    const updateJsonKeyword = () => {
        let updatedJson = {...json};
        updatedJson.BRANCH.f1.params.number = keyword;
        setUpdatedFinalJson(updatedJson);
        console.log("Json actualizado" + JSON.stringify(updatedFinalJson))

    };

    useEffect(() => {
        if (updatedFinalJson.BRANCH.f1.params.number !== json.BRANCH.f1.params.number) {
            registerProject()
        }
    }, [updatedFinalJson ]);

    const [colDefs, setColDefs] = useState([
        {field: "citations", headerName: "Citations", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "title", headerName: "Title", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "authors", headerName: "Authors", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "journal", headerName: "Journal", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "countries", headerName: "Countries", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "organizations", headerName: "Organizations", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "sourceKeywords", headerName: "Source Keywords", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "authorKeywords", headerName: "Author Keywords", flex: 1, cellStyle: {whiteSpace: 'normal'}},
        {field: "year", headerName: "Year", flex: 1, cellStyle: {whiteSpace: 'normal'}},
    ])


    return (
        <>
            <Header/>
            <div className="dashboard">
                <aside className="sidebar">
                    <Link href="/generalInformation" className="sidebar-item">Información General</Link>
                    <Link href="/analitica" className="sidebar-item">Analítica</Link>
                    <Link href="/moreCitations" className="sidebar-item">Documentos más citados</Link>
                    <Link href="/paperPerYear" className="sidebar-item">Papers por año</Link>
                    <Link href="/filterPerAuthor" className="sidebar-item">Filtro</Link>
                </aside>
                <section className="main-content">
                    <header className="header">
                        Citas mínimas
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                        />
                        <button onClick={updateJsonKeyword}>Buscar</button>
                    </header>
                    <div className="ag-theme-quartz" style={{ height: '100vh', width: '100%', lineHeight: 'normal' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            animateRows={true} // Puedes activar animaciones si lo deseas
                            defaultColDef={{
                                resizable: true, // Permite cambiar el tamaño de las columnas
                                wrapText: true, // Habilita el ajuste de texto para todas las celdas
                            }}
                            autoHeight={true} //  Habilita el ajuste automático de altura para las filas
                        />
                    </div>
                    {loading && <div className="loading">Cargando...</div>} {/* Muestra un indicador de carga */}
                </section>
            </div>
        </>
    );
}

export default MoreCitations;