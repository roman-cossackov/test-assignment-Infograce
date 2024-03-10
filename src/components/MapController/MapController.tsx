import { LatLngTuple } from 'leaflet';
import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  location: LatLngTuple | undefined;
}

const MapController: FC<MapControllerProps> = ({ location }) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location: LatLngTuple) => {
    map.flyTo(location, 13, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if (location) {
      flyTo(location);
    }
  }, [location]);

  return null;
};

export { MapController };
