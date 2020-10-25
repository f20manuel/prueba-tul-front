import * as React from 'react';
import {Form, Input, Button, message, Spin} from 'antd';
import {UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons';
import {Col, Row} from "react-bootstrap";
import Axios from 'axios';
import {api} from "../../helpers";
import {useRouter} from "next/router";

export default function register() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const onFinish = (values) => {
    setLoadingLogin(true);
    if (values.password === values.c_password) {
      Axios.post(api('register'), values)
        .then(async ({data}) => {
          await localStorage.setItem('_token', `${data.success.token}`);

          Axios.post(api('login'), {
            email: values.email,
            password: values.password
          }).then(() => {
            message.success('Sesión aprobada.');
            setLoadingLogin(false);
            setTimeout(() => {
              router.push('products');
            }, 300);
          }).catch(err => {
            message.error(err.message);
            setLoadingLogin(false);
          });

        }).catch(err => {
        message.error(err.message);
        setLoadingLogin(false);
      });
    } else {
      message.warning('Sus contraseñas no coinciden.');
    }
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
            name="name"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su nombre completo',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre completo" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su correo electrónico',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
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
          <Form.Item
            name="c_password"
            rules={[
              {
                required: true,
                message: 'debe confirmar su contraseña.',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirmar contraseña"
            />
          </Form.Item>
          {/*<Form.Item>
            <a className="login-form-forgot" href="">
              Olvidé mi contraseña
            </a>
          </Form.Item>*/}

          <Form.Item>
            <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button">
              Registrarse
            </Button>
            {' '}o <a href="/admin/login">Acceder</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};