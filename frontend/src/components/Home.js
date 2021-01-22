import React from 'react';

export default function Home(props) {
    return (
        <h1 className='mt-5 text-center'>
            Hello, {props.user.username}!
        </h1>
    );
}
