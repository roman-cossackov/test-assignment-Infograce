import './App.css';

import { XMLParser } from 'fast-xml-parser';
import { LatLngTuple } from 'leaflet';
import { ReactNode, useEffect, useState } from 'react';
import { Polygon, Popup } from 'react-leaflet';

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

      //   const jsonData = xmlJs.xml2json(xmlString, { compact: true, spaces: 4 });
      const parser = new XMLParser();
      const parsedJsonData = parser.parse(xmlString);

      const coordinates: string[][] = [];
      parsedJsonData['tns:forestReforestation']['tns:locationInformation']['tns:row'][
        'tns:explication'
      ]['tns:row'].forEach((point: any) => {
        coordinates.push([point['tns:latitude'], point['tns:longitude']]);
      });

      const attributes = {
        number: parsedJsonData['tns:forestReforestation']['tns:number'],
        date: parsedJsonData['tns:forestReforestation']['tns:date'],
        coordinates: coordinates,
      };
      console.log(attributes);

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

    const polygon = (
      <Polygon pathOptions={pathOptions} positions={positions}>
        <Popup>
          <div>Номер объекта: {attributes?.number}</div>
          <div>Дата объекта: {attributes?.date}</div>
        </Popup>
      </Polygon>
    );

    setPolygon(polygon);
    setCurLocation(positions[0]);
  }, [attributes]);

  return (
    <div className="App">
      <Upload setData={setData} allowedExtension="xml" />
      {attributes ? (
        <div className="coordinates">
          <h2>Координаты</h2>
          <div>
            {attributes.coordinates.map((c, index) => (
              <div key={index}>{c.join(', ')}</div>
            ))}{' '}
          </div>
        </div>
      ) : (
        ''
      )}

      <Map polygon={polygon} curLocation={curLocation} scrollIntoView={true} />
    </div>
  );
}

export default App;
