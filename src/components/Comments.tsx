import { useEffect, useState, useCallback } from 'react';
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
  Textarea,
  Input
} from "@cloudscape-design/components";

import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import moment from 'moment';

const client = generateClient<Schema>();

function NewLineToBr({ children = "" }) {
  return children.split('\n').reduce((arr, line) => arr.concat(line, <br />), []);
}

const NoComment = () => (
  <Box
    padding={{ bottom: "s" }}
    fontSize="heading-s"
    textAlign="center"
    color="inherit"
  >
    <b>No Contents</b>
  </Box>
);

const Comment = ({
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

  return (
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
  createCommentApi,
  editCommentApi,
}) => {
  const [post, setPost] = useState(initText);
  const [alertVisible, setAlertVisible] = useState(false);
  const [summary, setSummary] = useState(''); 

  const submitHandler = async (event) => {
    event.preventDefault();
    if (post.replace(/\s/g, '').length > 0) {
      if (activeComment && activeComment.type === "edit") {
        await editCommentApi(commentId, commentVersion, post);
        setActiveComment(null);
      } else {
        await createCommentApi(post, classId);
        setPost("");
      }
    } else {
      setAlertVisible(true);
    }
  };

  const cancelHandler = () => {
    activeComment && activeComment.type === "edit" ? setActiveComment(null) : setPost("");
  }

  const askBedrock = async (prompt: string) => {
    const response = await client.queries.askBedrock({ prompt: prompt });
    const res = JSON.parse(response.data?.body!);
    const content = res.content[0].text;
    return content || null;
  };

  const generateSummarization = async (e: any) =>{
    console.log("test success");
    const comments = "긍정적 코멘트 : AWS Lambda와 ECS의 차이점을 드디어 제대로 이해했네요! 실제 사례를 들어가며 설명해주셔서 너무 좋았습니다. 특히 서버리스 아키텍처 부분은 정말 유용했어요."
"처음으로 AWS 자격증 공부를 시작하는데, 기초부터 차근차근 설명해주셔서 감사합니다. 클라우드 개념이 훨씬 명확해졌어요!"
"실무에서 바로 적용할 수 있는 내용이라 더욱 좋네요. 특히 비용 최적화 팁들은 우리 회사에서도 당장 적용해볼 수 있을 것 같아요."
"건설적 피드백"
"전반적으로 좋은 내용이었는데, 다음에는 실제 콘솔 화면도 같이 보여주시면 더 이해하기 쉬울 것 같아요."
"고급 내용도 좋지만, 기본적인 네트워크 설정 부분도 다뤄주시면 감사하겠습니다. VPC 구성이 아직 어려워요."
"질문성 코멘트"
"Auto Scaling 설정할 때 Target Tracking 정책과 Step Scaling 정책 중 어떤 것을 더 추천하시나요? 실제 프로덕션 환경에서는 어떤 게 더 안정적인가요?"
"다중 리전 구성시 데이터 동기화는 어떻게 하시나요? DynamoDB Global Table을 쓰시나요, 아니면 다른 방법이 있나요?"
"응원 코멘트"
"매번 퀄리티 높은 컨텐츠 감사합니다! 덕분에 SA Pro 자격증 준비가 훨씬 수월해졌어요 👍"
"실무자의 관점에서 설명해주시니 훨씬 와닿네요. 다음 영상도 기대하겠습니다!";
    const prompt = `Can you summarize below comments? use below ${comments}, 5점 만점에 점수도 보여주세요. 근거도 알려주세요.`;
    const response = await askBedrock(prompt);
    console.log(response);
    const generatedSummary = "This is the generated summary based on the input.";
    setSummary(response);
  };

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
        <Box padding={{ top: "s" }}>
            <Button formAction="none" onClick={generateSummarization}>Summarize</Button>
        </Box>
        <Box padding={{ top: "s" }}>
          <Textarea 
            placeholder="Generated summary will appear here." 
            value={summary} 
            readOnly
            rows={summary.split('\n').length || 1}
          />
        </Box>
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
};

function Comments({ classId }) {
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);

  const fetchComments = useCallback(async () => {
    const { data: items, errors } = await client.models.Comment.list({
      filter: { classId: { eq: classId } }
    });
    if (errors) {
      console.error('Error fetching comments:', errors);
    } else {
      setComments(items);
    }
  }, [classId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createCommentApi = useCallback(async (post, classId) => {
    const { errors, data: newComment } = await client.models.Comment.create({
      classId: classId,
      content: post,
      commentVersion: "1",
    });
    console.log(newComment);
    await fetchComments();
  }, [fetchComments]);

  const editCommentApi = useCallback(async (commentId, commentVersion, post) => {
    const updatedPost = {
      id: commentId,
      content: post,
      _version: commentVersion,
    };
    const { data: updatedComment, errors } = await client.models.Comment.update(updatedPost);
    console.log(updatedComment);
    await fetchComments();
  }, [fetchComments]);

  const deleteCommentApi = useCallback(async (commentId, commentVersion) => {
    const toBeDeletedTodo = {
      id: commentId,
      _version: commentVersion,
    };
    const { data: deletedComment, errors } = await client.models.Comment.delete(toBeDeletedTodo);
    console.log(deletedComment);
    await fetchComments();
  }, [fetchComments]);

  return (
    <Container header={<Header variant='h3'>Comments</Header>}>
      <Box float='center'>
        <SpaceBetween size="xl">
          <CommentForm 
            classId={classId} 
            createCommentApi={createCommentApi}
            editCommentApi={editCommentApi}  
            activeComment={activeComment} 
            setActiveComment={setActiveComment}
          />
          <SpaceBetween size="xs">
            {comments.length > 0 ? (
              comments
                .filter(comment => comment.classId === classId)  // classId로 필터링
                .sort((a, b) => b.createdAt.localeCompare(a.updatedAt))
                .map(comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    editCommentApi={editCommentApi}
                    deleteCommentApi={deleteCommentApi}
                  />
                ))
            ) : (
              <NoComment />
            )}
          </SpaceBetween>
        </SpaceBetween>
      </Box>
    </Container>
  );
}

export { Comments };
