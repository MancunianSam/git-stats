import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

import { ProgressBar } from "../Components/ProgressBar";
import { Select } from "../Components/Select";
import { Button } from "../Components/Button";

const StyledComplexitySelection: StyledComponent<{}, {}, {}> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
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
  percentageComplete?: number;
  loading?: boolean;
  complete?: boolean;
}

interface IComplexitySelectionProps {
  updateParentState: (complete: boolean, repository: string) => void;
}

interface IRepositoryDetails {
  url: string;
  name: string;
  userName: string;
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
        socket.close();
        this.setState({
          loading: false,
          percentageComplete: 0
        });
        this.props.updateParentState(true, this.state.repository);
      }
    });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true });
    this.props.updateParentState(false, this.state.repository);
    const details: IRepositoryDetails = this.getRepositoryDetails(
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

  public getRepositoryDetails: (
    respoitoryUrl: string
  ) => IRepositoryDetails = repository => {
    const re = new RegExp("https://github.com/(.*)/(.*).git");
    const results = re.exec(repository);
    return {
      url: results[0],
      name: results[2],
      userName: results[1]
    };
  };

  public checkState: (repository: string) => void = repository => {
    const details: IRepositoryDetails = this.getRepositoryDetails(repository);
    axios
      .get(
        `http://localhost:5000/repository/${details.name}/${details.userName}`
      )
      .then(response => {
        const status: string = response.data["status"];
        const taskId: string = response.data["task_id"];
        let complete: boolean = true;
        if (status === "RUNNING") {
          this.getPercentageComplete(taskId);
        } else if (status === "SUCCESS") {
          this.setState({
            loading: false,
            percentageComplete: 0,
            complete: true
          });
        } else {
          this.setState({
            loading: false,
            percentageComplete: 0,
            complete: false
          });
          this.props.updateParentState(complete, repository);
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
    this.setState({
      repositories: [
        {
          label: "spectrum",
          value: "https://github.com/MancunianSam/spectrum.git"
        },
        {
          label: "git_stats",
          value: "https://github.com/MancunianSam/git-stats.git"
        }
      ],
      repository: "https://github.com/MancunianSam/spectrum.git"
    });
    this.checkState("https://github.com/MancunianSam/spectrum.git");
  }

  public handleRepositoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void = event => {
    const repository: string = event.target.value;
    this.setState({ repository });
    this.checkState(repository);
    this.props.updateParentState(this.state.complete, repository);
  };

  public render() {
    return (
      <StyledComplexitySelection>
        <h4>{"Select a git repository"}</h4>
        <Select
          options={this.state.repositories}
          onChange={this.handleRepositoryChange}
        />
        <Button onClick={this.loadStats}>Generate Complexity Stats</Button>
        {this.state.loading && (
          <ProgressBar width={this.state.percentageComplete} />
        )}
      </StyledComplexitySelection>
    );
  }
}
