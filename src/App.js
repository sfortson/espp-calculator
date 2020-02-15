// @flow
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './App.css';

const IRS_MAXIMUM = 25000;
const MAXIMUM_SHARES_UBER_ALLOWS = 1500;
const FEDERAL_INCOME_TAX_RATE = 0.22;
const FEDERAL_LONG_TERM_CAPITAL_GAINS_RATE = 0.15;
const STATE_INCOME_TAX_RATE = 0.0307;
const STATE_LONG_TERM_CAPITAL_GAINS_RATE = 0.0307;
const STATE_SHORT_TERM_CAPITAL_GAINS_RATE = 0.0307;
const LOCAL_INCOME_TAX_RATE = 0.01;
const LOCAL_LONG_TERM_CAPITAL_GAINS_RATE = 0.0;
const LOCAL_SHORT_TERM_CAPITAL_GAINS_RATE = 0.0;

function App() {
  const [totalContributions, setTotalContributions] = useState(1412);
  const [purchasePrice, setPurchasePrice] = useState(25.04);
  const [offeringFMV, setOfferingFMV] = useState(45);
  const [currentPrice, setCurrentPrice] = useState(39.66);
  const [fmv, setFMV] = useState(29.46);
  const [numShares, setShares] = useState(10);
  const [refund, setRefund] = useState(0.0);
  const [salePrice, setSalePrice] = useState(10);
  const [proceeds, setProceeds] = useState(0);
  const [disposition, setDisposition] = useState('Qualifying');
  const [ordinaryIncome, setOrdinaryIncome] = useState(0);
  const [gainLossTitle, setGainLossTitle] = useState('');
  const [capitalGainLoss, setCapitalGainLoss] = useState(0);
  const [taxLiability, setTaxLiability] = useState(0);
  const [afterTaxNet, setAfterTaxNet] = useState(0);
  const [irsLimitConsumed, setIRSLimitConsumed] = useState(0);
  const [apy, setAPY] = useState(0);
  const [afterTaxAPY, setAfterTaxAPY] = useState(0);

  useEffect(() => {
    setSalePrice(currentPrice);
    setAfterTaxNet(ordinaryIncome + capitalGainLoss - taxLiability);
    setIRSLimitConsumed(numShares * Math.min(offeringFMV, fmv));
    setAPY(
      ((ordinaryIncome + capitalGainLoss) /
        (Math.min(
          Math.trunc(totalContributions / purchasePrice),
          Math.trunc(IRS_MAXIMUM / Math.min(offeringFMV, fmv)),
          1500
        ) *
          purchasePrice)) *
        4
    );
    setAfterTaxAPY(
      (afterTaxNet /
        (Math.min(
          Math.trunc(totalContributions / purchasePrice),
          Math.trunc(IRS_MAXIMUM / Math.min(offeringFMV, fmv)),
          1500
        ) *
          purchasePrice)) *
        4
    );
  }, [
    afterTaxNet,
    capitalGainLoss,
    currentPrice,
    fmv,
    numShares,
    offeringFMV,
    ordinaryIncome,
    purchasePrice,
    taxLiability,
    totalContributions
  ]);

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

  useEffect(
    function updateOrdinaryIncome() {
      if (disposition === 'Disqualifying') {
        setOrdinaryIncome((currentPrice - purchasePrice) * numShares);
        setGainLossTitle('Capital gain/loss');
        console.log((salePrice - (purchasePrice + (currentPrice - purchasePrice))) * numShares);
        setCapitalGainLoss((salePrice - (purchasePrice + (currentPrice - purchasePrice))) * numShares);
      } else {
        setOrdinaryIncome(Math.min(0.15 * Math.min(offeringFMV, fmv), salePrice - purchasePrice) * numShares);
        setGainLossTitle('Long-term capital gain/loss');
        setCapitalGainLoss(
          (salePrice - (purchasePrice + Math.min(0.15 * Math.min(offeringFMV, fmv), salePrice - purchasePrice))) *
            numShares
        );
      }
    },
    [disposition, currentPrice, purchasePrice, numShares, offeringFMV, fmv, salePrice]
  );

  useEffect(
    function updateTaxLiability() {
      const tax = (FEDERAL_INCOME_TAX_RATE + STATE_INCOME_TAX_RATE + LOCAL_INCOME_TAX_RATE) * ordinaryIncome;
      let liability = 0;
      if (capitalGainLoss >= 0) {
        if (disposition === 'Disqualifying') {
          liability =
            FEDERAL_INCOME_TAX_RATE + STATE_SHORT_TERM_CAPITAL_GAINS_RATE + LOCAL_SHORT_TERM_CAPITAL_GAINS_RATE;
        } else {
          liability =
            (FEDERAL_LONG_TERM_CAPITAL_GAINS_RATE +
              STATE_LONG_TERM_CAPITAL_GAINS_RATE +
              LOCAL_LONG_TERM_CAPITAL_GAINS_RATE) *
            capitalGainLoss;
        }
      }
      setTaxLiability(tax + liability);
    },
    [capitalGainLoss, disposition, ordinaryIncome]
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
                <Form.Control plaintext readOnly value={purchasePrice.toFixed(2)} />
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
                <Form.Control as="select" onChange={evt => setDisposition(evt.currentTarget.value)}>
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
            <br />
            <Form.Group as={Row} controlId="formOrdinaryIncome">
              <Form.Label column sm="2">
                Ordinary Income
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={ordinaryIncome.toFixed(2)} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formGainLoss">
              <Form.Label column sm="2">
                {gainLossTitle}
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={capitalGainLoss.toFixed(2)} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="formTaxLiability">
              <Form.Label column sm="2">
                Tax Liability
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={taxLiability.toFixed(2)} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="formAfterTaxNet">
              <Form.Label column sm="2">
                After Tax Net
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={afterTaxNet.toFixed(2)} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="formIRSLimitConsumed">
              <Form.Label column sm="2">
                IRS Limit Consumed
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={irsLimitConsumed.toFixed(2)} />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row} controlId="formAPY">
              <Form.Label column sm="2">
                APY (assuming non-weighted average of having your money tied up for 3 months)
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={(apy.toFixed(2) * 100).toString() + '%'} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formAfterTaxAPY">
              <Form.Label column sm="2">
                After tax APY (same assumption)
              </Form.Label>
              <Col sm="5">
                <Form.Control plaintext readOnly value={(afterTaxAPY.toFixed(2) * 100).toString() + '%'} />
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
