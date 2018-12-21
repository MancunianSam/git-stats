import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

import { ProgressBar } from "../Components/ProgressBar";
import { Select } from "../Components/Select";
import { Button } from "../Components/Button";
import { getRepositoryDetails, IRepositoryDetails } from "../utils/utils";

const StyledComplexitySelection: StyledComponent<{}, {}, {}> = styled.div`
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

interface IComplexitySelectionState {
  repositories: IRepositories[];
  repository: string;
  repositoryId?: number;
  percentageComplete?: number;
  loading?: boolean;
  complete?: boolean;
}

interface IComplexitySelectionProps {
  updateParentState: (complete: boolean, repository: number) => void;
}

export class ComplexitySelection extends React.Component<
  IComplexitySelectionProps,
  IComplexitySelectionState
> {
  constructor(props: IComplexitySelectionProps) {
    super(props);
    this.state = {
      repositories: [],
      repository: "",
      percentageComplete: 0
    };
  }

  public getPercentageComplete: (taskId: string) => void = taskId => {
    this.setState({ loading: true });
    const socket: SocketIOClient.Socket = io.connect("ws://localhost:5000");
    socket.emit("join", { room: taskId });
    socket.on("update", response => {
      console.log(response);
      this.setState({ percentageComplete: response["complete"] });
      if (response["state"] === "SUCCESS") {
        const repositoryId: number = response["repositoryId"];
        socket.close();
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
      .post("http://localhost:5000/repository", {
        repository_name: details.name,
        repository_url: details.url,
        user_name: details.userName
      })
      .then(response => {
        this.getPercentageComplete(response.data);
      });
  };

  public downloadFile: () => void = () => {
    axios.get(`http://localhost:9000/download/${this.state.repositoryId}`);
  };

  public checkState: (repository: string) => void = repository => {
    const details: IRepositoryDetails = getRepositoryDetails(repository);
    axios
      .get(
        `http://localhost:5000/repository/${details.name}/${details.userName}`
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
          value: "https://github.com/MancunianSam/spectrum.git"
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
      <StyledComplexitySelection>
        <h4>{"Select a git repository"}</h4>
        <Select
          options={this.state.repositories}
          onChange={this.handleRepositoryChange}
        />
        <Button onClick={this.loadStats}>
          {this.state.complete ? "Regenerate" : "Generate"} Complexity Stats
        </Button>
        <Button onClick={this.downloadFile}>Download</Button>
        {this.state.loading && (
          <ProgressBar width={this.state.percentageComplete} />
        )}
      </StyledComplexitySelection>
    );
  }
}
