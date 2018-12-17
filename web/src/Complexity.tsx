import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

import { ProgressBar } from "./Components/ProgressBar";
import { Select } from "./Components/Select";
import { Button } from "./Components/Button";

interface IRepositories {
  value: string;
  label: string;
}

interface IComplexityState {
  repositories: IRepositories[];
  repository: string;
  percentageComplete?: number;
  loading?: boolean;
}

const ComplexityGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 2fr);
  font-family: Open Sans;
  justify-items: center;
`;

const ComplexitySelection: StyledComponent<{}, {}, {}> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  grid-column-start: 2;
  align-items: center;
`;

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
    this.setState({ loading: true });
    const socket: SocketIOClient.Socket = io.connect("ws://localhost:5000");
    socket.emit("join", { room: taskId });
    socket.on("update", response => {
      console.log(response);
      this.setState({ percentageComplete: response["complete"] });
      if (response["state"] === "COMPLETE") {
        socket.close();
        this.setState({ loading: false });
      }
    });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true });
    const re = new RegExp("https://github.com/(.*)/(.*).git");
    const results = re.exec(this.state.repository);
    axios
      .post("http://localhost:5000/repository", {
        repository_name: results[2],
        repository_url: results[0],
        user_name: results[1]
      })
      .then(response => {
        this.getPercentageComplete(response.data);
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
          this.setState({ loading: false });
          this.setState({ percentageComplete: 0 });
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
      <ComplexityGrid>
        <ComplexitySelection>
          {"Select a git repository"}
          <Select
            options={this.state.repositories}
            onChange={this.handleRepositoryChange}
          />
          <Button onClick={this.loadStats}>Generate Complexity Stats</Button>
          {this.state.loading && (
            <ProgressBar width={this.state.percentageComplete} />
          )}
        </ComplexitySelection>
      </ComplexityGrid>
    );
  }
}
