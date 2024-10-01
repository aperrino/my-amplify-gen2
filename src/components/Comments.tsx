// ui
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Form,
  Grid,
  Header,
  Modal,
  SpaceBetween,
  TextContent,
  Textarea
} from "@cloudscape-design/components";

import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import moment from 'moment';

const client = generateClient<Schema>();

function NewLineToBr({ children = "" }) {
  return children.split('\n').reduce(function (arr, line) {
    return arr.concat(line, <br />);
  }, []);
}

const NoComment = () => {
  return (
    <Box
      padding={{ bottom: "s" }}
      fontSize="heading-s"
      textAlign="center"
      color="inherit"
    >
      <b>No Contents</b>
    </Box>
  );
}

const Comment = ({
  comment,
  activeComment,
  setActiveComment,
}) => {
  const isEditing = activeComment && activeComment.type === "edit" && activeComment.id === comment.id
  const [confirmVisible, setConfirmVisible] = useState(false);

  const deleteHandler = () => {
    deleteCommentApi(comment.id, comment._version);
    setConfirmVisible(false);
  }

  return (
    isEditing ?
      <CommentForm
        initText={comment.content}
        classId={comment.classId}
        commentId={comment.id}
        commentVersion={comment._version}
        activeComment={activeComment}
        setActiveComment={setActiveComment}
      /> :
      <>
        <TextContent>
          <h4>{comment.owner}</h4>
          <p>
            <small>{moment(comment.updatedAt).fromNow()}</small>
          </p>
        </TextContent>

        <SpaceBetween direction="horizontal" size="xxs">
          <Button iconName="contact" variant="icon" />
          <Button iconName="edit" variant="icon" onClick={() => setActiveComment({ id: comment.id, type: "edit" })} />
          <Button iconName="remove" variant="icon" onClick={() => setConfirmVisible(true)} />
        </SpaceBetween>

        <Modal
          onDismiss={() => setConfirmVisible(false)}
          visible={confirmVisible}
          closeAriaLabel="Close modal"
          size="small"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={() => setConfirmVisible(false)}>Cancel</Button>
                <Button variant="primary" onClick={deleteHandler}>Confirm</Button>
              </SpaceBetween>
            </Box>
          }
        >
          Are you sure to delete the message?
        </Modal>
        <NewLineToBr>{comment.content}</NewLineToBr>
      </>
  );
}

const CommentForm = ({
  initText = '',
  classId,
  commentId,
  commentVersion,
  activeComment,
  setActiveComment,
}) => {
  const [post, setPost] = useState(initText);
  const [alertVisible, setAlertVisible] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    if (post.replace(/\s/g, '').length > 0) {
      if (activeComment && activeComment.type === "edit") {
        editCommentApi(commentId, commentVersion, post);
        setActiveComment(null);
      }
      else {
        createCommentApi(post, classId);
        setPost("");
      }
    }
    else {
      setAlertVisible(true);
    }
  };
  const cancelHandler = () => {
    activeComment && activeComment.type === "edit" ? setActiveComment(null) : setPost("")
  }

  return (
    <form onSubmit={submitHandler}>
      <Form>
        <Grid disableGutters gridDefinition={[{ colspan: 10 }, { colspan: 2 }]}>
          <Textarea
            placeholder="Enter your comments here."
            onChange={({ detail }) => setPost(detail.value)}
            value={post}
            rows={post.split(/\r\n|\r|\n/).length}
          />
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button formAction="none" iconName="undo" variant="icon" onClick={cancelHandler} />
              <Button formAction="submit" iconName="upload" variant="icon" />
            </SpaceBetween>
          </Box>
        </Grid>
        <Modal
          onDismiss={() => setAlertVisible(false)}
          visible={alertVisible}
          closeAriaLabel="Close modal"
          size="small"
        >
          Enter a message.
        </Modal>
      </Form>
    </form>
  );
}

function Comments(selectedClass) {
  const [comments, setComments] = useState<Schema["Comment"]["type"][]>([]);
  const [activeComment, setActiveComment] = useState(null);

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Comment.list();
    setComments(items);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Container header={<Header variant='h3'>Comments</Header>}>
      <Box float='center'>
        <SpaceBetween size="xl">
          <CommentForm classId={selectedClass.classId} />
          <SpaceBetween size="xs">
            {
              comments.length > 0 ? (comments.sort((a, b) => b.createdAt.localeCompare(a.updatedAt)).map(comment =>
                <Comment
                  key={comment.id}
                  comment={comment}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                />
              )) : <NoComment />
            }
          </SpaceBetween>
        </SpaceBetween>
      </Box>
    </Container>
  );
}

// apis
async function createCommentApi(post, classId) {
  const { errors, data: newComment } = await client.models.Comment.create({
    classId: classId,
    content: post,
    commentVersion: "1",
  })

  console.log(newComment);
}

async function editCommentApi(commentId, commentVersion, post) {
  const updatedPost = {
    id: commentId,
    post: post,
    commentVersion: commentVersion,
  };
  const { data: updatedComment, errors } = await client.models.Comment.update(updatedPost)

  console.log(updatedComment);
}

async function deleteCommentApi(commentId, commentVersion) {
  const toBeDeletedTodo = {
    id: commentId
  }
  
  const { data: deletedComment, errors } = await client.models.Comment.delete(toBeDeletedTodo)

  console.log(deletedComment);
}

export { Comments };
