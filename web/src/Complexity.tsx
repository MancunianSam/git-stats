import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

interface IRepositories {
  url: string;
  name: string;
}

interface IComplexityState {
  repositories: IRepositories[];
  repository: string;
  taskId?: string;
  percentageComplete?: number;
  loading?: boolean;
}

interface IProgressBarProgress {
  width: number;
}

const ProgressBar: StyledComponent<{}, {}, {}> = styled.div`
  background-color: lightgrey;
  height: 24px;
`;

const ProgressBarProgress: StyledComponent<
  {},
  IProgressBarProgress,
  {}
> = styled.div(props => ({
  height: "24px",
  width: `${props.width}%`,
  backgroundColor: "green"
}));

export class Complexity extends React.Component<{}, IComplexityState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      repositories: [],
      repository: "",
      percentageComplete: 0
    };
  }

  public getPercentageComplete: (taskId: string) => void = taskId => {
    const socket: SocketIOClient.Socket = io.connect("ws://localhost:5000");
    this.setState({ taskId });
    socket.emit("join", { room: this.state.taskId });
    socket.on("update", response => {
      console.log(response);
      this.setState({ percentageComplete: response["complete"] });
      if (response["state"] === "COMPLETE") {
        socket.close();
      }
    });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true });
    axios
      .post("http://localhost:5000/repository", {
        repository_name: "Spectrum",
        repository_url: "https://github.com/MancunianSam/spectrum.git",
        user_name: "MancunianSam"
      })
      .then(response => {
        this.getPercentageComplete(response.data);
      });
  };

  public componentDidMount() {
    axios
      .get("https://api.github.com/users/MancunianSam/repos")
      .then(response =>
        this.setState({
          repositories: response.data
        })
      );
    axios
      .get("http://localhost:5000/repository/spectrum/MancunianSam")
      .then(response => {
        const status: string = response.data["status"];
        const taskId: string = response.data["task_id"];
        if (status === "PENDING") {
          this.loadStats();
        } else if (status === "RUNNING") {
          this.getPercentageComplete(taskId);
        } else {
          this.setState({ percentageComplete: 100 });
        }
      });
  }

  public handleRepositoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void = event => {
    this.setState({ repository: event.target.value });
  };

  public render() {
    return (
      <div>
        <select
          value={this.state.repository}
          onChange={this.handleRepositoryChange}
        >
          {this.state.repositories.map(r => (
            <option key={r.name} value={r.url}>
              {r.name}
            </option>
          ))}
        </select>
        <button onClick={this.loadStats}>Click</button>
        {this.state.loading && (
          <ProgressBar>
            <ProgressBarProgress width={this.state.percentageComplete} />
          </ProgressBar>
        )}
      </div>
    );
  }
}
