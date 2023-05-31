type Torrent = [
    {
        extra: any[],
        id: string,
        resource: string,
        type: string,
    },
    {
        metaDetailsStreams: string | null,
        metaDetailsVideos: string | null,
        player: string | null,
    }
];

type StreamingServerSettings = {
    appPath: string,
    btDownloadSpeedHardLimit: number,
    btDownloadSpeedSoftLimit: number,
    btHandshakeTimeout: number,
    btMaxConnections: number,
    btMinPeersForStable: number,
    btRequestTimeout: number,
    cacheRoot: string,
    cacheSize: number,
    serverVersion: string,
};

type StreamingServer = {
    baseUrl: Loadable<string> | null,
    selected: {
        transportUrl: string,
    } | null,
    settings: Loadable<StreamingServerSettings> | null,
    torrent: [string, Loadable<Torrent>] | null,
};