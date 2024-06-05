import axios from "axios";


export const validateLogin = async (username, password) =>
  await axios.get(`http://localhost:8090/customers/${username}/${password}`);

export const getCustomer = async(customerId) =>
    axios.get(`http://localhost:8090/customers/${customerId}`)

export const deleteUser = async (userID) =>
  await axios.delete(`http://localhost:8090/customers/${userID}`);

export const createUser = async (body) =>
    await axios.post(`http://localhost:8090/customers/register`, body)



  