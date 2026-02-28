import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./layout";




const App = () => {

  
   
  // const {data} = useContext(AppContext); 
  return (
    <>

      <Router>
        <Layout/>
      </Router>
      
    </>
  )
}

export default App;
