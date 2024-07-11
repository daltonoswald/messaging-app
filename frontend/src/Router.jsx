import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import LogIn from './LogIn.jsx';
import SignUp from './signup/SignUp.jsx';
import Dashboard from './dashboard/Dashboard.jsx';

export default function Router() {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Homepage />,
        },
        {
            path: '/log-in',
            element: <LogIn />
        },
        {
            path: '/sign-up',
            element: <SignUp />
        },
        {
            path: '/dashboard',
            element: <Dashboard />
        }
    ]);
    return <RouterProvider router={router} />
}