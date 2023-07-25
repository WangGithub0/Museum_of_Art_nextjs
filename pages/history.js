import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import styles from '@/styles/History.module.css';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { removeFromHistory } from '@/lib/userData';
import { useEffect } from 'react';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  if (!searchHistory) return null;

  let parsedHistory = [];
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  const historyClicked = (index) => {
    router.push(`/artwork?${searchHistory[index]}`);
  };

  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // stop the event from trigging other events
    try {
      // setSearchHistory((current) => {
      //   let x = [...current];
      //   x.splice(index, 1);
      //   return x;
      // });
      setSearchHistory(await removeFromHistory(searchHistory[index]));
    } catch (error) {
      console.error('Error occurred while deleting history:', error);
    }
  };

  return (
    <>
      {parsedHistory?.length === 0 && (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        </Card>
      )}
      {parsedHistory?.length > 0 && (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => historyClicked(index)}
              className={styles.historyListItem}
            >
              {Object.keys(historyItem).map((key) => (
                <>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}
