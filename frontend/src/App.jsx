import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Menu from './Menu';
import Clientes from './Clientes';
import Veiculos from './Veiculos';
import Ordens from './Ordens';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Menu />,
        children: [
            { index: true, element: <Navigate to="/clientes" replace /> },
            { path: 'clientes', element: <Clientes /> },
            { path: 'veiculos', element: <Veiculos /> },
            { path: 'ordens', element: <Ordens /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
