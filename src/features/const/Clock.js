import { Component } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000); // Update every second for smoother experience
  }

  format(date) {
    const dateTime = date;
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    const dateFormatter = new Intl.DateTimeFormat("ru", dateOptions);
    const timeFormatter = new Intl.DateTimeFormat("en", timeOptions);
    const formattedDate = dateFormatter.format(dateTime).replace(/\//g, ".");
    const formattedTime = timeFormatter.format(dateTime);
    return { date: formattedDate, time: formattedTime };
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    const { date, time } = this.format(this.state.date);

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        alignItems: "flex-end",
        minWidth: "140px" // Prevent shrinking
      }}>
        <Text
          style={{
            fontSize: "11px",
            color: "#8c8c8c",
            lineHeight: "1.2",
            whiteSpace: "nowrap"
          }}
        >
          <ClockCircleOutlined style={{ marginRight: "4px" }} />
          Server time
        </Text>
        <Text strong style={{
          fontSize: "13px",
          color: "#1f1f1f",
          lineHeight: "1.3",
          whiteSpace: "nowrap"
        }}>
          {date}
        </Text>
        <Text strong style={{
          fontSize: "13px",
          color: "#1f1f1f",
          lineHeight: "1.1",
          whiteSpace: "nowrap"
        }}>
          {time}
        </Text>
      </div>
    );
  }
}

export default Clock;