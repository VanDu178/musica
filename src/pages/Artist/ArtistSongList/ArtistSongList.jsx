import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from "../../../config/axiosConfig";
import { formatDate } from "../../../helpers/dateFormatter";
import { formatTime } from "../../../helpers/timeFormatter";
import { checkData } from "../../../helpers/encryptionHelper";
import { useUserData } from "../../../context/UserDataProvider";
import Forbidden from "../../../components/Error/403/403";

import './ArtistSongList.css';

const ArtistSongList = () => {
    const { t } = useTranslation();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                //nếu đang login thì check role phải artist không
                const checkedRoleUser = await checkData(2);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            }
        };

        fetchRole();
    }, [isLoggedIn]);


    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axiosInstance.get('/artist/songs/');
                setSongs(response.data);
            } catch (err) {
                setError('Failed to fetch songs');
            } finally {
                setLoading(false);
            }
        }

        fetchSongs();
    }, []);

    if (!validRole || !isLoggedIn) {
        return <Forbidden />;
    }

    return (
        <div className="artist-song-container">
            <header className="artist-song-header">
                <h1 className="artist-song-title">{t('artist.artistSong.your_songs')}</h1>
                <p className="artist-song-subtitle">{t('artist.artistSong.manage_tracks')}</p>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <section className="artist-song-list">
                    <div className="artist-song-table-header">
                        <span className="artist-song-column artist-song-index-col">#</span>
                        <span className="artist-song-column artist-song-image-col"></span>
                        <span className="artist-song-column artist-song-title-col">{t('artist.artistSong.title')}</span>
                        <span className="artist-song-column artist-song-duration-col">{t('artist.artistSong.duration')}</span>
                        <span className="artist-song-column artist-song-streams-col">{t('artist.artistSong.streams')}</span>
                        <span className="artist-song-column artist-song-release-col">{t('artist.artistSong.release_date')}</span>
                    </div>

                    {songs.map((song, index) => (
                        <div key={song.id} className="artist-song-row">
                            <span className="artist-song-column artist-song-index-col">{index + 1}</span>
                            <span className="artist-song-column artist-song-image-col">
                                <img
                                    src={song.image_path}
                                    alt={song.title}
                                    className="artist-song-image"
                                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                />
                            </span>
                            <span className="artist-song-column artist-song-title-col">{song.title}</span>
                            <span className="artist-song-column artist-song-duration-col">{formatTime(song.duration)}</span>
                            <span className="artist-song-column artist-song-streams-col">{song.total_streams}</span>
                            <span className="artist-song-column artist-song-release-col">{formatDate(song.uploaded_at, "long")}</span>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default ArtistSongList;
