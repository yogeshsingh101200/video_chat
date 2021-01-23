import ReactPlayer from 'react-player';

export default function Video(props) {
    return (
        <ReactPlayer
            height='100%'
            width='100%'
            url={props.mediaStream}
            playing
            muted
        />
    );
}
