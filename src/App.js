import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Game } from './Game';

const sock = io('http://10.40.25.26:8000',
  {transports: ['websocket', 'polling', 'flashsocket']}
)

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:gid?">
          <Game sock={sock} />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;