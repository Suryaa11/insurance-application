import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import api, { assetBaseUrl } from '../../api/axios';
import PageHeader from '../../components/PageHeader';

export default function DocumentsPage() {
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [form, setForm] = useState({ documentName: '', documentType: 'IDENTITY_PROOF', file: null });
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [apps, docs] = await Promise.all([
      api.get('/applications/mine'),
      api.get('/documents/mine')
    ]);
    setApplications(apps.data.data);
    setDocuments(docs.data.data);
    if (!selectedApplication && apps.data.data[0]?._id) {
      setSelectedApplication(apps.data.data[0]._id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('documentName', form.documentName);
    data.append('documentType', form.documentType);
    data.append('file', form.file);
    await api.post(`/documents/applications/${selectedApplication}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setMessage('Document uploaded successfully.');
    setForm({ documentName: '', documentType: 'IDENTITY_PROOF', file: null });
    await loadData();
  };

  const handleReplace = async (documentId, file) => {
    const data = new FormData();
    data.append('file', file);
    await api.put(`/documents/${documentId}/replace`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    await loadData();
  };

  return (
    <Box>
      <PageHeader title="Documents" subtitle="Upload, review, and replace rejected documents." />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent component="form" onSubmit={handleUpload} sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h6">Upload Document</Typography>
              <TextField
                select
                label="Application"
                value={selectedApplication}
                onChange={(event) => setSelectedApplication(event.target.value)}
                required
              >
                {applications.map((application) => (
                  <MenuItem key={application._id} value={application._id}>
                    {application.applicationNumber}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Document Name" value={form.documentName} onChange={(e) => setForm({ ...form, documentName: e.target.value })} required />
              <TextField
                select
                label="Document Type"
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              >
                <MenuItem value="IDENTITY_PROOF">Identity Proof</MenuItem>
                <MenuItem value="ADDRESS_PROOF">Address Proof</MenuItem>
                <MenuItem value="INCOME_PROOF">Income Proof</MenuItem>
                <MenuItem value="SUPPORTING_DOCUMENT">Supporting Document</MenuItem>
              </TextField>
              <Button variant="outlined" component="label">
                Choose File
                <input hidden type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
              </Button>
              {form.file && <Typography variant="body2">{form.file.name}</Typography>}
              <Button type="submit" variant="contained" disabled={!form.file}>Upload</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Documents</Typography>
              <Stack spacing={1.5}>
                {documents.map((document) => (
                  <Card key={document._id} variant="outlined">
                    <CardContent sx={{ display: 'grid', gap: 1 }}>
                      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <Typography sx={{ fontWeight: 700 }}>{document.documentName}</Typography>
                        <Typography variant="body2" color="text.secondary">{document.status}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {document.documentType} · {document.originalName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Button size="small" href={`${assetBaseUrl}${document.filePath}`} target="_blank">View</Button>
                        {document.status === 'REJECTED' && (
                          <Button size="small" variant="contained" component="label">
                            Replace
                            <input hidden type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleReplace(document._id, e.target.files[0])} />
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
