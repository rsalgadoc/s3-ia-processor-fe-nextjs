import { defineBackend } from '@aws-amplify/backend';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const backend = defineBackend({
  auth,
  data,
});

// Leemos la variable de entorno del sistema
const BUCKET_ARN = process.env.MY_CUSTOM_BUCKET_ARN;

if (!BUCKET_ARN) {
  throw new Error("La variable de entorno MY_CUSTOM_BUCKET_ARN no está definida");
}

// === TU BUCKET EXISTENTE ===
const customBucketStack = backend.createStack('custom-bucket-stack');

const existingBucket = Bucket.fromBucketAttributes(customBucketStack, 'MyExistingBucket', {
  bucketArn: BUCKET_ARN,
  region: 'us-east-1',                             // ← tu región
});

// Registra el bucket en Amplify (para que el cliente sepa usarlo)
backend.addOutput({
  storage: {
    aws_region: existingBucket.env.region,
    bucket_name: existingBucket.bucketName,
    buckets: [
      {
        aws_region: existingBucket.env.region,
        bucket_name: existingBucket.bucketName,
        name: existingBucket.bucketName,
        paths: {
          'public/*': {
            guest: ['get', 'list'],                    // lectura pública
            authenticated: ['get', 'list', 'write', 'delete'], // usuarios logueados
          },
          // Puedes agregar más rutas (protected/, private/, etc.)
        },
      },
    ],
  },
});

// === Permisos IAM (necesario) ===
const authPolicy = new Policy(customBucketStack, 'CustomBucketAuthPolicy', {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      resources: [`${existingBucket.bucketArn}/public/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:ListBucket'],
      resources: [existingBucket.bucketArn],
      conditions: {
        StringLike: { 's3:prefix': ['public/', 'public/*'] },
      },
    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);