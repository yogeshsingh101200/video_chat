import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import AddContact from './AddContact';

const fetchContacts = () => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    return axios.get('api/auth/contacts', config);
};

function Search(props) {

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts()
            .then(res => {
                const contacts = res.data;
                Promise.all(contacts.map(contact => axios.get(`api/users/${contact.person}`)))
                    .then(responses => {
                        responses.forEach(response => {
                            const contact = contacts.find(contact => contact.person === response.data.id);
                            contact.person = response.data.username;
                        });
                        setContacts(contacts);
                    })
                    .catch(exception => {
                        console.log('exception', exception);
                        console.log('exception.response', exception.response);
                    });
            })
            .catch(exception => {
                console.log('exception', exception);
                console.log('exception.response', exception.response);
            });
    }, []);

    return (
        <ListGroup className="mt-2">
            {contacts.map(contact => (
                <ListGroup.Item
                    key={contact.id}
                    action
                    onClick={() => props.setRemoteUsername(contact.person)}
                >
                    {contact.contact_name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default function Contact(props) {

    const [tab, setTab] = useState('search');

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className='text-center w-100'>
                    Contacts
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <div className={`nav-link pointer ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>Search</div>
                    </li>
                    <li className="nav-item">
                        <div className={`nav-link pointer ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>Add Contact</div>
                    </li>
                </ul>
                <div>
                    {tab === 'search' && (<div className='modal-tab'>
                        <Search
                            setRemoteUsername={username => {
                                props.handleClose();
                                props.setRemoteUsername(username);
                            }}
                        />
                    </div>)}
                    {tab === 'add' && <div className='modal-tab'> <AddContact /></div>}
                </div>
            </Modal.Body>
        </Modal>
    );
}
