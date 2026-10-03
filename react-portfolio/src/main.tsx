import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'

// IBM Plex Sans font import.
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";

// JetBrains Mono font import.
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";

// Baskervville font import.
import "@fontsource/baskervville/400.css";
import "@fontsource/baskervville/400-italic.css";

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
