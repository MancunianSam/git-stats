import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import logo from "./logo.png";

interface INavigationItemProps {
  href: string;
}

const NavBar: StyledComponent<{}, {}, {}> = styled.div`
  background-image: linear-gradient(
    to top,
    hsl(217, 77%, 78%),
    hsl(217, 94%, 31%)
  );
  display: flex;
  overflow: hidden;
  height: 50px;
`;

const NavigationItem: StyledComponent<INavigationItemProps, {}, {}> = styled.a`
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  font-family: "Open Sans";
`;

export class GitStatsNavigation extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  public render() {
    return (
      <div>
        <NavBar>
          <img src={logo} height={"50px"} width={"50px"} />
          <NavigationItem href="/">Home</NavigationItem>
          <NavigationItem href="/complexity">Complexity</NavigationItem>
          <NavigationItem href="/pullRequests">Pull Requests</NavigationItem>
        </NavBar>
      </div>
    );
  }
}
