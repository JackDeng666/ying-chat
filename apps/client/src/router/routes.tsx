import { Navigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { AppLayout } from '@/components/layout'
import { Login } from '@/pages/account/login'
import { Register } from '@/pages/account/register'
import { ConversationPage } from '@/pages/conversation'
import { ContactDetail, ContactPage } from '@/pages/contact'
import { DefaultWrap } from './default-wrap'

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
        element: <ContactPage />,
        children: [
          {
            index: true,
            element: (
              <DefaultWrap>
                <Users size={60} />
              </DefaultWrap>
            )
          },
          {
            path: 'group/:groupId',
            element: <ContactDetail />
          }
        ]
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
