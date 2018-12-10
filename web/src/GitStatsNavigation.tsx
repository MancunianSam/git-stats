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

interface IAppProps {
  history: History;
  match: match<any>;
  location: Location<any>;
}

interface IAppBarState {
  drawerOpen: boolean;
}
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
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menuButton" onClick={this.toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer}>
            <List>
              {[
                { label: "Home", url: "/" },
                { label: "Complexity", url: "/complexity" }
              ].map(obj => (
                <ListItem
                  id={obj.url}
                  button
                  key={obj.label}
                  onClick={() => this.changePage(obj.url)}
                >
                  <ListItemText primary={obj.label} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        </AppBar>
      </div>
    );
  }
}
export const NavigationWithRoute = withRouter(GitStatsNavigation);
