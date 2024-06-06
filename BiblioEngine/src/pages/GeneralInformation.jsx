import React, {useEffect, useState} from "react";
import axios from "axios";
import Header from "../components/Header";
import {Link} from "@material-ui/core";


function GeneralInformation() {
    const json = {
        "ROOT": {
            "l1": {
                "task": "load",
                "value": "src/main/java/org/scimat_plus/bibliometicwe/executorWorker/parsed_LIS_2003-2022.csv"
            }
        },
        "BRANCH": {
            "t1": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "",
                    "type": "Count"
                },
                "args": {
                    "a": "l1"
                }
            },
            "t2": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Citations",
                    "type": "Sum"
                },
                "args": {
                    "a": "l1"
                }
            },
            "t3": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Citations",
                    "type": "Average"
                },
                "args": {
                    "a": "l1"
                }
            },
            "t4": {
                "task": "hIndex",
                "args": {
                    "a": "l1"
                }
            },
            "t5": {
                "task": "FilterPerFilter",
                "params": {
                    "row1": "Authors",
                    "row2": "Journal"
                },
                "args": {
                    "a": "l1"
                }
            },
            "t6": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Authors",
                    "type": "Count"
                },
                "args": {
                    "a": "t5"
                }
            },
            "t7": {
                "task": "FilterPerFilter",
                "params": {
                    "row1": "Journal",
                    "row2": "Citations"
                },
                "args": {
                    "a": "l1"
                }
            },
            "t8": {
                "task": "ArithmeticAgg",
                "params": {
                    "row": "Journal",
                    "type": "Count"
                },
                "args": {
                    "a": "t7"
                }
            },
            "t9": {
                "task": "FilterPerFilter",
                "params": {
                    "row1": "Journal",
                    "row2": "Citations"
                },
                "args": {
                    "a": "l1"
                }
            }
        },
        "LEAF": {
            "p1": {
                "task": "saveInt",
                "params": {
                    "description": "Count"
                },
                "args": {
                    "a": "t1"
                }
            },
            "p2": {
                "task": "saveInt",
                "params": {
                    "description": "Suma"
                },
                "args": {
                    "a": "t2"
                }
            },
            "p3": {
                "task": "saveInt",
                "params": {
                    "description": "Media"
                },
                "args": {
                    "a": "t3"
                }
            },
            "p4": {
                "task": "saveInt",
                "params": {
                    "description": "HIndex"
                },
                "args": {
                    "a": "t4"
                }
            },
            "p5": {
                "task": "saveInt",
                "params": {
                    "description": "NumAuthors"
                },
                "args": {
                    "a": "t6"
                }
            },
            "p6": {
                "task": "saveInt",
                "params": {
                    "description": "NumPapers"
                },
                "args": {
                    "a": "t8"
                }
            },
            "p7": {
                "task": "saveDataset",
                "params": {
                    "description": "JournalCitations"
                },
                "args": {
                    "a": "t9"
                }
            }
        }
    }

    const projectId = sessionStorage.getItem("projectId")
    const projectName = sessionStorage.getItem("projectName")
    const [updatedFinalJson, setUpdatedFinalJson] = useState(json);
    const [sumResult, setSumResult] = React.useState(0);
    const [averageResult, setAverageResult] = React.useState(0);
    const [hIndexResult, setHIndexResult] = React.useState(0);
    const [countResult, setCountResult] = React.useState(0);
    const [numAuthorsResult, setNumAuthorsResult] = React.useState(0);
    const [numPapersResult, setNumPapersResult] = React.useState(0);
    const [journalCitations, setJournalCitations] = React.useState({});


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getInfoAverageProject = async (resultId) => {
        try {
            const url = `http://localhost:8080/results/${resultId}/Media`;
            console.log(`Making API call to: ${url}`);
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response && response.data) {
                console.log("Response data:", response);
                setAverageResult(response.data[0].result);
            } else {
                console.error('No data returned from getProjectResults');
            }
        } catch
            (error)
            {
                console.error('An error occurred while fetching project results:', error);
            }
        }

        const getInfoSumProject = async (resultId) => {
            try {
                const url = `http://localhost:8080/results/${resultId}/Suma`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data2:", response.data);
                    setSumResult(response.data[0].result); // Asumiendo que es el primer objeto del array
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        };

        const getInfoHIndexProject = async (resultId) => {
            try {
                const url = `http://localhost:8080/results/${resultId}/HIndex`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data3:", response.data);
                    setHIndexResult(response.data[0].result);
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        };

        const getInfoCountProject = async (resultId) => {
            try {
                const url = `http://localhost:8080/results/${resultId}/Count`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data4:", response.data);
                    setCountResult(response.data[0].result);
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        };

        const getInfoNumAuthorsProject = async (resultId) => {
            try {
                const url = `http://localhost:8080/results/${resultId}/NumAuthors`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data5:", response.data);
                    setNumAuthorsResult(response.data[0].result);
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        };

        const getInfoNumPapersProject = async (resultId) => {
            try {
                const url = `http://localhost:8080/results/${resultId}/NumPapers`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data6:", response.data);
                    setNumPapersResult(response.data[0].result);
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        };

        const getInfoJournalCitations = async(resultId)=>{
            try {
                const url = `http://localhost:8080/results/${resultId}/JournalCitations`;
                console.log(`Making API call to: ${url}`);
                const response = await axios.get(url);

                if (response && response.data) {
                    console.log("Response data6:", response.data);
                    setJournalCitations(response.data[0]);
                } else {
                    console.error('No data returned from getProjectResults');
                }
            } catch (error) {
                console.error('An error occurred while fetching project results:', error);
            }
        }

        const registerProject = async () => {
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
                const response = await axios.post(url, JSON.stringify(body), {
                    headers: {
                        'Content-Type': 'application/json' // Establece el encabezado 'Content-Type' a 'application/json'.
                    }
                })
                if (response && response.data) {
                    console.log("Task response: ", response.data)
                    let resultsId = response.data.id
                    await sleep(30000)
                    await getInfoSumProject(resultsId)
                    await getInfoAverageProject(resultsId)
                    await getInfoHIndexProject(resultsId)
                    await getInfoCountProject(resultsId)
                    await getInfoNumAuthorsProject(resultsId)
                    await getInfoNumPapersProject(resultsId)
                }
            } catch (error) {
                console.error('An error occurred while executing the task:', error);
            }
        }

        useEffect(() => {
            registerProject()
        }, [updatedFinalJson])

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
                            INFORMACIÓN GENERAL
                        </header>
                        <div className="statistics">
                            <table className="stats-table">
                                <thead>
                                <tr>
                                    <th colSpan="4">Resultados</th>
                                </tr>
                                <tr>
                                    <th>Tamaño del dataset</th>
                                    <th>Total de citas</th>
                                    <th>Media de citas</th>
                                    <th>Índice H</th>
                                    <th>Número de autores</th>
                                    <th>Número de revistas</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{countResult}</td>
                                    <td>{sumResult}</td>
                                    <td>{averageResult}</td>
                                    <td>{hIndexResult}</td>
                                    <td>{numAuthorsResult}</td>
                                    <td>{numPapersResult}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </main>
                </div>
            </>
        )
    }

    export default GeneralInformation;