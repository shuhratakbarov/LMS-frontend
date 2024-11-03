import React from "react";
import './notFound.css'
import {Button} from "antd";

class NotFound extends React.Component {
    render() {

        return (
            <React.Fragment>
                <section className="page_404">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 ">
                                <div className="col-sm-10 col-sm-offset-1  text-center">
                                    <div className="four_zero_four_bg">
                                        <h1 className="text-center ">Not found😔</h1>


                                    </div>

                                    <div className="contant_box_404">
                                        <h3 className="h2">Ushbu sahifa mavjud emas</h3>


                                       <Button
                                            style={{
                                                backgroundColor:'greenyellow',
                                                color:'#fff'
                                        }}
                                            onClick={() => this.props.setKey('1','1')}>To back</Button>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default NotFound
