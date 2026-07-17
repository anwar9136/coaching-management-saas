import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <div>
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
