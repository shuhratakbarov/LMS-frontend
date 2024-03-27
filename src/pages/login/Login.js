import React from "react";
import {Button, Form, Input} from "antd";
import {signin} from "../../server/config/Login";
import {deleteToken, setToken} from "../../util/TokenUtil";

const imageLogin = "././login.png";

class Login extends React.Component {
    state = {
        username: null,
        password: null,
    };

    divStyle = {
        backgroundImage: `url("${imageLogin}")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: '69vh',
        margin: "0 auto",
        paddingTop: '15%',
    };

    handleChangeInput = (key, e) => {
        let value = e.target.value;
        if (key) {
            this.setState({
                ...this.state,
                [key]: value,
            });
        }
    };

    onFinish = () => {
        let obj = {
            username: this.state.username,
            password: this.state.password,
        };
        signin(obj)
            .then((res) => {
                if (res && res.data) {
                    if (res.status === 200) {
                        let dto = res.data;
                        if (dto.success && dto.data && dto.data.access_token) {
                            setToken(dto.data.access_token);
                            window.location.reload();
                        } else {
                            alert(dto.message);
                        }
                    } else {
                        deleteToken();
                    }
                } else {
                    alert("Error");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    render() {
        return (
            <div style={this.divStyle}>
                <h2 style={{textAlign: "center"}}>Learning Management System</h2>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        textAlign: "center",
                        maxWidth: '66%',
                        paddingLeft: '20%'
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input onChange={(e) => this.handleChangeInput("username", e)}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            onChange={(e) => this.handleChangeInput("password", e)}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Login;
