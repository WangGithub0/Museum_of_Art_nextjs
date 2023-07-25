import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Button, Card } from 'react-bootstrap';
import { Error } from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '../lib/userData';

export default function ArtworkCardDetail({ objectID }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList]);

  const favouritesClicked = async () => {
    try {
      if (showAdded === true) {
        // setFavouritesList((current) => current.filter((fav) => fav != objectID));
        setFavouritesList(await removeFromFavourites(objectID));
        setShowAdded(false);
      }
      if (showAdded === false) {
        // setFavouritesList((current) => [...current, objectID]);
        setFavouritesList(await addToFavourites(objectID));
        setShowAdded(true);
      }
    } catch (error) {
      console.error(
        'Error occurred while adding/removing from favourites:',
        error
      );
    }
  };

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null,
    fetcher
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const primaryImage = data.primaryImage;
  const title = data.title || 'N/A';
  const objectDate = data.objectDate || 'N/A';
  const classification = data.classification || 'N/A';
  const medium = data.medium || 'N/A';
  const artistDisplayName = data.artistDisplayName || 'N/A';
  const creditLine = data.creditLine || 'N/A';
  const dimensions = data.dimensions || 'N/A';

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Object Date:</strong> {objectDate}
          <br />
          <strong>Classification:</strong> {classification}
          <br />
          <strong>Medium:</strong> {medium}
          <br />
          <br />
          <strong>Artist:</strong> {`${artistDisplayName} `}
          {artistDisplayName != 'N/A' && (
            <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">
              (wiki)
            </a>
          )}
          <br />
          <strong>Credit Line:</strong> {creditLine}
          <br />
          <strong>Dimensions:</strong> {dimensions}
          <br />
          <br />
          <Button
            variant={showAdded ? 'primary' : 'outline-primary'}
            onClick={favouritesClicked}
          >
            + Favourite {showAdded ? '(added)' : ''}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
