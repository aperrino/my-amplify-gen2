import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  SpaceBetween,
  TextContent,
} from "@cloudscape-design/components";
import moment from 'moment';
import { CommentForm } from './CommentForm';
import { NewLineToBr } from './utils/NewLineToBr';

export const NoComment = () => (
  <Box
    padding={{ bottom: "s" }}
    fontSize="heading-s"
    textAlign="center"
    color="inherit"
  >
    <b>No Contents</b>
  </Box>
);

export const Comment = ({
  comment,
  activeComment,
  setActiveComment,
  editCommentApi,
  deleteCommentApi,
}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const deleteHandler = async () => {
    await deleteCommentApi(comment.id, comment._version);
    setConfirmVisible(false);
  }

  if (activeComment && activeComment.type === "edit" && activeComment.id === comment.id) {
    return (
      <CommentForm
        initText={comment.content}
        classId={comment.classId}
        commentId={comment.id}
        commentVersion={comment._version}
        activeComment={activeComment}
        setActiveComment={setActiveComment}
        editCommentApi={editCommentApi}
      />
    );
  }

  const buttons = [
    {
      key: 'contact',
      icon: 'contact',
      onClick: () => {}
    },
    {
      key: 'edit',
      icon: 'edit',
      onClick: () => setActiveComment({ id: comment.id, type: "edit" })
    },
    {
      key: 'remove',
      icon: 'remove',
      onClick: () => setConfirmVisible(true)
    }
  ];

  return (
    <>
      <TextContent>
        <h4>{comment.owner}</h4>
        <p>
          <small>{moment(comment.updatedAt).fromNow()}</small>
        </p>
      </TextContent>

      <SpaceBetween direction="horizontal" size="xxs">
        {buttons.map(button => (
          <Button
            key={button.key}
            iconName={button.icon}
            variant="icon"
            onClick={button.onClick}
          />
        ))}
      </SpaceBetween>

      <Modal
        onDismiss={() => setConfirmVisible(false)}
        visible={confirmVisible}
        closeAriaLabel="Close modal"
        size="small"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button 
                key="cancel"
                variant="link" 
                onClick={() => setConfirmVisible(false)}
              >
                Cancel
              </Button>
              <Button 
                key="confirm"
                variant="primary" 
                onClick={deleteHandler}
              >
                Confirm
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        Are you sure to delete the message?
      </Modal>
      <NewLineToBr>{comment.content}</NewLineToBr>
    </>
  );
};