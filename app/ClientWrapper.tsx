'use client'

import { Provider } from 'react-redux'
import { store } from './store/store'
import { ReduxProvider } from './store/ReduxProvider'
import Providers from './providers'
import AuthInitializer from './utils/authInitialiser'
import ClientLayout from './ClientLayout'
import Header from './components/Header'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <ReduxProvider>
          <Providers>
            <Header />
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        </ReduxProvider>
      </AuthInitializer>
    </Provider>
  )
}
