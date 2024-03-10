import './App.css';

import { LatLngTuple } from 'leaflet';
import { ReactNode, useEffect, useState } from 'react';
import { Polygon, useMap } from 'react-leaflet';
import xmlJs from 'xml-js';

import Map from './components/Map/Map';
import Upload from './components/Upload/Upload';

interface Attributes {
  number: string;
  date: string;
  coordinates: string[][];
}

function App() {
  const [data, setData] = useState<File>();
  const [attributes, setAttributes] = useState<Attributes>();
  const [polygon, setPolygon] = useState<ReactNode>();
  const [curLocation, setCurLocation] = useState<LatLngTuple>();

  useEffect(() => {
    if (!data) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlString = e.target?.result as string;

      const jsonData = xmlJs.xml2json(xmlString, { compact: true, spaces: 4 });
      const parsedJsonData = JSON.parse(jsonData);

      const coordinates: string[][] = [];
      parsedJsonData['tns:forestReforestation']['tns:locationInformation']['tns:row'][
        'tns:explication'
      ]['tns:row'].forEach((point: any) => {
        coordinates.push([
          point['tns:latitude']['_text'],
          point['tns:longitude']['_text'],
        ]);
      });

      const attributes = {
        number: parsedJsonData['tns:forestReforestation']['tns:number']['_text'],
        date: parsedJsonData['tns:forestReforestation']['tns:date']['_text'],
        coordinates: coordinates,
      };

      setAttributes(attributes);
    };

    reader.readAsText(data);
  }, [data]);

  useEffect(() => {
    const pathOptions = { color: 'purple' };
    const positions: LatLngTuple[] = [];
    attributes?.coordinates.forEach((arr) => {
      positions.push([+arr[0], +arr[1]]);
    });

    const polygon = <Polygon pathOptions={pathOptions} positions={positions} />;

    setPolygon(polygon);
    setCurLocation(positions[0]);
  }, [attributes]);

  return (
    <div className="App">
      <Upload setData={setData} allowedExtension="xml" />
      <div className="coordinates">Координаты:</div>
      <Map polygon={polygon} curLocation={curLocation} scrollIntoView={true} />
    </div>
  );
}

export default App;
