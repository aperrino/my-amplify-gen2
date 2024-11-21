import {
    Box, Header, SpaceBetween,
    Pagination, Table, Button,
  } from "@cloudscape-design/components";
import { useCollection } from '@cloudscape-design/collection-hooks';
import React, { useEffect, useState } from "react";

// API
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';

const TableEmptyState = () => {
  return (
    <SpaceBetween size="l">
      <Box
        margin={{ vertical: 'xs' }}
        fontSize="heading-s"
        textAlign="center"
        color="inherit"
      >
        No Learning Activities
      </Box>
    </SpaceBetween>
  );
}

const client = generateClient<Schema>();

function Rewards({ userId, onPointsUpdate }) {
  const [rewards, setRewards] = useState<Array<Schema["Reward"]["type"]>>([]);
  const [classes, setClasses] = useState<Record<string, Schema["Class"]["type"]>>({});
  
  const { items, collectionProps, paginationProps } = useCollection(rewards, {
    filtering: {
      empty: <TableEmptyState resourceName="Learning Activities" />,
    },
    pagination: { pageSize: 5 },
  });

  const fetchClasses = async () => {
    try {
      const { data: classItems } = await client.models.Class.list();
      const classMap = classItems.reduce((acc, cls) => {
        acc[cls.id] = cls;
        return acc;
      }, {});
      setClasses(classMap);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

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

  useEffect(() => {
    fetchRewards();
    fetchClasses();
  }, []);

  return (
    <Table
      {...collectionProps}
      renderAriaLive={({
        firstIndex,
        lastIndex,
        totalItemsCount
      }) =>
        `Displaying activities ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
      }
      columnDefinitions={[
        {
            id: 'activity',
            header: 'Learning Activity',
            cell: item => {
              const classInfo = classes[item.classId];
              return classInfo ? classInfo.name : 'Unknown Activity';
            }
        },
        {
            id: 'point',
            header: 'Earned Points',
            cell: item => item.point,
        },
        {
            id: 'date',
            header: 'Completion Date',
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
            <b>No Learning Activities Yet</b>
          </SpaceBetween>
        </Box>
      }
      header={
        <Header 
          description="Track your learning progress and earned points"
        >
          Learning History
        </Header>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}

export { Rewards };