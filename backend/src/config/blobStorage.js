const {
  BlobServiceClient,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} = require('@azure/storage-blob');
const path = require('path');
const { azureStorageConnectionString, azureStorageContainerName } = require('./env');

function parseConnectionString(connectionString) {
  const values = {};
  for (const part of connectionString.split(';')) {
    const [rawKey, rawValue] = part.split('=');
    if (rawKey && rawValue) {
      values[rawKey.trim()] = rawValue.trim();
    }
  }

  if (!values.AccountName || !values.AccountKey) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING must include AccountName and AccountKey');
  }

  return {
    accountName: values.AccountName,
    accountKey: values.AccountKey
  };
}

function getBlobServiceClient() {
  if (!azureStorageConnectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is required for document uploads');
  }
  return BlobServiceClient.fromConnectionString(azureStorageConnectionString);
}

async function getContainerClient() {
  if (!azureStorageContainerName) {
    throw new Error('AZURE_STORAGE_CONTAINER_NAME is required for document uploads');
  }

  const containerClient = getBlobServiceClient().getContainerClient(azureStorageContainerName);
  await containerClient.createIfNotExists();
  return containerClient;
}

async function uploadBuffer({ buffer, blobName, contentType, metadata = {} }) {
  const containerClient = await getContainerClient();
  const blobClient = containerClient.getBlockBlobClient(blobName);

  await blobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
    metadata
  });

  return {
    blobName,
    blobUrl: blobClient.url,
    storageProvider: 'AZURE_BLOB'
  };
}

async function createBlobReadUrl(blobName, expiresInMinutes = 60) {
  const containerClient = await getContainerClient();
  const { accountName, accountKey } = parseConnectionString(azureStorageConnectionString);
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: azureStorageContainerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(Date.now() - 5 * 60 * 1000),
      expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000)
    },
    sharedKeyCredential
  ).toString();

  return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
}

module.exports = {
  uploadBuffer,
  createBlobReadUrl
};
