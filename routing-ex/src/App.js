import logo from'./logo.svg';
import './App.css';
import First from'./Components/first/first';
import Second from'./Components/second/second';
import Third from'./Components/third/third';
import Four from'./Components/four/four';
import Five from'./Components/five/five';
import Sixth from'./Components/Sixth/sixth';
import six from'./Components/Sixth/Sixth';
import Seven from'./Components/seven/seven';
import Eight from'./Components/eight/eight';



function App() {
  return (
    <div className="App">
      
        <p>
          Welcome to react programmimng
        </p>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path='/first' element={<First />} />
          <Route path='/second' element={<Second />} />
          <Route path='/third' element={<Third firstName="Prasanna" lastName="Pappu" company="Wipro" />} />
          <Route path='/Four' element={<Four />} />
          <Route path='/five' element={<Five />} />
          <Route path='/Sixth' element={<Sixth />} />
          <Route path='/seven' element={<Seven />} />
          <Route path='/eight' element={<Eight />} />
          <Route path='/ButtonEx' element={<ButtonEx />} />

          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
