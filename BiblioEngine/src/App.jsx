import './styles/App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Analytic from './pages/Analitica'
import MoreCitations from './pages/MoreCitations'
import PaperPerYear from './pages/PapersPerYear'
import FilterPerAuthor from './pages/FilterPerAuthor'
import GeneralInformation from './pages/GeneralInformation'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/analitica" element={<Analytic />}/>
                <Route path="/moreCitations" element={<MoreCitations/>}/>
                <Route path="/paperPerYear" element={<PaperPerYear/>}/>
                <Route path="/filterPerAuthor" element={<FilterPerAuthor/>}/>
                <Route path="/generalInformation" element={<GeneralInformation/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
