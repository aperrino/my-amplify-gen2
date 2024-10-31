// ui
import React, { useState } from "react";
import ReactPlayer from 'react-player/lazy';
import {
  Box, Container, SpaceBetween,
} from "@cloudscape-design/components";
import '../static/css/Videoplayer.css';

import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';

import { Survey } from './Survey';

const client = generateClient<Schema>();

export function Player(props) {
  const [played, setPlayed] = useState(0);
  const [marker, setMarker] = useState(0);
  const [duration, setDuration] = useState(0);
  const interval = 30;

  const [reward, setReward] = useState<Array<Schema["Reward"]["type"]>>([]);

  return (
    <Container>
      <Box>
        <ReactPlayer
          className='react-player'
          url={props.url}
          width='100%'
          loop={false}
          playing={true}
          muted={true}
          controls={true}
          light={false}
          pip={false}
          onPlay={ () => {
            setMarker(played + interval);
          }}
          onEnded={ () => {
            if (Math.round(played) >= Math.floor(duration)) {
              updateTrackApi(props.user, props.classId, props.uid, -1, true);
            }
          }}
          onDuration={ (e) => {
            setDuration(Math.floor(e));
          }}
          onProgress={ (e) => {
            if (marker >= duration) {
              // reset marker
              setMarker(0);
            }

            var checkpoint = marker + interval;
            setPlayed(e.playedSeconds);

            if (played > checkpoint) {
              updateTrackApi(props.user, props.classId, props.uid, checkpoint);
              setMarker(checkpoint);
            }
          }}
        />
      </Box>
      <SpaceBetween direction="vertical" size="s">
        <SpaceBetween key="title-author" direction="vertical" size="xxs">
          <Box key="title" variant="h2">{props.title}</Box>
          <Box key="author" variant="small">{props.author}</Box>
        </SpaceBetween>

        <div key="description">{props.desc}</div>

        <Survey 
          key="survey"
          classTitle={props.title} 
          classId={props.classId} 
          userId={props.user} 
        />
      </SpaceBetween>
    </Container>
  );
}
async function updateTrackApi(user, classId, uid, played, complete = false) {
  try {
    const { data: existingRewards } = await client.models.Reward.list({
      filter: { userId: { eq: user }, classId: { eq: classId } }
    });

    if (existingRewards && existingRewards.length > 0) {
      const existingReward = existingRewards[0];
      const updatedReward = {
        id: existingReward.id,
        point: existingReward.point + 10,
        _version: existingReward._version
      };

      console.log(updatedReward);
      await client.models.Reward.update(updatedReward);
    } else {
      const newReward = {
        userId: user,
        classId: classId,
        point: 10
      };
      console.log(newReward);
      await client.models.Reward.create(newReward);
    }

    console.log('Reward updated/created successfully');

  } catch (error) {
    console.error('Error updating/creating reward:', error);
  }
}
