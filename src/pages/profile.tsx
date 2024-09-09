// ui
import React from "react";
import peccy from "../static/images/peccy.png";
import "../static/css/ProfileCard.css";
import {
  Box, Container,
  Grid, Header, SpaceBetween
} from "@cloudscape-design/components";

// api
import { useAsyncData } from '../components/DataProvider';
// import { DataProvider } from "../components/DataProvider";
import { generateClient } from 'aws-amplify/data';
import { Client } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import BaseAppLayout from "../components/base-app-layout";

// Define the type for profile data
interface Profile {
  point: number;
}

// Define the type for props
interface ProfileProps {
  user: string;
}

/**
 * @type {Client<Schema>}
 */
const client: Client<Schema> = generateClient();

// component
import { Rewards } from "../components/Rewards";

export const ProfilePage: React.FC<ProfileProps> = (props) => {
  const [profile, setProfile, loading] = useAsyncData(() => new DataProvider().fetchData(props.user));

  // return (
  //   <>
  //     <SpaceBetween size="s">
  //       <Container header={<Header variant="h2">Profile</Header>}>
  //         <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
  //           <Box>
  //             <img src={ peccy } alt={ props.user } width="100px" id="avatar" /><br/>
  //             <b>User:</b> { props.user }<br/>
  //             <b>Points:</b> { profile && profile.length > 0 && !loading ? profile[0]['point'] : "0" }
  //           </Box>
  //         </Grid>
  //       </Container>
  //       {/* <Rewards userId={props.user} /> */}
  //     </SpaceBetween>
  //   </>
  // );

    return (
      <BaseAppLayout
        content={
          <SpaceBetween size="s">
          <Container header={<Header variant="h2">Profile</Header>}>
            <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
              <Box>
                <img src={ peccy } alt={ props.user } width="100px" id="avatar" /><br/>
                <b>User:</b> { props.user }<br/>
                <b>Points:</b> { profile && profile.length > 0 && !loading ? profile[0]['point'] : "0" }
              </Box>
            </Grid>
          </Container>
          <Rewards userId={props.user} />
        </SpaceBetween>
        }  
      />
    );
};

class DataProvider {
  async fetchData(userId: string): Promise<Profile[]> {
    try {
      // Mock implementation for demonstration; replace with actual API call
      // const subscription = client.models.Profile.observeQuery().subscribe({
      //   next: (data) => console.log(data),
      //   error: (error) => console.error('Subscription error:', error),
      // });

      // Replace with actual data fetching logic
      // return API.graphql(graphqlOperation(listProfiles, {filter: {userId: {eq: userId}}}))
      //   .then(result => result.data.listProfiles.items);

      return []; // Placeholder return value for demo purposes
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
