import * as React from "react";
import axios from "axios";
import styled, { StyledComponent } from "@emotion/styled";
import io from "socket.io-client";

import { ProgressBar } from "./Components/ProgressBar";
import { Select } from "./Components/Select";
import { Button } from "./Components/Button";
import { StatsBarChart } from "./Charts/StatsBarChart";
import { StatsPieChart } from "./Charts/StatsPieChart";
import { getBarData, getPie1Data, getPie2Data } from "./getData";

interface IRepositories {
  value: string;
  label: string;
}

interface IComplexityState {
  repositories: IRepositories[];
  repository: string;
  percentageComplete?: number;
  loading?: boolean;
  complete?: boolean;
}

interface IRepositoryDetails {
  url: string;
  name: string;
  userName: string;
}

const ComplexityGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: repeat(2, 2fr);
  font-family: Open Sans;
  justify-items: flex-start;
`;

const ComplexitySelection: StyledComponent<{}, {}, {}> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  grid-column-start: 1;
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
      if (response["state"] === "SUCCESS") {
        socket.close();
        this.setState({
          loading: false,
          percentageComplete: 0,
          complete: true
        });
      }
    });
  };

  public loadStats: () => void = () => {
    this.setState({ loading: true, complete: false });
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
  };

  public render() {
    return (
      <ComplexityGrid>
        <ComplexitySelection>
          <h4>{"Select a git repository"}</h4>
          <Select
            options={this.state.repositories}
            onChange={this.handleRepositoryChange}
          />
          <Button onClick={this.loadStats}>Generate Complexity Stats</Button>
          {this.state.loading && (
            <ProgressBar width={this.state.percentageComplete} />
          )}
        </ComplexitySelection>
        {this.state.complete && (
          <div style={{ gridRowStart: 1, gridColumnStart: 2 }}>
            <span style={{ fontFamily: "Open Sans" }}>
              Top 10 Complexity and nloc by funtion
            </span>
            <StatsBarChart
              data={getBarData(this.state.repository)}
              name={"name"}
              key1={"nloc"}
              key2={"complexity"}
            />
          </div>
        )}
        {this.state.complete && (
          <div style={{ gridRowStart: 2, gridColumnStart: 2 }}>
            <span style={{ fontFamily: "Open Sans" }}>
              Top 10 Complexity and nloc by file
            </span>
            <StatsPieChart
              data1={getPie1Data(this.state.repository)}
              data2={getPie2Data(this.state.repository)}
            />
          </div>
        )}
      </ComplexityGrid>
    );
  }
}
