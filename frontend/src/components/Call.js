import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

export default function Call(props) {
    return (
        <div className='caller'>
            <InputGroup className='mb-3'>
                <FormControl
                    placeholder={`Recipient 's username`}
                    readOnly={props.disabled}
                    value={props.remoteUsername}
                    onChange={(e) => { props.setRemoteUsername(e.target.value); }}
                />
                <InputGroup.Append>
                    <Button
                        variant='success'
                        disabled={props.disabled}
                        onClick={props.makeCall}
                    >
                        Call
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    );
}
