import React from "react";
import {Button, Form, Input, message} from "antd";
import {setToken} from "../../util/TokenUtil";
import {ENDPOINTS} from "../../server/endpoints";
import {useAxios} from "../../server/AxiosProvider";
import {
    LoginOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const imageLogin = "././login.png";
const imageTuit = "./tuit.png";

const Login = () => {
    const {post, loading, error} = useAxios();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const username = values.username;
        const password = values.password;
        const user = {username, password};
        try {
            const response = await post(ENDPOINTS.LOGIN, user);
            if (response.access_token) {
                setToken(response.access_token);
                navigate("/dashboard");
            } else {
                message.error("login parol xato!");
                navigate("/login");
            }
        } catch (err) {
            message.error(error+" || "+ err);
            navigate("/login");
        }
        window.location.reload();
    };
    return (
        <div style={{
            backgroundImage: `url("${imageLogin}")`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: "100%",
            height: '80.1vh',
            margin: "0 auto",
            paddingTop: '10%',
        }}>
            <img src={imageTuit} alt="Learning Logo" style={{
                display: "block",
                margin: "0 auto",
                width: "150px",
                height: "auto",
                borderRadius: "50%",
                objectFit: "cover"
            }}/>
            <h2 style={{textAlign: "center"}}>Learning Management System</h2>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{textAlign: "center", maxWidth: '66%', paddingLeft: '20%'}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: "Please input your username!"}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Please input your password!"}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    wrapperCol={{offset: 8, span: 16}}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: "61vh" }}>
                        {loading ? <div><LoadingOutlined /> 'Logging in...'</div>  : <div><LoginOutlined /> Log in</div>}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;