import Button from 'react-bootstrap/Button';

export default function VideoToggleButton(props) {
    if (props.video) {
        return (
            <Button
                variant='outline-light'
                className='icon-wrapper'
                onClick={props.onClick}
            >
                <i className='bi bi-camera-video'></i>
            </Button>
        );
    } else {
        return (
            <Button
                variant='light'
                className='icon-wrapper'
                onClick={props.onClick}
            >
                <i className='bi bi-camera-video-off-fill'></i>
            </Button>
        );
    }
};
