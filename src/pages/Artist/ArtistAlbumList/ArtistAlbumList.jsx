import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/axiosConfig";
import { useTranslation } from 'react-i18next';
import { formatDate } from "../../../helpers/dateFormatter";
import { useNavigate } from "react-router-dom";
import './ArtistAlbumList.css';

const ArtistAlbumList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axiosInstance.get('/artist/albums/');
                setAlbums(response.data);
            } catch (err) {
                setError('Failed to fetch albums');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    // Hàm tạo mới album
    const handleCreateAlbum = () => {
        navigate("/artist/albums/new");
        // Logic tạo album mới (ví dụ: điều hướng đến trang tạo album)
        console.log('Create new album');
    };

    return (
        <div className="artist-album-container">
            <header className="artist-album-header">
                <h1 className="artist-album-title">{t('artist.artistAlbum.yourAlbums')}</h1>
                <p className="artist-album-subtitle">{t('artist.artistAlbum.manageAlbums')}</p>
                <button className="create-album-button" onClick={handleCreateAlbum}>
                    {t('artist.artistAlbum.createNewAlbum')}
                </button>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <section className="artist-album-list">
                    <div className="artist-album-table-header">
                        <span className="artist-album-column artist-album-index-col">#</span>
                        <span className="artist-album-column artist-album-image-col"></span>
                        <span className="artist-album-column artist-album-title-col">{t('artist.artistAlbum.albumName')}</span>
                        <span className="artist-album-column artist-album-release-col">{t('artist.artistAlbum.releaseDate')}</span>
                        <span className="artist-album-column artist-album-songs-col">{t('artist.artistAlbum.songCount')}</span>
                        <span className="artist-album-column artist-album-songs-col">{t('artist.artistAlbum.playCount')}</span>
                    </div>

                    {albums.map((album, index) => (
                        <div key={album.id} className="artist-album-row">
                            <span className="artist-album-column artist-album-index-col">{index + 1}</span>
                            <span className="artist-album-column artist-album-image-col">
                                <img
                                    src={album.image_path}
                                    alt={album.name}
                                    className="artist-album-image"
                                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                />
                            </span>
                            <span className="artist-album-column artist-album-title-col">{album.name}</span>
                            <span className="artist-album-column artist-album-release-col">{formatDate(album.created_at, "long")}</span>
                            <span className="artist-album-column artist-album-songs-col">{album.song_count}</span>
                            <span className="artist-album-column artist-album-songs-col">{album.play_count}</span>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default ArtistAlbumList;
