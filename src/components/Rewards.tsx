// ui
import {
    Box, Header, SpaceBetween,
    Pagination, Table, Button,
  } from "@cloudscape-design/components";

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

const client = generateClient<Schema>();

  function Rewards(user) {
    const [rewards, setRewards] = useState<Array<Schema["Reward"]["type"]>>([]);

    const fetchRewards = async () => {
      const {data: points, errors } = await client.models.Reward.list();
      setRewards(points);
    };

    function createRewards() {
      client.models.Reward.create({ id: window.prompt("Add Profile content") });
  }

    useEffect(() => {
      fetchRewards();
    }, []);
  
    return (
      <Table
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
      // loadingText="Loading resources"
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
    />
    );
  }
  
  export { Rewards };

// component
// import { useAsyncData } from "./DataProvider";
// import { DataProvider } from "./DataProvider";


// export const REWARDS_COLUMN_DEFINITIONS = [
//     {
//         id: 'event',
//         header: 'Event',
//         cell: item => item.id,
//     },
//     {
//         id: 'point',
//         header: 'Point',
//         cell: item => item.point,
//     },
//     {
//         id: 'date',
//         header: 'Date',
//         cell: item => new Date(item.createdAt).toLocaleString('en', { timeZone: 'America/Los_Angeles' }),
//     },
// ];

// export const getHeaderCounterText = (
//     items: ReadonlyArray<unknown>
//   ) => {
//     return `(${items.length})`;
//   };

//   const TableEmptyState = () => {
//     return (
//       <SpaceBetween size="l">
//         <Box
//           margin={{ vertical: 'xs' }}
//           fontSize="heading-s"
//           textAlign="center"
//           color="inherit"
//         >
//           No Contents
//         </Box>
//       </SpaceBetween>
//     );
//   }
  

//   function Rewards(user) {
//     const [rewards, setRewards, loading] = useAsyncData(() => new DataProvider().fetchData(user.userId));

//     // Check if rewards is an array before using it with useCollection
//     const isRewardsArray = Array.isArray(rewards);

//     const { items, collectionProps, paginationProps } = useCollection(isRewardsArray ? rewards : [], {
//         filtering: {
//           empty: <TableEmptyState resourceName="Reward" />,
//         },
//         pagination: { pageSize: 5 },
//       });
  
//     return (
//       <Table
//         {...collectionProps}
//         loading={loading}
//         loadingText="Loading rewards"
//         columnDefinitions={REWARDS_COLUMN_DEFINITIONS}
//         items={items}
//         header={
//           <Header
//             counter={getHeaderCounterText(rewards)}
//           >
//             Rewards
//           </Header>
//         }
//         pagination={<Pagination {...paginationProps} />}
//       />
//     );
//   }
  
//   export { Rewards };


  