import * as React from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FilledInput,
  LinearProgress,
  Button
} from "@material-ui/core";

interface IRepositories {
  url: string;
  name: string;
}

interface IComplexityState {
  repositories: IRepositories[];
  repository: string;
  completed?: number;
  loading?: boolean;
}

export class Complexity extends React.Component<{}, IComplexityState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      repositories: [],
      repository: "",
      completed: 80
    };
  }
  public componentDidMount() {
    axios
      .get("https://api.github.com/users/MancunianSam/repos")
      .then(response =>
        this.setState({
          repositories: response.data
        })
      );
  }

  public handleRepositoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void = event => {
    this.setState({ repository: event.target.value });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true });
  };

  public render() {
    return (
      <div>
        <form autoComplete="off">
          <FormControl variant="filled">
            <InputLabel htmlFor="repository">Repository</InputLabel>
            <Select
              value={this.state.repository}
              onChange={this.handleRepositoryChange}
              input={<FilledInput name="repository" id="repository" />}
            >
              {this.state.repositories.map(r => (
                <MenuItem value={r.url}>{r.name}</MenuItem>
              ))}
            </Select>
            <Button onClick={this.loadStats}>Click</Button>
          </FormControl>
          {this.state.loading && (
            <LinearProgress
              variant="determinate"
              value={this.state.completed}
            />
          )}
        </form>
      </div>
    );
  }
}
