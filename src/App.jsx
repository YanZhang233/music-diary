import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Start from './pages/start';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Start />,
    },
]);

const App = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App
