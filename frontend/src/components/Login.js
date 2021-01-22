import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    username: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required('Required')
});

const handleSubmit = (values, actions, setAuthenticated, setUser) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify(values);

    axios
        .post('/api/auth/login', body, config)
        .then(res => {
            localStorage.setItem('token', res.data.token);
            // login user
            setUser(res.data.user);
            setAuthenticated(true);
        })
        .catch(exception => {
            if (exception.response && exception.response.status === 400) {
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

export default function Login(props) {
    return (
        <div className='form-container mx-auto mt-5'>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={schema}
                onSubmit={(values, actions) => handleSubmit(values, actions, props.setAuthenticated, props.setUser)}
            >
                {formik => (
                    <Form onSubmit={formik.handleSubmit} noValidate>
                        <h3 className='mb-3 font-weight-normal text-center'>Login</h3>
                        {
                            formik.errors.general && (
                                <div className='text-center form-level-errors'>
                                    {formik.errors.general}
                                </div>
                            )
                        }
                        <Form.Group controlId='username'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name='username'
                                placeholder='Enter username'
                                isValid={formik.touched.username && !formik.errors.username}
                                isInvalid={formik.touched.username && formik.errors.username}
                                autoComplete='off'
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <Form.Control.Feedback type='valid'>
                                Looks Good!
                                </Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>
                                {formik.errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                name='password'
                                placeholder='Enter password'
                                isValid={formik.touched.password && !formik.errors.password}
                                isInvalid={formik.touched.password && formik.errors.password}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <Form.Control.Feedback type='valid'>
                                Looks Good!
                                </Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>
                                {formik.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant='primary' type='submit' block disabled={formik.isSubmitting}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </div >
    );
}