import {
  SpaceBetween
} from "@cloudscape-design/components";

const Class = ({
  activeClass,
  name,
  author,
  description,
  videoUrl,
  userName,
  userId,
}) => {
  return (
    <>
      <SpaceBetween size="l">
        {/* <Player classId={activeClass.id} title={activeClass.name} desc={activeClass.description} author={activeClass.author} url={activeClass.url} user={userName} uid={userId} />
        <Comments classId={activeClass.id} /> */}
      </SpaceBetween>
    </>
  );
}

export { Class };