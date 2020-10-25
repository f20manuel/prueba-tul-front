import * as React from 'react';
import {Form, Input, Button, message, Spin} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Col, Row} from "react-bootstrap";
import Axios from 'axios';
import {api} from "../../helpers";
import {useRouter} from "next/router";

export default function login() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const onFinish = (values) => {
    setLoadingLogin(true);
    Axios.post(api('login'), values)
    .then(async (res) => {
      await localStorage.setItem('_token', `${res.data.success.token}`);
      message.success('Sesión aprobada.');
      setLoadingLogin(false);
      setTimeout(() => {
        router.push('products');
      }, 300);
    }).catch(err => {
      console.log(err);
      message.error(err.message);
      setLoadingLogin(false);
    });
  };

  React.useEffect(() => {
    (async () => {
      const _token = await localStorage.getItem('_token');
      if (_token) router.push('products');
      else setLoading(false);
    })();
  }, []);

  return loading?(
    <Row className={"mx-0 justify-content-center align-items-center min-vh-100"}>
      <Spin size={"large"}/>
    </Row>
  ):(
    <Row className={"mx-0 justify-content-center align-items-center min-vh-100"}>
      <Col md={4}>
        <a href="/">Volver al inicio</a>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su correo electrónico',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su contraseña.',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          {/*<Form.Item>
            <a className="login-form-forgot" href="">
              Olvidé mi contraseña
            </a>
          </Form.Item>*/}

          <Form.Item>
            <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button">
              Acceder
            </Button>
            {' '}o <a href="/admin/register">Registrarse ahora</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};