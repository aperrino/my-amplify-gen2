// ui
import {
    Box, Header, SpaceBetween,
    Pagination, Table,
  } from "@cloudscape-design/components";

import { useCollection } from '@cloudscape-design/collection-hooks';

// component
import { useAsyncData } from "./DataProvider";
import { DataProvider } from "./DataProvider";


export const REWARDS_COLUMN_DEFINITIONS = [
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
];

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
  

  function Rewards(user) {
    const [rewards, setRewards, loading] = useAsyncData(() => new DataProvider().fetchData(user.userId));

    // Check if rewards is an array before using it with useCollection
    const isRewardsArray = Array.isArray(rewards);

    const { items, collectionProps, paginationProps } = useCollection(isRewardsArray ? rewards : [], {
        filtering: {
          empty: <TableEmptyState resourceName="Reward" />,
        },
        pagination: { pageSize: 5 },
      });
  
    return (
      <Table
        {...collectionProps}
        loading={loading}
        loadingText="Loading rewards"
        columnDefinitions={REWARDS_COLUMN_DEFINITIONS}
        items={items}
        header={
          <Header
            counter={getHeaderCounterText(rewards)}
          >
            Rewards
          </Header>
        }
        pagination={<Pagination {...paginationProps} />}
      />
    );
  }
  
  export { Rewards };


  