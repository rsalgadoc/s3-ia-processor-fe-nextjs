'use client';
import { useState, useEffect } from 'react';
import { list } from 'aws-amplify/storage';
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileIcon, FolderIcon, HardDrive } from "lucide-react"

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '—';
}

function getFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || path;
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
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Tamaño</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.path}>
                    <TableCell className="font-medium">{getFileName(file.path)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getFileExtension(file.path)}</Badge>
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
