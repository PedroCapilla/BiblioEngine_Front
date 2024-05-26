import axios from "axios";

export const getProjectsByCustomerId = async (customerId) =>
    await axios.get(`http://localhost:8090/projects/${customerId}`);

export const saveProject = async (body) =>
    await axios.post(`http://localhost:8090/projects`, body);

export const searchProjectByName = async(projectName) =>
    await axios.get(`http://localhost:8080/tasks/${projectName}`);

export const getProjectResults = async(projectId, tasklabel) =>{
    await axios.get(`http://localhost:8080/results/${projectId}/${tasklabel}`);
}

