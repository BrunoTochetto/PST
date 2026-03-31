import { Link } from "react-router-dom"

export default function Header() {


        return (
<header>
          <p>Logo</p>

          <div>
            <Link to='/'>Principal</Link>
            <Link to='/maps'>Mapa</Link>
            <Link to='/catalogo'>Catálogo</Link>
          </div>

          <p>Direita</p>
        </header>
        )
}