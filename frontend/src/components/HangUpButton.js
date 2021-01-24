import Button from 'react-bootstrap/Button';

export default function HangUpButton(props) {
    return (
        <Button
            variant='danger hang-up'
            className='icon-wrapper'
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <i className="bi bi-telephone-fill"></i>
        </Button>
    );
}
