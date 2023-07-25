import React, { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      q: '',
      searchBy: '',
      geoLocation: '',
      medium: '',
      isHighlight: false,
      isOnView: false,
    },
  });

  useEffect(() => {
    let data = {
      searchBy: 'title',
    };

    // set the values of each form field to match "data"
    for (const prop in data) {
      setValue(prop, data[prop]);
    }
  }, []);

  const submitForm = async (data) => {
    try {
      let queryString = `${data.searchBy}=true`;

      if (data.geoLocation) {
        queryString += `&geoLocation=${data.geoLocation}`;
      }

      if (data.medium) {
        queryString += `&medium=${data.medium}`;
      }

      queryString += `&isOnView=${data.isOnView}`;
      queryString += `&isHighlight=${data.isHighlight}`;
      queryString += `&q=${data.q}`;

      // setSearchHistory((current) => [...current, queryString]);
      setSearchHistory(await addToHistory(queryString));

      router.push(`/artwork?${queryString}`);
    } catch (error) {
      console.error('Error occurred while adding history:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="q"
              className={errors.q && 'inputError'}
              {...register('q', { required: true })}
            />
            {/* <input
              className={errors.firstName && 'inputError'}
              {...register('q', { required: true, maxLength: 20 })}
            /> */}
            {errors.q?.type === 'required' && (
              <span className="inputErrorText">
                <br />
                Search Query is required
              </span>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select
            name="searchBy"
            className="mb-3"
            {...register('searchBy')}
          >
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="geoLocation"
              {...register('geoLocation')}
            />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;,
              &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.),
              with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="medium"
              {...register('medium')}
            />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;,
              &quot;Furniture&quot;, &quot;Paintings&quot;,
              &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple
              values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            name="isHighlight"
            {...register('isHighlight')}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            name="isOnView"
            {...register('isOnView')}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button
            variant="primary"
            type="submit"
            disabled={Object.keys(errors).length > 0}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
