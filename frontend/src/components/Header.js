import { Link, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Header(props) {
    return (
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand as={Link} to='/'>Video Chat</Navbar.Brand>
            <Nav className='ml-auto'>
                {props.authenticated ? (
                    <Nav.Link
                        as={NavLink}
                        to='#'
                        onClick={() => {
                            localStorage.removeItem('token');
                            props.setAuthenticated(false);
                        }}
                        className='font-weight-bold'
                    >
                        Logout
                    </Nav.Link>
                ) : (
                        <>
                            <Nav.Link
                                as={NavLink}
                                to='/login'
                                className='font-weight-bold'
                            >
                                Login
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to='/register'
                                className='font-weight-bold'
                            >
                                Register
                            </Nav.Link>
                        </>
                    )}
            </Nav>
        </Navbar>
    );
}
