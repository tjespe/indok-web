import { useMutation, useQuery } from "@apollo/client";
import { Box, Container, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useMemo, useState } from "react";

import { BookingSteps } from "@/components/pages/cabins/booking/BookingSteps";
import { StepContext } from "@/components/pages/cabins/booking/StepContext";
import { ContactInfo } from "@/components/pages/cabins/booking/Steps/ContactInfo";
import { CabinFragment, CabinsDocument, CreateBookingDocument, SendEmailDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

const steps = ["Book hytte", "Kontaktinfo", "Ekstra info", "Kontrakt", "Send søknad", "Kvittering"] as const;

/**
 * Main page for the booking of a cabin.
 * The page renders different components depending on the step variable chosen.
 */
const CabinBookingPage: NextPageWithLayout = () => {
  // Which step of the booking process we're on
  const [activeStep, setActiveStep] = useState<number>(0);
  // Which cabins the user has chosen
  const [chosenCabins, setChosenCabins] = useState<CabinFragment[]>([]);

  const { data } = useQuery(CabinsDocument);

  // Which range of dates the user has chosen
  const [dateRange, setDateRange] = useState<{ start: dayjs.Dayjs | undefined; end: dayjs.Dayjs | undefined }>({
    start: undefined,
    end: undefined,
  });

  // The contact info the user has given
  const [contactInfo, setContactInfo] = useState<ContactInfo | undefined>();

  // Booking creation and email mutations
  const [createBooking] = useMutation(CreateBookingDocument);
  const [sendEmail] = useMutation(SendEmailDocument);

  // Extra info from the user, sent to Hytteforeningen
  const [extraInfo, setExtraInfo] = useState("");

  /**
   * Update the booking dates when the user selects a new date in the calendar.
   * The dates are updated accordingly:
   * 1. If the user has not yet selected a start date, then we set the start date to the date the user has chosen.
   * 2. If the user has selected a start date, and the new date is the same as the start date, then we reset the range.
   * 3. If the user has selected a start date, and the new date is after the start date, then we set that as the
   *   current end date
   * 4. If the user has selected a start date, and the new date is before the start date, then we set that as the
   *  current start date
   * 5. If none of the above conditions are met, we make no changes.
   *
   * @param date The date the user has chosen
   */
  function handleDateChange(date: dayjs.Dayjs) {
    setDateRange((prev) => {
      const { start, end } = prev;

      /**
       * If start is not set, then we set the start date to the date the user has chosen.
       */
      if (!start) {
        return { start: date, end: undefined };
      }

      /**
       * If start is set, and the user clicks the start day, we reset the range.
       */
      if (start?.isSame(date, "day")) {
        return { start: undefined, end: undefined };
      }

      /**
       * If the user has already selected a date range, then we reset the range and start a new one.
       */
      if (start && end) {
        return { start: date, end: undefined };
      }

      /**
       * If the user has selected a start date, and the new date is after the start date, then we set that as the
       * current end date
       */
      if (start && date.isAfter(start, "day")) {
        return { start: start, end: date };
      }

      /**
       * If the user has selected a start date, and the new date is before the start date, then we set that as the
       * current start date
       */
      if (start && date.isBefore(start, "day")) {
        return { start: date, end: undefined };
      }

      /**
       * If none of the above conditions are met, we make no changes.
       */
      return { start, end };
    });
  }

  /**
   * Send the booking to Hytteforeningen and create a booking in the database.
   * The booking is sent to Hytteforeningen and the user by email.
   *
   * @todo move the email sendout to the backend. It should absolutely not be done on the client like this :)
   */
  function onSubmitBooking() {
    sendEmail({
      variables: {
        emailInput: {
          ...contactInfo,
          cabins: chosenCabins.map((cabin) => parseInt(cabin.id)),
          checkIn: dateRange.start?.format("YYYY-MM-DD"),
          checkOut: dateRange.end?.format("YYYY-MM-DD"),
          extraInfo: extraInfo,
          emailType: "reserve_booking",
        },
      },
    });
    createBooking({
      variables: {
        bookingData: {
          ...contactInfo,
          cabins: chosenCabins.map((cabin) => parseInt(cabin.id)),
          checkIn: dateRange.start?.format("YYYY-MM-DD"),
          checkOut: dateRange.end?.format("YYYY-MM-DD"),
          extraInfo: extraInfo,
        },
      },
    });
  }

  const contextValue = useMemo(
    () => ({
      activeStep,
      steps: steps.length,
      nextStep: () => setActiveStep((prev) => prev + 1),
      previousStep: () => setActiveStep((prev) => prev - 1),
    }),
    [activeStep, setActiveStep]
  );

  return (
    <Container>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <Box display={{ xs: "none", md: "block" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <StepContext.Provider value={contextValue}>
          <BookingSteps
            allCabins={data?.cabins ?? []}
            chosenCabins={chosenCabins}
            contactInfo={contactInfo}
            onContactInfoChange={setContactInfo}
            onCabinsChange={setChosenCabins}
            setExtraInfo={setExtraInfo}
            onDateChange={handleDateChange}
            startDate={dateRange.start}
            endDate={dateRange.end}
            onSubmitBooking={onSubmitBooking}
          />
        </StepContext.Provider>
      </Stack>
    </Container>
  );
};

CabinBookingPage.getLayout = (page) => <Layout simpleHeader>{page}</Layout>;

export default CabinBookingPage;
