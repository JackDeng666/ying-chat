import { Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { Login } from '@/pages/account/login'
import { Register } from '@/pages/account/register'
import { ConversationPage } from '@/pages/conversation'
import { ContactPage } from '@/pages/contact'

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="conversation" />
      },
      {
        path: 'conversation',
        element: <ConversationPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]
