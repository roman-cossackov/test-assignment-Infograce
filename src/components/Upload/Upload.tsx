import { useState } from 'react';

import styles from './Upload.module.scss';

interface UploadProps {
  setData: React.Dispatch<React.SetStateAction<File | undefined>>;
  allowedExtension: string;
}

const Upload = ({ setData, allowedExtension }: UploadProps) => {
  const [fileName, setFileName] = useState('Файл не выбран');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      const allowedExtensions = [allowedExtension];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileExtension === undefined) return;

      if (!allowedExtensions.includes(fileExtension)) {
        alert('Invalid file format. Please select an XML file.');
        return;
      }

      setData(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className={styles.Upload}>
      <label htmlFor="upload" className={styles.button}>
        Загрузить файл
      </label>
      <input type="file" id="upload" onChange={handleFileChange} hidden />
      <h2>{fileName && <div className={styles.fileName}>Имя файла: {fileName}</div>}</h2>
    </div>
  );
};

export default Upload;
