import { useState } from "react";
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import "../../App.css"
import logo from "../../assets/images/logoWikiPlant.png";
import userIcon from "../../assets/images/userIcon.png"

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

        return (
          <header>
            <Link to="/" className="brand">
              <img src={logo} alt="Plantarium" className="logo" />
              <span className="brand-name">Plantarium</span>
            </Link>

            <nav className="linksNav">
              <Link to="/">Principal</Link>
              <Link to="/maps">Mapa</Link>
              <Link to="/catalogo">Catálogo</Link>
            </nav>

            <div className="userSection">
              <img
                src={userIcon}
                alt="Usuário"
                className="userIcon"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="userDropdown">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <p
                        style={{
                          borderBottom: "none",
                          color: "#333",
                          cursor: "pointer"
                        }}
                      >
                        Fazer Login
                      </p>
                    </Link>
                  ) : (
                    <>
                      <p>Olá, {user?.nome}!</p>
                      <button onClick={logout}>Sair</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </header>
  );
}