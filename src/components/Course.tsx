import {
  Box, Link
} from "@cloudscape-design/components";

const Course = ({
  course,
  activeCourse,
  setActiveCourse,
  setActiveClass,
}) => {
  // if (!activeCourse) {
  //   setActiveCourse({ id: course.id, title: course.name });
  // }

  const switchCourseHandler = () => {
    setActiveCourse({ id: course.id, title: course.name });
    setActiveClass(null);
  };

  return (
    <Box>
      <Link onFollow={switchCourseHandler}>{course.name}</Link>
    </Box>
  );
};

export { Course };