import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import { onImportF } from './functions';
function App() {
  const [str, setStr] = React.useState(`
  [1/29, 7:13 PM] AsgarAliyev: #year=2023
  [1/29, 7:14 PM] AsgarAliyev: #taxi #p=1 #a=-3.3`);
  const onImport = onImportF;

  React.useEffect(() => {
    console.log(JSON.stringify(onImport(str), null, 1));
  }, []);
  return (
    <div>
      <textarea
        placeholder="Yapistir..."
        style={{ width: '50vw', height: '50vh' }}
        onChange={(e) => {
          setStr(e.target.value);
        }}
      >
        {str}
      </textarea>
      <button onClick={() => onImport(str)}>Gonder</button>
    </div>
  );
}

export default App;
