import { createBrowserRouter, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AddDrug from '../pages/AddDrug';
import ViewDrug from '../pages/ViewDrug';
import PurchasedDrugs from "../pages/PurchasedDrugs.jsx";
import UserSuppliedDrugs from "../pages/UserSuppliedDrugs.jsx";
import ErrorPage from "../components/ErrorPage.jsx"; // Import the ViewDrug component
// Import other components and pages as needed

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
       errorElement: <ErrorPage error='-1' />,
    },
    {
        path: '/add-drug',
        element: <AddDrug />,
        errorElement: <ErrorPage error='-1' />,
    },
    {
        path: '/drugs/:id', // Define the path with parameter
        element: <ViewDrug />, // Use the ViewDrug component as the element
        errorElement: <ErrorPage error='-1' />,
    },
    {
        path: '/purchased-drugs', // Define the path with parameter
        element: <PurchasedDrugs />, // Use the ViewDrug component as the element
        errorElement: <ErrorPage error='-1' />,
    },
    {
        path: '/supplied-drugs', // Define the path with parameter
        element: <UserSuppliedDrugs />, // Use the ViewDrug component as the element
        errorElement: <ErrorPage error='-1' />,
    },
    // Other routes
]);

export default routes;
