"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from 'next/link';
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";



export default function App() {
  
  const { signOut } = useAuthenticator();

  return (
    <main>
      <h1>S3 Image & Document Processor</h1>


      {/* Botón para navegar a /upload */}
      <ul>  
        <Link href="/upload">
          <button style={{ width: '100%', display: 'block', textAlign: 'center' }}>Go to Upload</button>
        </Link>
      </ul>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
