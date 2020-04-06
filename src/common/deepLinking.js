const pako = require('pako');

const serializeStream = (stream) => {
    return btoa(pako.deflate(JSON.stringify(stream), { to: 'string' }));
};

const deserializeStream = (stream) => {
    return JSON.parse(pako.inflate(atob(stream), { to: 'string' }));
};

const withMetaItem = ({ metaItem }) => {
    return {
        meta_details_videos: `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}`,
        meta_details_streams: typeof metaItem.behaviorHints.defaultVideoId === 'string' ?
            `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}/${encodeURIComponent(metaItem.behaviorHints.defaultVideoId)}`
            :
            null
    };
};

const withLibItem = ({ libItem, streams = {} }) => {
    const videoId = typeof libItem.state.video_id === 'string' ?
        libItem.state.video_id
        :
        typeof libItem.behaviorHints.defaultVideoId === 'string' ?
            libItem.behaviorHints.defaultVideoId
            :
            null;
    const [stream, streamTransportUrl, metaTransportUrl] = typeof videoId === 'string' && typeof streams[`${encodeURIComponent(libItem._id)}/${encodeURIComponent(videoId)}`] === 'object' ?
        streams[`${encodeURIComponent(libItem._id)}/${encodeURIComponent(videoId)}`]
        :
        [];
    return {
        meta_details_videos: `#/metadetails/${encodeURIComponent(libItem.type)}/${encodeURIComponent(libItem._id)}`,
        meta_details_streams: typeof videoId === 'string' ?
            `#/metadetails/${encodeURIComponent(libItem.type)}/${encodeURIComponent(libItem._id)}/${encodeURIComponent(videoId)}`
            :
            null,
        // TODO check if stream is external
        player: typeof videoId === 'string' && typeof stream === 'object' && typeof streamTransportUrl === 'string' && typeof metaTransportUrl === 'string' ?
            `#/player/${serializeStream(stream)}/${encodeURIComponent(streamTransportUrl)}/${encodeURIComponent(metaTransportUrl)}/${encodeURIComponent(libItem.type)}/${encodeURIComponent(libItem._id)}/${encodeURIComponent(videoId)}`
            :
            null
    };
};

const withVideo = ({ metaItem, video, metaTransportUrl, streams = {} }) => {
    const [stream, streamTransportUrl] = typeof streams[`${encodeURIComponent(metaItem.id)}/${encodeURIComponent(video.id)}`] === 'object' ?
        streams[`${encodeURIComponent(metaItem.id)}/${encodeURIComponent(video.id)}`]
        :
        [];
    return {
        streams: `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}/${encodeURIComponent(video.id)}`,
        // TODO check if stream is external
        player: typeof stream === 'object' && typeof streamTransportUrl === 'string' ?
            `#/player/${serializeStream(stream)}/${encodeURIComponent(streamTransportUrl)}/${encodeURIComponent(metaTransportUrl)}/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}/${encodeURIComponent(video.id)}`
            :
            Array.isArray(video.streams) && video.streams.length === 1 ?
                `#/player/${serializeStream(video.streams[0])}/${encodeURIComponent(metaTransportUrl)}/${encodeURIComponent(metaTransportUrl)}/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}/${encodeURIComponent(video.id)}`
                :
                null
    };
};

const withStream = ({ stream, streamTransportUrl, metaTransportUrl, type, id, videoId }) => {
    return {
        player: typeof metaTransportUrl === 'string' && typeof type === 'string' && typeof id === 'string' && videoId === 'string' ?
            `#/player/${serializeStream(stream)}/${encodeURIComponent(streamTransportUrl)}/${encodeURIComponent(metaTransportUrl)}/${encodeURIComponent(type)}/${encodeURIComponent(id)}/${encodeURIComponent(videoId)}`
            :
            `#/player/${serializeStream(stream)}`
    };
};

const withCatalog = ({ request }) => {
    return {
        discover: `#/discover/${encodeURIComponent(request.base)}/${encodeURIComponent(request.path.type_name)}/${encodeURIComponent(request.path.id)}?${new URLSearchParams(request.path.extra).toString()}`
    };
};

module.exports = {
    withCatalog,
    withMetaItem,
    withLibItem,
    withVideo,
    withStream,
    serializeStream,
    deserializeStream
};
