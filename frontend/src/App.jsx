import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Invoice from './pages/Invoice'
import AddInvoice from './components/AddInvoice'
import InvoiceTable from './components/InvoiceTable';
import ChartDahboard from './components/ChartDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='bg-gray-50'>
        <Router>
            <Routes>
              <Route path="/" element={<InvoiceTable />} />
              <Route path="/add-invoice" element={<AddInvoice />} />
              <Route path="/dashboard" element={<ChartDahboard />} />
            </Routes>
          </Router>
        {/* <Invoice /> */}
      </div>
    
  )
}

export default App
