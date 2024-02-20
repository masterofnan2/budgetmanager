import React from 'react';

const centerDivStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

export default function LoadingPage() {
    return <>
        <div>
            <div className='d-flex justify-content-center align-content-center' style={centerDivStyle}>
                <div className="mx-2 spinner-grow text-primary spinner-grow-lg"
                    role="status">
                </div>
                <div className="mx-2 spinner-grow text-secondary spinner-grow-lg"
                    role="status">
                </div>
                <div className="mx-2 spinner-grow text-muted spinner-grow-lg"
                    role="status">
                </div>
                <div className="mx-2 spinner-grow text-dark spinner-grow-lg"
                    role="status">
                </div>
                <div className="mx-2 spinner-grow text-success spinner-grow-lg d-none d-sm-block"
                    role="status">
                </div>
                <div className="mx-2 spinner-grow text-info spinner-grow-lg d-none d-sm-block"
                    role="status">
                </div>
            </div>
        </div>
    </>
}
