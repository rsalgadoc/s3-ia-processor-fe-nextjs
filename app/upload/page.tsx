'use client';

import { StorageManager } from '@aws-amplify/ui-react-storage';
import Link from 'next/link';
import '@aws-amplify/ui-react/styles.css';           // Estilos base de Amplify UI

export default function UploadPage() {

  return (
    <main>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Subir archivos a tu bucket S3 existente</h1>

        <StorageManager
          // === Configuración importante para tu bucket existente ===
          path="public/"                          // ← debe coincidir con lo que definiste en backend.ts
          // path={({ identityId }) => `protected/${identityId}/`} // Ejemplo si quieres carpetas por usuario

          acceptedFileTypes={['image/*', '.pdf', '.doc', '.docx']} // tipos de archivos permitidos
          maxFileCount={5}                        // máximo de archivos a la vez
          maxFileSize={10 * 1024 * 1024}          // 10 MB por archivo (ajusta según necesites)

          // isResumable={true}                   // Activa subida resumible (bueno para archivos grandes)
          // showThumbnails={true}                // Muestra miniaturas (por defecto true para imágenes)

          onUploadSuccess={({ key }) => {
            console.log('✅ Archivo subido correctamente:', key);
            alert(`Archivo subido: ${key}`);
          }}

          onUploadError={(error) => {
            console.error('❌ Error al subir:', error);
            alert('Hubo un error al subir el archivo');
          }}
        />

        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Los archivos se guardarán en la carpeta <strong>public/</strong> de tu bucket S3.
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link href="/">
          <button style={{ width: '100%', textAlign: 'center' }}>
            Back to Home
          </button>
        </Link>
      </div>
    </main>
  );
}