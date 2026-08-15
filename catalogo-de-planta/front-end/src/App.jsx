import Header from "./pages/widgets/Header";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import logo from "./assets/images/logoWikiPlant.png";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="app-home">
      <Header />

      <main className="principalPag">
        <div className="hero-home">

          <div className="hero-logo">
            <img src={logo} alt="Plantarium" />
          </div>

          <div className="hero-content">
            <span className="hero-label">PLANTARIUM</span>

            <h1>
              Conheça, registre e explore
              <br />
              as plantas ao seu redor.
            </h1>

            <p>
              Um catálogo colaborativo para descobrir, consultar e registrar
              espécies de plantas presentes em nossa região.
            </p>

            <div id="botoes-inicial">
              <Link to="/catalogo" className="btn-principal">
                Explorar catálogo
              </Link>

              <Link to="/maps" className="btn-secundario">
                Explorar mapa
              </Link>

              {!isLoggedIn && (
                <Link to="/login" className="btn-login">
                  Fazer login
                </Link>
              )}

              {isLoggedIn && (
                <Link to="/cadastrar-planta" className="btn-login">
                  Cadastrar planta
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export default App;