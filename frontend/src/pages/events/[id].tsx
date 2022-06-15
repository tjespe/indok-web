import Layout, { RootStyle } from "@layouts/Layout";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/EventDetails";
import { NextPageWithLayout } from "@layouts/Layout";

/**
 * Component for showing the detail page of an event
 */
const EventInfo: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && typeof id === "string" ? <EventDetailPage eventId={id} /> : <></>}</>;
};

EventInfo.getLayout = (page: React.ReactElement) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default EventInfo;
