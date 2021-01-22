import { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Home from './Home';
import axios from 'axios';

export default function App() {

    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // request user with token
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            };

            axios
                .get('/api/auth/user', config)
                .then(res => {
                    setUser(res.data.user);
                    setAuthenticated(true);
                })
                .catch(exception => {
                    console.log('exception', exception);
                    console.log('exception.response', exception.response);
                    setAuthenticated(false);
                });
        }
    }, []);

    return (
        <Router>
            <Header
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
                setUser={setUser}
            />
            <Switch>
                <Route exact path='/'>
                    {
                        authenticated ?
                            <Home
                                user={user}
                            /> :
                            <Redirect exact to='/login' />
                    }
                </Route>
                <Route exact path='/login'>
                    {
                        authenticated ?
                            <Redirect exact to='/' /> :
                            <Login
                                setAuthenticated={setAuthenticated}
                                setUser={setUser}
                            />
                    }
                </Route>
                <Route exact path='/register'>
                    {
                        authenticated ?
                            <Redirect exact to='/' /> :
                            <Register
                                setAuthenticated={setAuthenticated}
                                setUser={setUser}
                            />
                    }
                </Route>
            </Switch>
        </Router>
    );
}
