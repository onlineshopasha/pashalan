import 'vazirmatn/Vazirmatn-Variable-font-face.css';
import { createRoot } from 'react-dom/client';
import { installStaticSafeFetchBridge } from './utils/staticApiBridge';
import App from './App.tsx';
import './index.css';

installStaticSafeFetchBridge();

createRoot(document.getElementById('root')!).render(<App />);
