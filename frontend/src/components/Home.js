import { Component } from 'react';
import Video from './Video';
import Call from './Call';
import Button from 'react-bootstrap/Button';
import Peer from 'peerjs';

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
                console.log('exception.response', exception.response);
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

    render() {
        return (
            <>
                <div className='container mx-auto mt-2'>
                    <div className='d-flex'>
                        <div className='mr-auto'>
                            <Button>Contacts</Button>
                            <Button className='ml-2'>Recent</Button>
                            <Button
                                variant='danger'
                                className='ml-2'
                                disabled={!this.state.busy}
                                onClick={() => { dataPeers[this.state.remoteUsername].close(); }}
                            >
                                Hang
                            </Button>
                        </div>
                        <div className='ml-auto'>
                            {this.state.connected && <Call
                                disabled={this.state.busy}
                                remoteUsername={this.state.remoteUsername}
                                setRemoteUsername={username => this.setState({
                                    remoteUsername: username
                                })}
                                makeCall={this.makeConnection}
                            />}
                        </div>
                    </div>
                </div>
                { !!this.state.myStream && (<div className='container videos-container'>
                    <div className='max-screen'>
                        <Video mediaStream={this.state.myStream} />
                    </div>
                    <div className='min-screen'>
                        <Video mediaStream={this.state.remoteStream} />
                    </div>
                </div>)}
            </>
        );
    }
}

export default Home;
