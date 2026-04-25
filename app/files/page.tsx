'use client';
import { useState, useEffect } from 'react';
import { list } from 'aws-amplify/storage';
import { Topbar } from "@/components/topbar"

export default function ListaArchivos() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        // Lista todos los archivos en la raíz del bucket
        const result = await list({
          path: 'resultados/public/', // O una ruta específica como 'public/'
          options: {
            bucket: 'output-bucket-externo' // Especificas cuál usar
          }
        });
        setFiles(result.items);
      } catch (error) {
        console.error('Error cargando archivos:', error);
      }
    }
    fetchFiles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div>
        <h1>Mis Archivos en S3</h1>
        <ul>
          {files.map((file) => (
            <li key={file.path}>{file.path} ({file.size} bytes)</li>
          ))}
        </ul>
      </div></div>
  );
}
