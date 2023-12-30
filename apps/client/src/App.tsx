import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  )
}

export default App
