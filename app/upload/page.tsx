'use client';

import { StorageManager } from '@aws-amplify/ui-react-storage';
import Link from 'next/link';
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudUpload } from "lucide-react"
import '@aws-amplify/ui-react/styles.css';

export default function UploadPage() {

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Subir Archivos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Carga archivos a tu bucket S3
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload className="h-5 w-5" />
              Upload a S3
            </CardTitle>
            <CardDescription>
              Los archivos se guardarán en la carpeta <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">public/</code> de tu bucket.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StorageManager
              path="public/"
              acceptedFileTypes={['image/*', '.pdf', '.doc', '.docx']}
              maxFileCount={5}
              maxFileSize={10 * 1024 * 1024}

              onUploadSuccess={({ key }) => {
                console.log('✅ Archivo subido correctamente:', key);
              }}

              onUploadError={(error) => {
                console.error('❌ Error al subir:', error);
              }}
            />

            <div className="flex justify-end">
              <Button asChild>
                <Link href="/">Volver al Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}