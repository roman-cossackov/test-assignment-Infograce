import 'leaflet/dist/leaflet.css';

import { LatLngTuple } from 'leaflet';
import { ReactNode, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { MapController } from '../MapController/MapController';
import styles from './Map.module.scss';

interface MapProps {
  polygon: ReactNode;
  curLocation: LatLngTuple | undefined;
  scrollIntoView: boolean;
}

const Map = ({ polygon, curLocation, scrollIntoView }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollIntoView && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [polygon]);
  return (
    <div className={styles.map} ref={mapRef}>
      <MapContainer
        className={styles.mapContainer}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://tile.opentopomap.org/{z}/{x}/{y}.png" />
        <MapController location={curLocation} />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {polygon ?? ''}
      </MapContainer>
    </div>
  );
};

export default Map;
