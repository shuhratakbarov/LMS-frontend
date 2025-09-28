import React from "react";
import "./notFound.css";
import { Button } from "antd";

class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ showContent: true });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { showContent } = this.state;

    return (
      <React.Fragment>
        <section className="page_404">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div className="col-sm-10 col-sm-offset-1 text-center">
                  {showContent ? (
                    <>
                      <div className="four_zero_four_bg">
                        <p className="text-center">404 Sahifa topilmadi</p>
                      </div>

                      <div className="contant_box_404">
                        <h3 className="h2">Ushbu sahifa mavjud emas</h3>
                        <Button
                          style={{
                            backgroundColor: "dodgerblue",
                            color: "#fff",
                          }}
                          onClick={() => window.history.back()}
                        >
                          Orqaga
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p>Yuklanmoqda...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default NotFound;
