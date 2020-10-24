import { ArrowIconLink } from "@components/ui/ArrowIcon";
import React from "react";
import { Composition } from "atomic-layout";
import styled from "styled-components";

const template = `
    arrow head
    / 50px auto
`;

export const HeaderComposition = (): JSX.Element => {
    return (
        <>
            <Composition template={template}>
                {({ Head, Arrow }) => (
                    <>
                        <Head>
                            <Header>Fullføring av booking</Header>
                        </Head>
                        <Arrow>
                            <ArrowIconLink direction={"l"} size={35} href={"/cabins"}></ArrowIconLink>
                        </Arrow>
                    </>
                )}
            </Composition>
        </>
    );
};

const Header = styled.h2`
    color: #222;
    font-family: "Playfair Display";
    font-weight: 900;
    font-size: 36px;
    display: inline;
`;
