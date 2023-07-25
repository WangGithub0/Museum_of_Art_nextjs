import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination } from 'react-bootstrap';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Error } from 'next/error';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '@/public/data/validObjectIDList.json'

export default function Artwork() {
  const PER_PAGE = 12;

  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  const previousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);


  if (error) {
    return <Error statusCode={404} />;
  }

  if (!artworkList) {
    return null;
  }

  return (
    <>
      {artworkList.length > 0 && (
        <Row className="gy-4">
          {artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      )}
      {artworkList.length === 0 && (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
          </Card.Body>
        </Card>
      )}
      <br/>
      {artworkList.length > 0 && (
        <Row>
          <Col className="d-flex justify-content-left">
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
