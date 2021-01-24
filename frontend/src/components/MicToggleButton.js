import Button from 'react-bootstrap/Button';

export default function MicToggleButton(props) {
    if (props.audio) {
        return (
            <Button
                variant='outline-secondary'
                className='icon-wrapper'
                onClick={props.onClick}
            >
                <i className='bi bi-mic'></i>
            </Button>
        );
    } else {
        return (
            <Button
                variant='secondary'
                className='icon-wrapper'
                onClick={props.onClick}
            >
                <i className="bi bi-mic-mute-fill"></i>
            </Button>
        );
    }
};
