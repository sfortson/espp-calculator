// @flow
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './App.css';

const IRS_MAXIMUM = 25000;
const MAXIMUM_SHARES_UBER_ALLOWS = 1500;

function App() {
  const [totalContributions, setTotalContributions] = useState(1412);
  const [purchasePrice, setPurchasePrice] = useState(25.04);
  const [offeringFMV, setOfferingFMV] = useState(45);
  const [currentPrice, setCurrentPrice] = useState(39.66);
  const [fmv, setFMV] = useState(29.46);
  const [numShares, setShares] = useState(0);
  const [refund, setRefund] = useState(0.0);
  const [salePrice, setSalePrice] = useState(0);
  const [proceeds, setProceeds] = useState(0);

  useEffect(
    function updateShares() {
      setShares(
        Math.min(
          Math.trunc(totalContributions / purchasePrice),
          Math.trunc(IRS_MAXIMUM / fmv),
          MAXIMUM_SHARES_UBER_ALLOWS
        )
      );
    },
    [fmv, numShares, purchasePrice, refund, totalContributions]
  );

  useEffect(
    function updateRefund() {
      setRefund((totalContributions - numShares * purchasePrice).toFixed(2));
    },
    [numShares, purchasePrice, totalContributions]
  );

  useEffect(
    function updatePurchasePrice() {
      setPurchasePrice(0.85 * Math.min(offeringFMV, fmv, currentPrice));
    },
    [currentPrice, fmv, offeringFMV]
  );

  useEffect(
    function updateProceeds() {
      setProceeds((salePrice * numShares).toFixed(2));
    },
    [numShares, salePrice]
  );

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Form>
            <Form.Group as={Row} controlId="formTotalContributions">
              <Form.Label column sm="2">
                Total Contributions
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  defaultValue={totalContributions}
                  onChange={evt => {
                    setTotalContributions(evt.currentTarget.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextIRS">
              <Form.Label column sm="2">
                Remaining IRS Limit (Including carryover)
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly={true} value={IRS_MAXIMUM} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="offeringDateFMV">
              <Form.Label column sm="2">
                Offering date FMV
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  defaultValue={offeringFMV}
                  onChange={evt => {
                    setOfferingFMV(evt.currentTarget.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextReset">
              <Form.Label column sm="2">
                FMV on close of day after last purchase date (reset)
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  defaultValue={fmv}
                  onChange={evt => {
                    setFMV(evt.currentTarget.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formCurrentPrice">
              <Form.Label column sm="2">
                Current Price
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  defaultValue={currentPrice}
                  onChange={evt => {
                    setCurrentPrice(evt.currentTarget.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPurchasePrice">
              <Form.Label column sm="2">
                Purchase Price
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={purchasePrice} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="sharesToBePurchased">
              <Form.Label column sm="2">
                Shares To Be Purchased
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={numShares} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formRefundAmount">
              <Form.Label column sm="2">
                Refund Amount
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={refund} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="formSalePrice">
              <Form.Label column sm="2">
                Sale price (default is current price)
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  defaultValue={currentPrice}
                  onChange={evt => {
                    setSalePrice(evt.currentTarget.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formDisposition">
              <Form.Label column sm="2">
                Disposition
              </Form.Label>
              <Col sm="5">
                <Form.Control as="select">
                  <option>Qualifying</option>
                  <option>Disqualifying</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formProceeds">
              <Form.Label column sm="2">
                Proceeds from Sale
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={proceeds} />
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
