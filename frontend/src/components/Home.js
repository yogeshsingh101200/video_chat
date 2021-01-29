import { Component } from 'react';
import Video from './Video';
import Call from './Call';
import Peer from 'peerjs';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import VideoToggleButton from './VideoToggleButton';
import MicToggleButton from './MicToggleButton';
import HangUpButton from './HangUpButton';

var peer;
const peers = {};
const dataPeers = {};

export class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            myStream: null,
            remoteStream: null,
            remoteUsername: '',
            connected: false,
            busy: false,
            video: true,
            audio: true
        };
    }

    componentDidMount() {
        const constraints = {
            video: true,
            audio: true,
            aspectRatio: 1.7777777778
        };

        navigator
            .mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                this.setState({ myStream: stream });
            })
            .catch(exception => {
                console.log('exception', exception);
            });

        peer = new Peer(this.props.user.username);

        peer.on('open', id => {
            this.setState({ connected: true });
        });

        peer.on('connection', conn => {
            if (this.state.busy) {
                conn.close();
            } else {
                this.setState({
                    remoteUsername: conn.peer,
                    busy: true
                });
                dataPeers[conn.peer] = conn;
                conn.on('close', () => {
                    const remoteUsername = this.state.remoteUsername;
                    peers[remoteUsername].close();
                    delete peers[remoteUsername];
                    delete dataPeers[remoteUsername];
                });
            }
        });

        peer.on('call', call => {
            call.answer(this.state.myStream);
            call.on('stream', remoteStream => {
                if (!peers[call.peer]) {
                    this.setState({
                        remoteStream: remoteStream,
                    });
                    peers[call.peer] = call;
                }
            });
            call.on('close', () => {
                this.setState({
                    remoteStream: null,
                    remoteUsername: '',
                    busy: false,
                });
            });
        });
    }

    componentWillUnmount() {
        const tracks = this.state.myStream.getTracks();
        tracks.forEach(track => track.stop());
    }

    makeCall = () => {
        const call = peer.call(this.state.remoteUsername, this.state.myStream);
        call.on('stream', remoteStream => {
            if (!peers[call.peer]) {
                this.setState({
                    remoteStream: remoteStream,
                });
                peers[call.peer] = call;
            }
        });
        call.on('close', () => {
            this.setState({
                remoteStream: null,
                remoteUsername: '',
                busy: false
            });
        });
    };

    makeConnection = () => {
        const conn = peer.connect(this.state.remoteUsername);
        conn.on('open', () => {
            this.setState({ busy: true });
            this.makeCall();
            dataPeers[conn.peer] = conn;
        });
        conn.on('close', () => {
            const remoteUsername = this.state.remoteUsername;
            peers[remoteUsername].close();
            delete peers[remoteUsername];
            delete dataPeers[remoteUsername];
        });
    };

    toggleVideo = () => {
        this.state.myStream.getTracks().forEach(track => {
            if (track.kind === 'video') {
                track.enabled = !track.enabled;
                this.setState(state => ({ video: !state.video }));
            }
        });
    };

    toggleAudio = () => {
        this.state.myStream.getTracks().forEach(track => {
            if (track.kind === 'audio') {
                track.enabled = !track.enabled;
                this.setState(state => ({ audio: !state.audio }));
            }
        });
    };

    render() {
        return (
            <>
                <div className='container d-flex flex-column'>
                    {this.state.connected && <div className='mx-auto mt-2'>
                        <Call
                            disabled={this.state.busy}
                            remoteUsername={this.state.remoteUsername}
                            setRemoteUsername={username => this.setState({
                                remoteUsername: username
                            })}
                            makeCall={this.makeConnection}
                        />
                    </div>}
                    {!!this.state.myStream && (<div className='videos-container flex-grow-1'>
                        <div className='max-screen'>
                            <Video mediaStream={this.state.remoteStream} />
                        </div>
                        <div className='min-screen'>
                            <Video mediaStream={this.state.myStream} />
                        </div>
                    </div>)}
                </div>
                <Navbar bg="dark" variant="dark" fixed='sticky'>
                    <Nav className="mx-auto">
                        <MicToggleButton
                            audio={this.state.audio}
                            onClick={this.toggleAudio}
                        />
                        <div className='ml-3'></div>
                        <VideoToggleButton
                            video={this.state.video}
                            onClick={this.toggleVideo}
                        />
                        <div className='ml-3'></div>
                        <HangUpButton
                            disabled={!this.state.busy}
                            onClick={() => { dataPeers[this.state.remoteUsername].close(); }}
                        />
                    </Nav>
                </Navbar>
            </>
        );
    }
}

export default Home;
