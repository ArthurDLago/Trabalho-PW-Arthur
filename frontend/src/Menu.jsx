import { NavLink, Outlet } from 'react-router-dom';

const Menu = () => {
    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <span className="navbar-brand">🔧 Oficina</span>
                    <div className="navbar-nav flex-row gap-3">
                        <NavLink className="nav-link" to="/clientes">Clientes</NavLink>
                        <NavLink className="nav-link" to="/veiculos">Veículos</NavLink>
                        <NavLink className="nav-link" to="/ordens">Ordens de serviço</NavLink>
                    </div>
                </div>
            </nav>
            <div className="container py-4">
                <Outlet />
            </div>
        </>
    );
};

export default Menu;
