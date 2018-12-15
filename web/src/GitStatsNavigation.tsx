import * as React from "react";
import {
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter, match } from "react-router";
import { History, Location } from "history";
import styled, { StyledComponent } from "@emotion/styled";

interface IAppProps {
  history: History;
  match: match<any>;
  location: Location<any>;
}

interface IAppBarState {
  drawerOpen: boolean;
}

const Header: StyledComponent<{}, {}, {}> = styled.header`
  height: 40px;
  background-color: red;
`;
class GitStatsNavigation extends React.Component<IAppProps, IAppBarState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  public toggleDrawer: () => void = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  public changePage: (page: string) => void = page => {
    this.props.history.push(page);
  };

  public render() {
    return (
      <div>
        <Header />
        <div onClick={() => this.changePage("/complexity")}>Complexity</div>
      </div>
    );
  }
}
export const NavigationWithRoute = withRouter(GitStatsNavigation);
