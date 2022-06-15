import { Redirect, Route, Switch } from "react-router-dom"

import React from "react"
import Claim from '../pages/Claim'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Claim} />
      <Route render={() => <Redirect to="/"/>}/>
    </Switch>
  )
}
