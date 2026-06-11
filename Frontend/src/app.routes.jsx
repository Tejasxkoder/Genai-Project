import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login"
 import Register from "./features/auth/pages/Register";
import home from "./features/interview/pages/home"

export const router= createBrowserRouter([
    {
    path: "/login",
    element:<Login/>
    },
    {
    path:"/register",
    element:<Register/>
    },
    {
        path:"/",
        element:<Protected><h1><home/></h1></Protected>
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><h1><home/></h1></Protected>
    }
])