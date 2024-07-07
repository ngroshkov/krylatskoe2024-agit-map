import React from 'react';

type UseMapImageOptions = {
    mapRef: React.MutableRefObject<any>;
    name: string
    url: string
}

export default function useMapImage({ mapRef, url, name }: UseMapImageOptions) {
    React.useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            map.loadImage(url, (error: any, image: any) => {
                if (error) throw error;
                if (!map.hasImage(name)) map.addImage(name, image, { sdf: true });
            });
        }
    }, [mapRef]);
}