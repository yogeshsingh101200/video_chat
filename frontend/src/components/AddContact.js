import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    contact_name: Yup.string()
        .required('Required')
        .max(150, 'Must be 150 or less characters long'),
    person: Yup.string()
        .required('Required')
        .max(150, 'Must be 150 or less characters long'),
});

const handleSubmit = (values, actions) => {
    axios
        .get(`/api/users?username=${values.person}`)
        .then(res => {
            const person = res.data[0].id;
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            };
            const body = {
                person: person,
                contact_name: values.contact_name
            };
            axios
                .post('/api/auth/contacts', body, config)
                .then(res => {
                    console.log(res.data);
                })
                .catch(exception => {
                    if (exception.response && exception.response.status === 400) {
                        actions.setFieldError('general', exception.response.data.non_field_errors[0]);
                    } else {
                        console.log('exception', exception);
                        console.log('exception.response', exception.response);
                    }
                });
        })
        .catch(exception => {
            if (exception.response && exception.response.status === 400) {
                console.log(exception.response.data);
                actions.setFieldError('general', exception.response.data.non_field_errors[0]);
            } else {
                console.log('exception', exception);
                console.log('exception.response', exception.response);
            }
        })
        .finally(
            actions.setSubmitting(false)
        );
};


export default function AddContact() {
    return (
        <div className='form-container mx-auto mt-3'>
            <Formik
                initialValues={{ contact_name: '', person: '' }}
                validationSchema={schema}
                onSubmit={(values, actions) => handleSubmit(values, actions)}
            >
                {formik => (
                    <Form onSubmit={formik.handleSubmit} noValidate>
                        {
                            formik.errors.general && (
                                <div className='text-center form-level-errors'>
                                    {formik.errors.general}
                                </div>
                            )
                        }
                        <Form.Group controlId='contact-name'>
                            <Form.Label>Contact Name</Form.Label>
                            <Form.Control
                                type='text'
                                name='contact_name'
                                placeholder='Enter contact name'
                                isValid={formik.touched.contact_name && !formik.errors.contact_name}
                                isInvalid={formik.touched.contact_name && formik.errors.contact_name}
                                value={formik.values.contact_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <Form.Control.Feedback type='valid'>
                                Looks Good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>
                                {formik.errors.contact_name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId='person'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name='person'
                                placeholder='Enter username'
                                isValid={formik.touched.person && !formik.errors.person}
                                isInvalid={formik.touched.person && formik.errors.person}
                                autoComplete='off'
                                value={formik.values.person}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <Form.Control.Feedback type='valid'>
                                Looks Good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>
                                {formik.errors.person}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant='primary' type='submit' block disabled={formik.isSubmitting}>
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
