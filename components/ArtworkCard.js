import React from 'react';
import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import { Error } from 'next/error';
import Link from 'next/link';

export default function ArtworkCard({ objectID }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
    fetcher
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const primaryImage =
    data.primaryImageSmall ||
    'https://via.placeholder.com/375x375.png?text=[+Not+Available+]';
  const title = data.title || 'N/A';
  const objectDate = data.objectDate || 'N/A';
  const classification = data.classification || 'N/A';
  const medium = data.medium || 'N/A';

  return (
    <Card>
      <Card.Img variant="top" src={primaryImage} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate}
          <br />
          <strong>Classification:</strong> {classification}
          <br />
          <strong>Medium:</strong> {medium}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant='outline-dark'>ID: {objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
