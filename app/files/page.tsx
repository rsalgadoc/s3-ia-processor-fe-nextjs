'use client';
import { useState, useEffect } from 'react';
import { list, getUrl } from 'aws-amplify/storage';
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileIcon, FolderIcon, HardDrive, Download } from "lucide-react"

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || path;
}

async function downloadFile(filePath: string) {
  try {
    const { url } = await getUrl({
      path: filePath,
      options: {
        bucket: 'output-bucket-externo',
      },
    });
    // Forzar descarga usando fetch + blob para evitar que el navegador abra el archivo
    const response = await fetch(url.toString());
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = getFileName(filePath);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error descargando archivo:', error);
  }
}

export default function ListaArchivos() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const result = await list({
          path: 'resultados/public/',
          options: {
            bucket: 'output-bucket-externo'
          }
        });
        setFiles(result.items);
      } catch (error) {
        console.error('Error cargando archivos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const sortedFiles = [...files].sort((a, b) => {
    const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
    const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
    return dateB - dateA; // más reciente primero
  });

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mis Archivos en S3</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Archivos almacenados en <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">resultados/public/</code>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Archivos</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">archivos en el bucket</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamaño Total</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-muted-foreground">espacio utilizado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruta Base</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono text-muted-foreground truncate">resultados/public/</div>
            <p className="text-xs text-muted-foreground mt-1">bucket: output-bucket-externo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Archivos</CardTitle>
          <CardDescription>
            Todos los archivos disponibles en el bucket S3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Cargando archivos...
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
              <FolderIcon className="h-8 w-8" />
              <p>No se encontraron archivos en esta ruta.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[80px]">Descargar</TableHead>
                  <TableHead className="hidden md:table-cell">Última Modificación</TableHead>
                  <TableHead className="text-right">Tamaño</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFiles.map((file) => (
                  <TableRow key={file.path}>
                    <TableCell className="font-medium">{getFileName(file.path)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(file.path)}
                        title="Descargar archivo"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(file.lastModified)}
                    </TableCell>
                    <TableCell className="text-right">{formatFileSize(file.size)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
