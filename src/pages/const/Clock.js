import React, {Component} from "react";

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            60000
        );
    }

    format(date) {
        const dateTime = date;
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const dateFormatter = new Intl.DateTimeFormat('ru', dateOptions);
        const timeFormatter = new Intl.DateTimeFormat('en', timeOptions);
        const formattedDate = dateFormatter.format(dateTime).replace(/\//g, '.');
        const formattedTime = timeFormatter.format(dateTime);
        return `${formattedDate} | ${formattedTime}`;
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState(
            {
                date: new Date()
            }
        )
    }
    render() {
        return (
            <div style={{ marginRight:"5vh",marginLeft:"5vh",height:"8vh"}}>
                {/*<span style={{  marginBottom: 0 , padding:0}}>Server vaqti   :  </span>*/}
                <b style={{ marginBottom: 0,marginTop:0,padding:0, fontSize:"2vh" }}>
                    {this.format(this.state.date)}
                </b>
            </div>
        )
    }
}

export default Clock;
