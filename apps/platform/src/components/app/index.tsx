import { AlertComponent, ToastComponent, ContextMenu } from 'amis'
import React, { useEffect } from 'react'
import { Switch, Router, Route } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'

import { app } from '@core/app'
import GlobalStyle from '@core/styled/global'
import { useImmer } from '@core/utils/hooks'

import OrgLogin from '~/pages/org/login'
import SysLogin from '~/pages/sys/login'
import { PrivateRoute, CustomRoute } from '~/routes/route'

import Layout from '../layout'
import { initState, AppContext, AppContextState } from './context'
import { AppStyle } from './styled'

export type State = Omit<AppContextState, 'setContext'> & {
  theme: string
}

export default () => {
  const [state, setState] = useImmer<State>({
    custom: initState.custom,
    theme: app.theme.getName(),
  })

  const { custom, theme } = state
  const contextValue = { ...state, setContext: setState as any }

  useEffect(() => {
    const { title } = custom
    if (title) {
      document.title = title
    }
  }, [custom])

  return (
    <Router history={app.routerHistory}>
      <ToastComponent
        closeButton
        className="m-t-xl"
        theme={theme}
        timeout={app.constants.toastDuration}
      />
      <AlertComponent theme={theme} />
      <ContextMenu theme={theme} />
      <ThemeProvider theme={app.theme.getTheme()}>
        <GlobalStyle />
        <AppStyle />
        <AppContext.Provider value={contextValue}>
          <CustomRoute path="/">
            <Switch>
              <Route path="/org/:orgId/login" component={OrgLogin} />
              <Route path="/sys/login" component={SysLogin} />
              <Route path="/sys/register" component={SysLogin} />

              <PrivateRoute path="/">
                <Route path="/org/:orgId">
                  <Layout type="org" />
                </Route>
                <Route path="/sys/">
                  <Layout type="sys" />
                </Route>
              </PrivateRoute>
              <Route path="*" component={() => <div>404</div>} />
            </Switch>
          </CustomRoute>
        </AppContext.Provider>
      </ThemeProvider>
    </Router>
  )
}
