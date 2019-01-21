import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

import { ProgressBar } from "./ProgressBar";
import { Select } from "./Select";
import { Button } from "./Button";
import { getRepositoryDetails, IRepositoryDetails } from "../utils/utils";

const StyledGitStatsSelection: StyledComponent<{}, {}, {}> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  grid-row-start: 1;
  grid-column-start: 1;
  align-items: center;
`;
interface IRepositories {
  value: string;
  label: string;
}

interface IGitStatsSelectionState {
  repositories: IRepositories[];
  repository: string;
  repositoryId?: number;
  percentageComplete?: number;
  loading?: boolean;
  complete?: boolean;
}

interface IGitStatsSelectionProps {
  updateParentState: (complete: boolean, repository: number) => void;
  wsUrl: string;
  workerHost: string;
  buttonLabel: string;
}

export class GitStatsSelection extends React.Component<
  IGitStatsSelectionProps,
  IGitStatsSelectionState
> {
  private socket: SocketIOClient.Socket;

  constructor(props: IGitStatsSelectionProps) {
    super(props);
    this.state = {
      repositories: [],
      repository: "",
      percentageComplete: 0
    };
    this.socket = io.connect(this.props.wsUrl);
  }

  public getPercentageComplete: (taskId: string) => void = taskId => {
    this.setState({ loading: true });
    this.socket.emit("join", { room: taskId });
    this.socket.on("update", response => {
      console.log(response);
      this.setState({ percentageComplete: response["complete"] });
      if (response["state"] === "SUCCESS") {
        const repositoryId: number = response["repositoryId"];
        this.socket.close();
        this.setState({
          loading: false,
          percentageComplete: 0,
          repositoryId
        });
        this.props.updateParentState(true, repositoryId);
      }
    });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true });
    this.props.updateParentState(false, this.state.repositoryId);
    const details: IRepositoryDetails = getRepositoryDetails(
      this.state.repository
    );
    axios
      .post(`http://${this.props.workerHost}/repository`, {
        repository_name: details.name,
        repository_url: details.url,
        user_name: details.userName
      })
      .then(response => {
        this.getPercentageComplete(response.data);
        this.checkState(this.state.repository);
      })
      .catch(err => console.log(err));
  };

  public checkState: (repository: string) => void = repository => {
    const details: IRepositoryDetails = getRepositoryDetails(repository);
    axios
      .get(
        `http://${this.props.workerHost}/repository/${details.name}/${
          details.userName
        }`
      )
      .then(response => {
        const status: string = response.data["status"];
        const taskId: string = response.data["task_id"];
        const repositoryId: number = response.data["repository_id"];
        if (status === "RUNNING") {
          this.getPercentageComplete(taskId);
        } else if (status === "SUCCESS") {
          this.props.updateParentState(true, repositoryId);
          this.setState({
            loading: false,
            percentageComplete: 0,
            complete: true,
            repositoryId: repositoryId
          });
        } else {
          this.props.updateParentState(false, repositoryId);
          this.setState({
            loading: false,
            percentageComplete: 0,
            complete: false
          });
        }
      });
  };

  public componentDidMount() {
    // axios
    //   .get("https://api.github.com/users/MancunianSam/repos")
    //   .then(response =>
    //     this.setState({
    //       repositories: response.data.map(d => ({
    //         value: d.url,
    //         label: d.name
    //       }))
    //     })
    //   );
    const repository: string = "https://github.com/MancunianSam/git-stats.git";
    this.setState({
      repositories: [
        {
          label: "git_stats",
          value: "https://github.com/MancunianSam/git-stats.git"
        },
        {
          label: "spectrum",
          value: "https://github.com/withspectrum/spectrum.git"
        }
      ],
      repository
    });
    this.checkState(repository);
  }

  public handleRepositoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void = event => {
    const repository: string = event.target.value;
    this.setState({ repository });
    this.checkState(repository);
    this.props.updateParentState(this.state.complete, this.state.repositoryId);
  };

  public render() {
    return (
      <StyledGitStatsSelection>
        <h4>{"Select a git repository"}</h4>
        <Select
          options={this.state.repositories}
          onChange={this.handleRepositoryChange}
        />
        <Button onClick={this.loadStats}>
          {this.state.complete ? "Regenerate " : "Generate "}
          {this.props.buttonLabel}
        </Button>
        <form
          action={`http://localhost:9000/download/${this.state.repositoryId}`}
        >
          <Button type="submit">Download</Button>
        </form>

        {this.state.loading && (
          <ProgressBar width={this.state.percentageComplete} />
        )}
      </StyledGitStatsSelection>
    );
  }
}
