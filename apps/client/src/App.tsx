import { BrowserRouter } from 'react-router-dom'
import { RouterProvider } from '@/router'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { PreviewModal } from '@/components/preview-modal'

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster richColors position="top-center" />
      <PreviewModal />
      <BrowserRouter>
        <RouterProvider />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
