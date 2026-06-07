import { BrowserRouter } from "react-router"
import AppRouter from "./routes/app-router"

function App() {

  return (
    <div>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </div>
    
  )
}

export default App
