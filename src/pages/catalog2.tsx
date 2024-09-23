// ui
import React, { useEffect, useState } from "react";
import "../static/css/ProfileCard.css";
import {
    Box, Cards, Container,
    Grid, Header, Link,
    Pagination, SpaceBetween, StatusIndicator
} from "@cloudscape-design/components";

// component
// import { Comments } from './Comments'
// import { Player } from './Player'

// api
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import BaseAppLayout from "../components/base-app-layout";

const client = generateClient<Schema>();

export default function Catalog2(props) {
    const [activeClass, setActiveClass] = useState<Array<Schema["Course"]["type"]>>([]);
    const [activeCourse, setActiveCourse] = useState<Array<Schema["Class"]["type"]>>([]);
    const [courses, setCourses] = useState<Array<Schema["Course"]["type"]>>([]);

  const fetchCourse = async () => {
    const {data: items, errors } = await client.models.Course.list();
    setCourses(items);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <BaseAppLayout
      content={
        <SpaceBetween size="s">
        <Container>
          <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
            <Container>
            {
              courses.map(course =>
                <Course
                  key={course.id}
                  course={course}
                  activeCourse={activeCourse}
                  setActiveCourse={setActiveCourse}
                  setActiveClass={setActiveClass}
                />
              )
            }
          </Container>
          {
            (activeClass && activeClass != null && activeClass.class_flag <= 0) ? (
              <Class activeClass={activeClass} userName={props.user} userId={props.uid} />
            ) : (
              <ClassCatalog activeCourse={activeCourse} setActiveClass={setActiveClass} />
            )
          }
          </Grid>
        </Container>
      </SpaceBetween>
      }  
    />
  );
}

const Course = ({
  course,
  activeCourse,
  setActiveCourse,
  setActiveClass,
}) => {
  if (!activeCourse) {
    setActiveCourse({ id: course.id, title: course.name });
  }

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

const ClassCatalog = ({
  activeCourse,
  setActiveClass,
}) => {

  // console.log("RYZ test1", activeCourse);

  // const [classes, setClasses] = useState<Array<Schema["Class"]["type"]>>([]);

  // const classes_return = fetchClass(activeCourse);

  // console.log("RYZ test4", classes_return);

  // useEffect(() => {
  //   setClasses(classes_return);
  // }, []);

  const [classes, setClasses] = useState<Array<Schema["Class"]["type"]>>([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    const fetchClasses = async () => {
      if (!activeCourse) return; // activeCourse가 없으면 fetchClass 호출하지 않음

      setLoading(true);  // 로딩 시작
      const classes_return = await fetchClass(activeCourse);  // 비동기 호출 대기
      console.log("RYZ test4", classes_return);
      setClasses(classes_return || []);  // 받아온 값 설정, 실패 시 빈 배열
      setLoading(false);  // 로딩 종료
    };

    fetchClasses();
  }, [activeCourse]);

  return (
    <Cards
      ariaLabels={{
        itemSelectionLabel: (e, n) => `select ${n.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: item => (
          <Link
            fontSize="heading-m"
            href={item.id}
            onFollow={(e) => {
                e.preventDefault();
                setActiveClass(classes.find(element => element.id === e.detail.href));
              }
            }
          >
            {item.name}
          </Link>
        ),
        sections: [
          {
            id: "image",
            content: item => (<img src={item.image} alt={item.name} width='100%' />)
          },
          {
            id: "description",
            header: "Description",
            content: item => item.description
          },
          {
            id: 'state',
            header: 'Status',
            content: item => (
              <StatusIndicator type={item.class_flag > 0 ? 'error' : 'success'}>{item.class_flag > 0 ? "Unavailable" : "Available"}</StatusIndicator>
            ),
          },
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 500, cards: 2 }
      ]}
      isItemDisabled={item => (item.class_flag > 0)}
      items={classes.sort((a, b) => a.class_flag - b.class_flag)}
      loadingText="Loading contents"
      empty={
        <Box
          padding={{ bottom: "s" }}
          fontSize="heading-s"
          textAlign="center"
          color="inherit"
        >
          <b>No Contents</b>
        </Box>
      }
      header={activeCourse && activeCourse != null ? (<Header>{activeCourse.title}</Header>) : (<div />)}
      pagination={
        <Pagination currentPageIndex={1} pagesCount={2} />
      }
    />
  );
}

const fetchClass = async (course) => {

  console.log("RYZ test2", course);

  let courseId = null;
  if (course && course != null) {
    courseId = course.id;
  }

  console.log("RYZ test3", courseId);

  try {
    const { data: CoursesList, errors } = await client.models.Class.list({
      filter: {
        courseId: {
          eq: courseId
        }
      }
    });
    console.log("fetchClassesApi : ", CoursesList);

    return CoursesList;

  }
  catch (e) {
    console.log(e);
  }
}