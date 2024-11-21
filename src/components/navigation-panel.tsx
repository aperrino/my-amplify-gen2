import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { useState } from "react";
import { useOnFollow } from "../common/hooks/use-on-follow";
import { APP_NAME } from "../common/constants";
import { useLocation } from "react-router-dom";

export default function NavigationPanel() {
  const location = useLocation();
  const onFollow = useOnFollow();
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();

  const [items] = useState<SideNavigationProps.Item[]>(() => {
    const items: SideNavigationProps.Item[] = [
      // {
      //   type: "link",
      //   text: "Home",
      //   href: "/",
      // },
      // {
      //   type: "section",
      //   text: "Section",
      //   items: [
      //     { type: "link", text: "Item 1", href: "/section/item1" },
      //     { type: "link", text: "Item 2", href: "/section/item2" },
      //     { type: "link", text: "Item 2", href: "/section/item3" },
      //   ],
      // }
      { type: "link", text: "community", href: "/page2" },
      { type: "link", text: "profile", href: "/profile" },
      { type: "link", text: "admin", href: "/page4" },
      { type: "link", text: "catalog", href: "/catalog" }
    ];

    items.push(
      { type: "divider" },
      {
        type: "link",
        text: "Documentation",
        href: "https://gitlab.aws.dev/aws-emea-prototyping/modern-application-development/user-experience-frontend/cloudscape",
        external: true,
      }
    );

    return items;
  });

  const onChange = ({
    detail,
  }: {
    detail: SideNavigationProps.ChangeDetail;
  }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      onChange={onChange}
      header={{ href: "/", text: APP_NAME }}
      activeHref={location.pathname}
      items={items.map((value, idx) => {
        if (value.type === "section") {
          const collapsed =
            navigationPanelState.collapsedSections?.[idx] === true;
          value.defaultExpanded = !collapsed;
        }

        return value;
      })}
    />
  );
}
