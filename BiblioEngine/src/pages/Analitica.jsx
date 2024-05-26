import React, {useEffect, useState} from 'react';
import '../styles/Analitica.css';
import Header from "../components/Header";
import axios from "axios";
import {Link} from "@material-ui/core";

function Analytic() {

    const json = {
        "ROOT": {
            "l1": {
                "task": "load",
                "value": "src/main/java/org/scimat_plus/bibliometicwe/executorWorker/parsed_LIS_2003-2022.csv"
            }
        },
        "BRANCH": {
            "f1": {
                "task": "filter",
                "params": {
                    "row": "Authors",
                    "keyword": ""
                },
                "args": {
                    "a": "l1"
                }
            },
            "f2": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Citations",
                    "type": "Sum"
                },
                "args": {
                    "a": "f1"
                }
            },
            "f3": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Citations",
                    "type": "Average"
                },
                "args": {
                    "a": "f1"
                }
            },
            "f4": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Citations",
                    "type": "Desviation"
                },
                "args": {
                    "a": "f1"
                }
            },
            "f5": {
                "task": "hIndex",
                "args": {
                    "a": "f1"
                }
            }
        },
        "LEAF": {
            "p1": {
                "task": "saveInt",
                "params": {
                    "description": "Suma"
                },
                "args": {
                    "a": "f2"
                }
            },
            "p2": {
                "task": "saveInt",
                "params": {
                    "description": "Media"
                },
                "args": {
                    "a": "f3"
                }
            },
            "p3": {
                "task": "saveInt",
                "params": {
                    "description": "Desviacion"
                },
                "args": {
                    "a": "f4"
                }
            },
            "p4": {
                "task": "saveInt",
                "params": {
                    "description": "HIndex"
                },
                "args": {
                    "a": "f5"
                }
            }
        }
    }

    const projectId = sessionStorage.getItem("projectId")
    const [sumResult, setSumResult] = React.useState({});
    const [averageResult, setAverageResult] = React.useState({});
    const [desvResult, setDesvResult] = React.useState({});
    const [hIndexResult, setHIndexResult] = React.useState({});
    const [keyword, setKeyword] = useState('');
    const [updatedFinalJson, setUpdatedFinalJson] = useState(json);
    const projectName = sessionStorage.getItem("projectName")


    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const updateJsonKeyword = () => {
        let updatedJson = {...json};
        updatedJson.BRANCH.f1.params.keyword = keyword;
        console.log("Json actualizado" + JSON.stringify(updatedFinalJson))
        setUpdatedFinalJson(updatedJson);

    };

    const getInfoHIndexProject = async (resultId) => {
        try {
            const url = `http://localhost:8080/results/${resultId}/HIndex`;
            console.log(`Making API call to: ${url}`);
            const response = await axios.get(url);

            if (response && response.data) {
                console.log("Response data:", response.data);
                setHIndexResult(response.data[0]);
            } else {
                console.error('No data returned from getProjectResults');
            }
        } catch (error) {
            console.error('An error occurred while fetching project results:', error);
        }
    };
    const getInfoSumProject = async (resultId) => {
        try {
            const url = `http://localhost:8080/results/${resultId}/Suma`;
            console.log(`Making API call to: ${url}`);
            const response = await axios.get(url);

            if (response && response.data) {
                console.log("Response data:", response.data);
                setSumResult(response.data[0]); // Asumiendo que es el primer objeto del array
            } else {
                console.error('No data returned from getProjectResults');
            }
        } catch (error) {
            console.error('An error occurred while fetching project results:', error);
        }
    };

    const getInfoAverageProject = async (resultId) => {
        try {
            const url = `http://localhost:8080/results/${resultId}/Media`;
            console.log(`Making API call to: ${url}`);
            const response = await axios.get(url);

            if (response && response.data) {
                console.log("Response data:", response.data);
                setAverageResult(response.data[0]);
            } else {
                console.error('No data returned from getProjectResults');
            }
        } catch (error) {
            console.error('An error occurred while fetching project results:', error);
        }
    };

    const getInfoDesvProject = async (resultId) => {
        try {
            const url = `http://localhost:8080/results/${resultId}/Desviacion`;
            console.log(`Making API call to: ${url}`);
            const response = await axios.get(url);

            if (response && response.data) {
                console.log("Response data:", response.data);
                setDesvResult(response.data[0]); // Asumiendo que quieres el primer objeto del array
            } else {
                console.error('No data returned from getProjectResults');
            }
        } catch (error) {
            console.error('An error occurred while fetching project results:', error);
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const registerProject = async ()=>{
        try{
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
            if(response && response.data){
                console.log("Task response: ", response.data)
                let resultsId = response.data.id
                await sleep(5000)
                await getInfoSumProject(resultsId)
                await getInfoDesvProject(resultsId)
                await getInfoAverageProject(resultsId)
                await getInfoHIndexProject(resultsId)
            }

        }catch (error) {
            console.error('An error occurred while executing the task:', error);
        }
    }

    useEffect(()=>{
        if (updatedFinalJson.BRANCH.f1.params.keyword !== json.BRANCH.f1.params.keyword) {
            console.log("dentro del usefecct")
            registerProject()
        }

    },[updatedFinalJson])
    //Gregor, Shirley

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
                <main className="main-content">
                    <header className="header">
                        Author to search:
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                        />
                        <button onClick={updateJsonKeyword}>Buscar</button>
                    </header>
                    <section className="statistics">
                        <table className="stats-table">
                            <thead>
                            <tr>
                                <th colSpan="4">Resultados</th>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <th>Media</th>
                                <th>Desviación Típica</th>
                                <th>H-index</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{sumResult.result}</td>
                                <td>{averageResult.result}</td>
                                <td>{desvResult.result}</td>
                                <td>{hIndexResult.result}</td>
                            </tr>
                            {/* Aquí irían las filas con los datos */}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>

    );
}

export default Analytic;
