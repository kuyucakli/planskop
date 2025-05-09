"use client";
import {
    PropsWithChildren,
    RefObject,
    useRef,
} from "react";


type WebCamVideoProps = PropsWithChildren & {
    doOnVideoReady: () => void;
    videoRef: RefObject<HTMLVideoElement>;
    disabled?: boolean;
    width?: number;
    height?: number;
};

export default function WebcamVideo({
    doOnVideoReady,
    videoRef,
    children,
    disabled = false,
    width = 640,
    height = 480,
}: WebCamVideoProps) {
    const liveViewRef = useRef<HTMLDivElement>(null);

    function handleCam() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            const constraints = {
                video: true,
            };
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                (videoRef.current as HTMLVideoElement).srcObject = stream;
                doOnVideoReady();
            });
        }
    }

    return (
        <>
            <button id="webcamButton" onClick={handleCam} disabled={disabled}>
                Enable Webcam
            </button>

            <div ref={liveViewRef} id="liveView">
                <video
                    ref={videoRef}
                    id="webcam"
                    autoPlay
                    width={width}
                    height={height}
                ></video>
                {children}
            </div>
        </>
    );
}


