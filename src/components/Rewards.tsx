// ui
import {
    Box, Header, SpaceBetween,
    Pagination, Table, Button,
  } from "@cloudscape-design/components";
import { useCollection } from '@cloudscape-design/collection-hooks';
import React, { useEffect, useState } from "react";

// API
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';

// function to show total reward count
export const getHeaderCounterText = (
  items: ReadonlyArray<unknown>
) => {
  return `(${items.length})`;
};

const TableEmptyState = () => {
  return (
    <SpaceBetween size="l">
      <Box
        margin={{ vertical: 'xs' }}
        fontSize="heading-s"
        textAlign="center"
        color="inherit"
      >
        No Contents
      </Box>
    </SpaceBetween>
  );
}

const client = generateClient<Schema>();

function Rewards({ userId, onPointsUpdate }) {
  const [rewards, setRewards] = useState<Array<Schema["Reward"]["type"]>>([]);
  
  const { items, collectionProps, paginationProps } = useCollection(rewards, {
    filtering: {
      empty: <TableEmptyState resourceName="Reward" />,
    },
    pagination: { pageSize: 5 },
  });

  const fetchRewards = async () => {
    try {
      const {data: points, errors } = await client.models.Reward.list();
      setRewards(points);
      
      // Calculate total points and send to parent component
      const totalPoints = points.reduce((sum, reward) => sum + (reward.point || 0), 0);
      onPointsUpdate(totalPoints);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setRewards([]);
      onPointsUpdate(0);
    }
  };

  function createRewards() {
    client.models.Reward.create({ id: window.prompt("Add Profile content") });
  }

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <Table
      {...collectionProps}
      renderAriaLive={({
        firstIndex,
        lastIndex,
        totalItemsCount
      }) =>
        `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
      }
      columnDefinitions={[
        {
            id: 'event',
            header: 'Event',
            cell: item => item.id,
        },
        {
            id: 'point',
            header: 'Point',
            cell: item => item.point,
        },
        {
            id: 'date',
            header: 'Date',
            cell: item => new Date(item.createdAt).toLocaleString('en', { timeZone: 'America/Los_Angeles' }),
        },
      ]}
      enableKeyboardNavigation
      items={rewards}
      sortingDisabled
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button onClick={createRewards}>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      header={<Header counter={getHeaderCounterText(rewards)}> Rewards </Header>}
      pagination={<Pagination {...paginationProps} />}
    />
  );
}

export { Rewards };