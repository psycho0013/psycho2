import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import LabDiagnosis from './pages/LabDiagnosis';
import Awareness from './pages/Awareness';
import About from './pages/About';
import Contact from './pages/Contact';
import DiseaseDetails from './pages/DiseaseDetails';
import TreatmentDetails from './pages/TreatmentDetails';
import MedicalDirectory from './pages/MedicalDirectory';
import DirectoryItemDetails from './pages/DirectoryItemDetails';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ContentEditor from './pages/admin/ContentEditor';
import DiseasesManager from './pages/admin/DiseasesManager';
import SymptomsManager from './pages/admin/SymptomsManager';
import TreatmentsManager from './pages/admin/TreatmentsManager';
import DirectoryManager from './pages/admin/DirectoryManager';
import DataManager from './pages/admin/DataManager';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="lab-diagnosis" element={<LabDiagnosis />} />
          <Route path="awareness" element={<Awareness />} />
          <Route path="awareness/disease/:id" element={<DiseaseDetails />} />
          <Route path="awareness/treatment/:id" element={<TreatmentDetails />} />
          <Route path="directory" element={<MedicalDirectory />} />
          <Route path="directory/:id" element={<DirectoryItemDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentEditor />} />
          <Route path="diseases" element={<DiseasesManager />} />
          <Route path="symptoms" element={<SymptomsManager />} />
          <Route path="treatments" element={<TreatmentsManager />} />
          <Route path="directory" element={<DirectoryManager />} />
          <Route path="data" element={<DataManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
