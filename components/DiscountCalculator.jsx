"use client";

import { useMemo, useState } from "react";

export default function DiscountCalculator({ offers = [], onClose }) {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState("");
  const [basicFare, setBasicFare] = useState("");
  const [tax, setTax] = useState("");
  const [segments, setSegments] = useState("");
  const [bookingType, setBookingType] = useState("GDS");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [calculated, setCalculated] = useState(false);

  /*
   * Keep every offer separately.
   * This is important because the same airline can have
   * multiple discount offers.
   */
  const calculatorOffers = useMemo(() => {
    return Array.isArray(offers)
      ? offers.map((item, index) => ({
          ...item,
          originalIndex: index,
        }))
      : [];
  }, [offers]);

  const selectedOffer =
    selectedOfferIndex !== ""
      ? calculatorOffers[Number(selectedOfferIndex)] || null
      : null;

  /*
   * Calculate discount.
   *
   * Existing QFC calculation logic is preserved:
   * - percentage values are calculated against basic fare
   * - PKR values are treated as fixed amounts
   */
  function calculateDiscount(baseFare, discountStr) {
    if (!discountStr || discountStr === "0") {
      return {
        amount: 0,
        display: "No Discount",
      };
    }

    let discountAmount = 0;
    let displayText = "";

    if (discountStr.includes("%")) {
      const number = parseFloat(
        discountStr.replace(/[^0-9.-]/g, "")
      );

      if (!Number.isNaN(number)) {
        discountAmount = (baseFare * number) / 100;
        displayText = `${discountStr} (${discountAmount.toFixed(2)})`;
      }
    } else if (discountStr.toUpperCase().includes("PKR")) {
      const number = parseFloat(
        discountStr.replace(/[^0-9.-]/g, "")
      );

      if (!Number.isNaN(number)) {
        discountAmount = number;
        displayText = discountStr;
      }
    } else {
      const number = parseFloat(discountStr);

      if (!Number.isNaN(number)) {
        discountAmount = number;
        displayText = discountStr;
      }
    }

    return {
      amount: discountAmount,
      display: displayText || "No Discount",
    };
  }

  function calculatePassenger(
    baseFare,
    discountStr,
    taxAmount,
    segmentDiscount,
    hasSegmentDiscount
  ) {
    if (!discountStr || discountStr === "0") {
      const total =
        baseFare +
        taxAmount -
        segmentDiscount;

      return {
        discount: "No Discount",
        segmentDiscount: hasSegmentDiscount
          ? segmentDiscount
          : null,
        total,
      };
    }

    const discount = calculateDiscount(
      baseFare,
      discountStr
    );

    const total =
      baseFare +
      discount.amount +
      taxAmount -
      segmentDiscount;

    return {
      discount: discount.display,
      segmentDiscount: hasSegmentDiscount
        ? segmentDiscount
        : null,
      total,
    };
  }

  /*
   * Main calculation
   */
  const calculation = useMemo(() => {
    const adultBase = parseFloat(basicFare) || 0;
    const taxAmount = parseFloat(tax) || 0;

    const adultCount = Math.max(
      0,
      parseInt(adults, 10) || 0
    );

    const childCount = Math.max(
      0,
      parseInt(children, 10) || 0
    );

    const infantCount = Math.max(
      0,
      parseInt(infants, 10) || 0
    );

    const isGDS = bookingType === "GDS";

    const segmentCount = isGDS
      ? Math.max(0, parseInt(segments, 10) || 0)
      : 0;

    const segmentDiscount = segmentCount * 400;

    const discountStr =
      selectedOffer?.discount || "0";

    const adult = calculatePassenger(
      adultBase,
      discountStr,
      taxAmount,
      segmentDiscount,
      isGDS
    );

    const child = calculatePassenger(
      adultBase * 0.75,
      discountStr,
      taxAmount,
      segmentDiscount,
      isGDS
    );

    const infant = calculatePassenger(
      adultBase * 0.10,
      discountStr,
      taxAmount,
      0,
      false
    );

    const adultSubtotal =
      adult.total * adultCount;

    const childSubtotal =
      child.total * childCount;

    const infantSubtotal =
      infant.total * infantCount;

    const grandTotal =
      adultSubtotal +
      childSubtotal +
      infantSubtotal;

    return {
      adult,
      child,
      infant,

      adultCount,
      childCount,
      infantCount,

      adultSubtotal,
      childSubtotal,
      infantSubtotal,

      grandTotal,

      segmentCount,
      segmentDiscount,
    };
  }, [
    basicFare,
    tax,
    segments,
    bookingType,
    adults,
    children,
    infants,
    selectedOffer,
  ]);

  /*
   * Reset calculator
   */
  function handleReset() {
    setSelectedOfferIndex("");
    setBasicFare("");
    setTax("");
    setSegments("");
    setBookingType("GDS");

    setAdults(1);
    setChildren(0);
    setInfants(0);

    setCalculated(false);
  }

  function handleCalculate() {
    setCalculated(true);
  }

  /*
   * Format PKR
   */
  function formatPKR(value) {
    return (
      Number(value || 0).toLocaleString("en-GB", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) + " PKR"
    );
  }

  /*
   * Passenger breakdown
   */
  const passengerParts = [];

  if (calculation.adultCount > 0) {
    passengerParts.push(
      `${calculation.adultCount} Adult${
        calculation.adultCount > 1 ? "s" : ""
      }`
    );
  }

  if (calculation.childCount > 0) {
    passengerParts.push(
      `${calculation.childCount} Child${
        calculation.childCount > 1 ? "ren" : ""
      }`
    );
  }

  if (calculation.infantCount > 0) {
    passengerParts.push(
      `${calculation.infantCount} Infant${
        calculation.infantCount > 1 ? "s" : ""
      }`
    );
  }

  return (
    <div
      className="calculator-overlay"
      onClick={onClose}
    >
      <div
        className="calculator-modal"
        onClick={(event) => event.stopPropagation()}
      >

        {/* HEADER */}
        <div className="calculator-header">

          <div>
            <h2>Discount Calculator</h2>

            <p>
              Calculate passenger fare after airline
              discount and segment deduction.
            </p>
          </div>

          <button
            type="button"
            className="calculator-close"
            onClick={onClose}
            aria-label="Close calculator"
          >
            ×
          </button>

        </div>


        {/* BODY */}
        <div className="calculator-body">

          {/* AIRLINE / OFFER */}
          <div className="calculator-field calculator-full">

            <label htmlFor="calcAirline">
              Airline / Discount Offer
            </label>

            <select
              id="calcAirline"
              value={selectedOfferIndex}
              onChange={(event) => {
                setSelectedOfferIndex(
                  event.target.value
                );
                setCalculated(false);
              }}
            >

              <option value="">
                -- Select Airline / Offer --
              </option>

              {calculatorOffers.map((item, index) => (

                <option
                  key={`${item.airline || "airline"}-${index}`}
                  value={index}
                >

                  {item.airline || "Unknown Airline"}

                  {item.discount
                    ? ` — ${item.discount}`
                    : ""}

                  {item.notification
                    ? ` (${item.notification})`
                    : ""}

                </option>

              ))}

            </select>

          </div>


          {/* SELECTED AIRLINE */}
          {selectedOffer && (

            <div className="calculator-selected-offer">

              {selectedOffer.logo && (
                <img
                  src={`/${selectedOffer.logo}`}
                  alt={selectedOffer.airline || "Airline"}
                  className="calculator-airline-logo"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              )}

              <div>

                <strong>
                  {selectedOffer.airline}
                </strong>

                <span>
                  Discount:{" "}
                  {selectedOffer.discount ||
                    "No Discount"}
                </span>

                {selectedOffer.notification && (
                  <span>
                    {selectedOffer.notification}
                  </span>
                )}

              </div>

            </div>

          )}


          {/* BOOKING TYPE */}
          <div className="calculator-field calculator-full">

            <label htmlFor="calcBookingType">
              Booking Type
            </label>

            <select
              id="calcBookingType"
              value={bookingType}
              onChange={(event) => {
                setBookingType(event.target.value);
                setCalculated(false);
              }}
            >

              <option value="GDS">
                GDS
              </option>

              <option value="NDC">
                NDC
              </option>

            </select>

          </div>


          {/* FARE INPUTS */}
          <div className="calculator-grid">

            <div className="calculator-field">

              <label htmlFor="calcBasic">
                Basic Fare
              </label>

              <input
                id="calcBasic"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter basic fare"
                value={basicFare}
                onChange={(event) => {
                  setBasicFare(event.target.value);
                  setCalculated(false);
                }}
              />

            </div>


            <div className="calculator-field">

              <label htmlFor="calcTax">
                Tax
              </label>

              <input
                id="calcTax"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter tax"
                value={tax}
                onChange={(event) => {
                  setTax(event.target.value);
                  setCalculated(false);
                }}
              />

            </div>


            <div className="calculator-field">

              <label htmlFor="calcSegments">
                Number of Segments
              </label>

              <input
                id="calcSegments"
                type="number"
                min="0"
                step="1"
                placeholder={
                  bookingType === "GDS"
                    ? "Enter segments"
                    : "Not applicable"
                }
                value={segments}
                disabled={bookingType !== "GDS"}
                onChange={(event) => {
                  setSegments(event.target.value);
                  setCalculated(false);
                }}
              />

              {bookingType === "GDS" && (
                <small>
                  PKR 400 discount per segment
                </small>
              )}

            </div>

          </div>


          {/* PASSENGERS */}
          <div className="calculator-passenger-section">

            <h3>
              Passengers
            </h3>

            <div className="calculator-grid">

              <div className="calculator-field">

                <label htmlFor="calcAdults">
                  Adults
                </label>

                <input
                  id="calcAdults"
                  type="number"
                  min="0"
                  step="1"
                  value={adults}
                  onChange={(event) => {
                    setAdults(event.target.value);
                    setCalculated(false);
                  }}
                />

              </div>


              <div className="calculator-field">

                <label htmlFor="calcChildren">
                  Children
                </label>

                <input
                  id="calcChildren"
                  type="number"
                  min="0"
                  step="1"
                  value={children}
                  onChange={(event) => {
                    setChildren(event.target.value);
                    setCalculated(false);
                  }}
                />

              </div>


              <div className="calculator-field">

                <label htmlFor="calcInfants">
                  Infants
                </label>

                <input
                  id="calcInfants"
                  type="number"
                  min="0"
                  step="1"
                  value={infants}
                  onChange={(event) => {
                    setInfants(event.target.value);
                    setCalculated(false);
                  }}
                />

              </div>

            </div>

          </div>


          {/* ACTION BUTTONS */}
          <div className="calculator-actions">

            <button
              type="button"
              className="calculator-btn calculator-btn-primary"
              onClick={handleCalculate}
            >
              Calculate
            </button>

            <button
              type="button"
              className="calculator-btn calculator-btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>


          {/* RESULTS */}
          {calculated && (

            <div className="calculator-results">

              <div className="calculator-results-title">

                <h3>
                  Calculation Result
                </h3>

                {selectedOffer && (
                  <span>
                    {selectedOffer.airline}
                  </span>
                )}

              </div>


              <div className="calculator-table-wrapper">

                <table className="calculator-table">

                  <thead>

                    <tr>
                      <th>Passenger</th>
                      <th>Discount</th>
                      <th>Segment Discount</th>
                      <th>Total / Person</th>
                      <th>Subtotal</th>
                    </tr>

                  </thead>


                  <tbody>

                    {/* ADULT */}
                    <tr>

                      <td>
                        <strong>
                          Adult
                        </strong>

                        <small>
                          100% Base Fare
                        </small>
                      </td>

                      <td>
                        {calculation.adult.discount}
                      </td>

                      <td>
                        {calculation.adult.segmentDiscount !== null
                          ? formatPKR(
                              calculation.adult.segmentDiscount
                            )
                          : "N/A"}
                      </td>

                      <td>
                        {formatPKR(
                          calculation.adult.total
                        )}
                      </td>

                      <td>
                        {calculation.adultCount > 0
                          ? formatPKR(
                              calculation.adultSubtotal
                            )
                          : "-"}
                      </td>

                    </tr>


                    {/* CHILD */}
                    <tr>

                      <td>
                        <strong>
                          Child
                        </strong>

                        <small>
                          75% Base Fare
                        </small>
                      </td>

                      <td>
                        {calculation.child.discount}
                      </td>

                      <td>
                        {calculation.child.segmentDiscount !== null
                          ? formatPKR(
                              calculation.child.segmentDiscount
                            )
                          : "N/A"}
                      </td>

                      <td>
                        {formatPKR(
                          calculation.child.total
                        )}
                      </td>

                      <td>
                        {calculation.childCount > 0
                          ? formatPKR(
                              calculation.childSubtotal
                            )
                          : "-"}
                      </td>

                    </tr>


                    {/* INFANT */}
                    <tr>

                      <td>
                        <strong>
                          Infant
                        </strong>

                        <small>
                          10% Base Fare
                        </small>
                      </td>

                      <td>
                        {calculation.infant.discount}
                      </td>

                      <td>
                        N/A
                      </td>

                      <td>
                        {formatPKR(
                          calculation.infant.total
                        )}
                      </td>

                      <td>
                        {calculation.infantCount > 0
                          ? formatPKR(
                              calculation.infantSubtotal
                            )
                          : "-"}
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>


              {/* PASSENGER BREAKDOWN */}
              <div className="calculator-breakdown">

                <span>
                  Passenger Breakdown
                </span>

                <strong>
                  {passengerParts.length > 0
                    ? passengerParts.join(" + ")
                    : "No passengers"}
                </strong>

              </div>


              {/* GRAND TOTAL */}
              <div className="calculator-grand-total">

                <div>

                  <span>
                    Grand Total
                  </span>

                  <small>
                    {bookingType === "GDS"
                      ? `${calculation.segmentCount} segment${
                          calculation.segmentCount !== 1
                            ? "s"
                            : ""
                        } × PKR 400`
                      : "No segment deduction"}
                  </small>

                </div>

                <strong>
                  {formatPKR(
                    calculation.grandTotal
                  )}
                </strong>

              </div>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}