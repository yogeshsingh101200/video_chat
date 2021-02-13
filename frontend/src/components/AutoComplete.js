import { useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';

const handleChange = (event, setValue, options, setContacts) => {
    const value = event.target.value;
    const contacts = options.filter(option => option.contact_name.indexOf(value) > -1);
    setValue(value);
    setContacts(contacts);
};

export default function AutoComplete(props) {
    const [value, setValue] = useState('');
    return (
        <FormControl
            className='mt-2'
            size='sm'
            value={value}
            onChange={e => handleChange(e, setValue, props.options, props.setContacts)}
        />
    );
}
