
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/app-routes.tsx'
import { ThemeToggle } from './components/ui/theme-toggle.tsx'
import { UIProvider } from './contexts/ui-context.tsx'

createRoot(document.getElementById('root')!).render(
  <UIProvider>
    <ThemeToggle />
    <AppRoutes />
  </UIProvider>
)
