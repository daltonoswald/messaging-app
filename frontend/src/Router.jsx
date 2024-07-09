import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import LogIn from './LogIn.jsx';

export default function Router() {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Homepage />,
        },
        {
            path: '/log-in',
            element: <LogIn />
        }
    ]);
    return <RouterProvider router={router} />
}