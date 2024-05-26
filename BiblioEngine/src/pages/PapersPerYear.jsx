import React, {useEffect, useState} from "react";
import axios from "axios";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from "react-chartjs-2";
import Header from "../components/Header";
import {Link} from "@material-ui/core";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Papers por Año',
        },
    },
};


export default function PapersPerYear() {
    const json = {
        "ROOT": {
            "l1": {
                "task": "load",
                "value": "src/main/java/org/scimat_plus/bibliometicwe/executorWorker/parsed_LIS_2003-2022.csv"
            }
        },
        "BRANCH":{
            "f1":{
                "task": "FilterPerFilter",
                "params": {
                    "row1": "Year",
                    "row2": "Title"
                }, "args": {
                    "a": "l1"
                }
            }
        },
        "LEAF": {
            "p1": {
                "task": "saveDataset",
                "params": {
                    "description": "PaperPerYear"
                }, "args": {
                    "a": "f1"
                }
            }
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const projectId = sessionStorage.getItem("projectId")
    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const results = [{}];
    const projectName = sessionStorage.getItem("projectName")


    useEffect(() => {
        const registerProject = async () => {
            console.log("entrando en registerProject")
            try {
                const url = 'http://localhost:8080/tasks';
                let workflowToString = JSON.stringify(json);
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
                        'Content-Type': 'application/json'
                    }
                })
                if (response && response.data) {
                    console.log("Task response: ", response.data)
                    let resultsId = response.data.id
                    await sleep(5000);

                    try {
                        console.log("getInfoProject 1:   " +  resultsId)
                        const url = `http://localhost:8080/results/${resultsId}/PaperPerYear`;
                        const result = await axios.get(url);
                        if (result && result.data) {
                            console.log("Response data:", result.data);
                            const years = result.data.map(item => item.year);
                            const papers = result.data.map(item => item.title);
                            console.log(years)
                            console.log(papers)

                            setChartData({
                                labels: years,
                                datasets: [
                                    {
                                        label: 'Papers',
                                        data: papers,
                                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    },
                                ],
                            });
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

        registerProject()
    }, [projectId])

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
                        PAPERS POR AÑO
                    </header>
                    <Bar options={options} data={chartData}/>;
                </section>
            </div>


        </>
    )
}