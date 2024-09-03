import './App.css';
import { categories } from './api';
import Row from './components/Row'
import Banner from "./components/Banner"
import Nav from "./components/Nav"

function App() {
  return (
    <div>

        <Nav></Nav>
        <Banner></Banner>

        {categories.map( (category) => {

            return  <Row 
                         key={category.name}
                         title={category.title} 
                         isLarge={category.isLarge}
                         name={category.name}
                    />

        })}

    </div>
  );
}

export default App;