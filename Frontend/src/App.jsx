import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { Authprovider } from "./features/auth/auth.context"
function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
