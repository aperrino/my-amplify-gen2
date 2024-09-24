import React, { useEffect, useState } from "react";
import {
  Cards, Link, StatusIndicator, Box, Pagination, Header
} from "@cloudscape-design/components";

// api
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const ClassCatalog = ({
  activeCourse,
  setActiveClass,
}) => {

  const [classes, setClasses] = useState<Array<Schema["Class"]["type"]>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!activeCourse) return;

      setLoading(true);
      const classes_return = await fetchClass(activeCourse);
      setClasses(classes_return || []);
      setLoading(false);
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

  let courseId = null;
  if (course && course != null) {
    courseId = course.id;
  }

  try {
    const { data: CoursesList, errors } = await client.models.Class.list({
      filter: {
        courseId: {
          eq: courseId
        }
      }
    });

    return CoursesList;

  }
  catch (e) {
    console.log(e);
  }
}

export { ClassCatalog };