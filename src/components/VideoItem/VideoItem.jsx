import React from 'react';
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../context/UserDataProvider";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import './VideoItem.css';

const VideoItem = ({ video }) => {
    const { title, image_path, video_id } = video;
    const navigate = useNavigate();
    const { isLoggedIn } = useUserData();
    const { setIsVisiableRootModal } = useIsVisiableRootModal();


    const HandlePlayVideo = async () => {
        if (isLoggedIn) {
            navigate(`/user/play-video/${title}/${video_id}/${encodeURIComponent(image_path)}`);
        }
        else {
            //gọi state hiện modal
            setIsVisiableRootModal(true);
        }
    }

    return (
        <div
            className="video-item-container"
            onClick={HandlePlayVideo}
        >
            <div className="video-item-thumbnail">
                <img src={image_path} alt={title} className="video-item-image" />
            </div>
            <h4 className="video-item-title">{title}</h4>
        </div>
    );
};

export default VideoItem;