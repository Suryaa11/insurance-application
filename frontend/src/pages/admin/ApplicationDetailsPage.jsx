import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import api, { assetBaseUrl } from '../../api/axios';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [review, setReview] = useState({ status: 'APPROVED', approvalComments: '', rejectionReason: '' });
  const [documentReviews, setDocumentReviews] = useState({});
  const [message, setMessage] = useState('');

  const load = async () => {
    const [app, docs] = await Promise.all([
      api.get(`/applications/${id}`),
      api.get(`/documents/application/${id}`)
    ]);
    setApplication(app.data.data);
    setDocuments(docs.data.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const reviewApplication = async () => {
    await api.patch(`/applications/${id}/review`, review);
    setMessage('Application reviewed successfully.');
    await load();
  };

  const reviewDocument = async (documentId) => {
    const payload = documentReviews[documentId] || { status: 'VERIFIED', rejectionReason: '' };
    await api.patch(`/documents/${documentId}/review`, payload);
    setMessage('Document reviewed successfully.');
    await load();
  };

  if (!application) return <Loader />;

  return (
    <Box>
      <PageHeader title={application.applicationNumber} subtitle="Application review and document verification." />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h6">Application Summary</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={application.status} />
                <Chip label={application.customer?.name} />
                <Chip label={application.selectedPlan?.planName} color="primary" />
              </Stack>
              <Typography variant="subtitle2">Personal Information</Typography>
              <Typography color="text.secondary">
                {application.personalInformation?.firstName} {application.personalInformation?.lastName} | {application.personalInformation?.phone}
              </Typography>
              <Typography variant="subtitle2">Address Information</Typography>
              <Typography color="text.secondary">
                {application.addressInformation?.addressLine1}, {application.addressInformation?.city}, {application.addressInformation?.state}
              </Typography>
              <Typography variant="subtitle2">Nominee Information</Typography>
              <Typography color="text.secondary">
                {application.nomineeInformation?.name} ({application.nomineeInformation?.relationship})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h6">Application Decision</Typography>
              <TextField select label="Status" value={review.status} onChange={(e) => setReview({ ...review, status: e.target.value })}>
                <MenuItem value="APPROVED">Approve</MenuItem>
                <MenuItem value="REJECTED">Reject</MenuItem>
              </TextField>
              <TextField
                label="Approval Comments"
                value={review.approvalComments}
                onChange={(e) => setReview({ ...review, approvalComments: e.target.value })}
                multiline
                minRows={3}
              />
              <TextField
                label="Rejection Reason"
                value={review.rejectionReason}
                onChange={(e) => setReview({ ...review, rejectionReason: e.target.value })}
                multiline
                minRows={3}
              />
              <Button variant="contained" onClick={reviewApplication}>Save Review</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h6">Documents</Typography>
              <Stack spacing={2}>
                {documents.map((document) => (
                  <Card key={document._id} variant="outlined">
                    <CardContent sx={{ display: 'grid', gap: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <Typography sx={{ fontWeight: 700 }}>{document.documentName}</Typography>
                        <Chip label={document.status} size="small" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {document.documentType} · {document.originalName}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button href={`${assetBaseUrl}${document.filePath}`} target="_blank">Open</Button>
                        <Button
                          variant="contained"
                          onClick={() => reviewDocument(document._id)}
                          disabled={document.status === 'VERIFIED'}
                        >
                          Verify
                        </Button>
                        <TextField
                          placeholder="Rejection reason"
                          size="small"
                          value={documentReviews[document._id]?.rejectionReason || ''}
                          onChange={(e) => setDocumentReviews((current) => ({
                            ...current,
                            [document._id]: { status: 'REJECTED', rejectionReason: e.target.value }
                          }))}
                          sx={{ minWidth: 220 }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={async () => {
                            await api.patch(`/documents/${document._id}/review`, {
                              status: 'REJECTED',
                              rejectionReason: documentReviews[document._id]?.rejectionReason || 'Not compliant'
                            });
                            await load();
                          }}
                        >
                          Reject
                        </Button>
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
