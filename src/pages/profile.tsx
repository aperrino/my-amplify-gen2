// ui
import React, { useEffect, useState } from "react";
import peccy from "../static/images/peccy.png";
import "../static/css/ProfileCard.css";
import {
  Box, Container,
  Grid, Header, SpaceBetween
} from "@cloudscape-design/components";

// component
import { Rewards } from "../components/Rewards.tsx";

// api
// import { useAsyncData } from '../components/DataProvider';
// import { DataProvider } from "../components/DataProvider";
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import BaseAppLayout from "../components/base-app-layout";

const client = generateClient<Schema>();

export default function ProfilePage(props) {
  const [profiles, setProfile] = useState<Array<Schema["Profile"]["type"]>>([]);
  const [singleprofiles, setSingleProfile] = useState<Schema["Profile"]["type"]>("");

  const fetchProfile = async () => {
    const {data: items, errors } = await client.models.Profile.list();
    setProfile(items);
  };

  const fetchAProfile = async () => {
    const { data: items, errors } = await client.models.Profile.get({
      id: props.user
    });
    setSingleProfile(items);
  }

  useEffect(() => {
    fetchProfile();
    fetchAProfile();
  }, []);

  function createProfile() {
    client.models.Profile.create({ id: window.prompt("Add Profile content") });
}

  return (
    <BaseAppLayout
      content={
        <SpaceBetween size="s">
        <Container header={<Header variant="h2">Profile</Header>}>
          <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
            <Box>
              {/* <ul>
              {profiles.map(( profile) => (
                <li key={profile.id}> {profile.id} </li>
              ))}
              </ul> */}
              <img src={ peccy } alt={ singleprofiles.id } width="100px" id="avatar" /><br/>
              <b>User:</b> { singleprofiles.id }<br/>
              <b>Points:</b> { profiles && profiles.length > 0 ? profiles[0]['point'] : "0" }
            </Box>
          </Grid>
        </Container>
        <Rewards userId={props.user} />
        <button onClick={createProfile}>+ new</button>
      </SpaceBetween>
      }  
    />
  );
}

// Define the type for profile data
// interface Profile {
//   point: number;
// }

// // Define the type for props
// interface ProfileProps {
//   user: string;
// }

// /**
//  * @type {Client<Schema>}
//  */

// export const ProfilePage: React.FC<ProfileProps> = (props) => {
//   const [profile, setProfile, loading] = useAsyncData(() => new DataProvider().fetchData(props.user));

//   // return (
//   //   <>
//   //     <SpaceBetween size="s">
//   //       <Container header={<Header variant="h2">Profile</Header>}>
//   //         <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
//   //           <Box>
//   //             <img src={ peccy } alt={ props.user } width="100px" id="avatar" /><br/>
//   //             <b>User:</b> { props.user }<br/>
//   //             <b>Points:</b> { profile && profile.length > 0 && !loading ? profile[0]['point'] : "0" }
//   //           </Box>
//   //         </Grid>
//   //       </Container>
//   //       {/* <Rewards userId={props.user} /> */}
//   //     </SpaceBetween>
//   //   </>
//   // );
// };