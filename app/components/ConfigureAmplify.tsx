'use client';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';   // ajusta la ruta si es necesario

Amplify.configure(outputs, {
  ssr: true   // importante en App Router
});

export default function ConfigureAmplify() {
  return null;   // Este componente no renderiza nada
}