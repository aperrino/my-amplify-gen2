// ui
import React, { useEffect, useState } from "react";
import "../static/css/ProfileCard.css";
import {
  Box, Cards, Container,
  Grid, Header, Link,
  Pagination, SpaceBetween, StatusIndicator
} from "@cloudscape-design/components";

// component
import { Course } from "../components/Course.tsx";
import { Class } from "../components/Class.tsx";
import { ClassCatalog } from "../components/ClassCatalog.tsx";

// api
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import BaseAppLayout from "../components/base-app-layout";

const client = generateClient<Schema>();

export default function Catalog(props) {
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