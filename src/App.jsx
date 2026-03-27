import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import AppFeedbackProvider from "./components/system/AppFeedbackProvider";




const App = () => {

  
   
  // const {data} = useContext(AppContext); 
  return (
    <AppFeedbackProvider>
      <Router>
        <Layout/>
      </Router>
    </AppFeedbackProvider>
  )
}

export default App;
