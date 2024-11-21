import React, { useEffect, useState } from "react";
import peccy from "../static/images/peccy.png";
import "../static/css/ProfileCard.css";
import {
  Box, 
  Container,
  Grid, 
  Header, 
  SpaceBetween
} from "@cloudscape-design/components";
import { Rewards } from "../components/Rewards.tsx";
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import BaseAppLayout from "../components/base-app-layout";

const client = generateClient<Schema>();

export default function ProfilePage(props) {
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Rewards 컴포넌트로부터 포인트 합계를 받아오는 함수
  const handleTotalPointsUpdate = (points: number) => {
    setTotalPoints(points);
  };

  return (
    <BaseAppLayout
      content={
        <SpaceBetween size="s">
          <Container header={<Header variant="h2">My Profile</Header>}>
            <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
              <Box padding="s">
                <img 
                  src={peccy} 
                  alt={`${props.user}'s avatar`} 
                  width="100px" 
                  id="avatar" 
                />
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>User: </strong> 
                    <span>{props.user}</span>
                  </div>
                  <div>
                    <strong>Total Points: </strong> 
                    <span>{totalPoints}</span>
                  </div>
                </div>
              </Box>
            </Grid>
          </Container>
          <Rewards userId={props.user} onPointsUpdate={handleTotalPointsUpdate} />
        </SpaceBetween>
      }  
    />
  );
}