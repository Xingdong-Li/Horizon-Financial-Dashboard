import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from "aws-amplify";
import config from "./amplifyconfiguration.json";
Amplify.configure(config);

createRoot(document.getElementById('root')).render(
  <App />
)
