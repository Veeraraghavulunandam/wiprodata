import axios from 'axios';
import { useState } from 'react';

const API = ' https://localhost:7055';

export default function SearchById() {
  const [id,  setId]  = useState('');
  const [res, setRes] = useState(null);

  const go = () =>
    axios.get(`${API}/${id}`)
      .then(r => setRes(r.data))
      .catch(() => alert('Not found'));

  return (
    <div>
      <h3>Search Customer by Id</h3>
      Id:<input onChange={e => setId(e.target.value)} />
      <button onClick={go}>Search</button>
      {res && <pre>{JSON.stringify(res, null, 2)}</pre>}
    </div>
  );
}
