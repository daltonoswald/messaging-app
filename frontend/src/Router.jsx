import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import LogIn from './login/LogIn.jsx';
import SignUp from './signup/SignUp.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import Profile from './profile/Profile.jsx';
import MyProfile from './profile/MyProfile.jsx';

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
        },
        {
            path: '/profile/:postid',
            element: <Profile />
        },
        {
            path: `/my-profile/`,
            element: <MyProfile />
        }
    ]);
    return <RouterProvider router={router} />
}