import React from "react";
import styled from "styled-components";
import { MoonP } from "./MoonP";

const phases = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];

const types = [
  "Blue Moon",
  "Supermoon",
  "Micromoon",
  "Blood Moon",
  "Harvest Moon",
  "Hunter's Moon",
  "Black Moon",
  "Strawberry Moon",
  "Wolf Moon",
  "Snow Moon",
];

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Header = styled.h1`
  text-align: center;
  margin-top: 20px;
`;

const MoonDisplay = () => {
  return (
    <>
      <Header>Moon Phases</Header>
      <Container>
        {phases.map((phase) => (
          <MoonP key={phase} phase={phase} />
        ))}
      </Container>
      <Header>Moon Types</Header>
      <Container>
        {types.map((type) => (
          <MoonP key={type} phase={type} />
        ))}
      </Container>
    </>
  );
};

export default MoonDisplay;
