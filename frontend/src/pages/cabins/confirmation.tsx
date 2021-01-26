import Layout from "@components/Layout";
import Container from "@components/pages/cabins/Container";
import { Heading, Paragraph } from "@components/ui/Typography";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const Confirmation: NextPage = () => {
  return (
    <>
      <Layout>
        <Container>
          <Heading>Bekreftelse for booking</Heading>
          <Paragraph>
            Takk for din booking! Denne nettsiden er fortsatt under konstruksjon, så det blir ikke faktisk opprettet en
            booking. Det må du fortsatt gjøre gjennom{" "}
            <Link href="mailto:booking@indokhyttene.no">booking@indokhyttene.no</Link>.
          </Paragraph>
        </Container>
      </Layout>
    </>
  );
};

export default Confirmation;
