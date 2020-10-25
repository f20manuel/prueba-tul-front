import * as React from 'react';
import Head from "next/head";
import {Breadcrumb, Layout, Menu, message, Spin} from "antd";
import {
  BarcodeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {useRouter} from "next/router";
import {Row} from "react-bootstrap";
import {api} from "../helpers";
import Axios from "axios";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function LayoutComponent ({ children, breadcrumbs, current }) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const authCheck = React.useCallback((token) => {
    if (!token) router.push("/admin/login");
    else setLoading(false);
  }, []);
  React.useEffect(() => {
    authCheck(localStorage.getItem('_token'));
  }, [])

  const [collapsed, setCollapsed] = React.useState(false);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const LogOut = React.useCallback(() => {
    Axios.post(api("logout"), {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("_token")}`
      }
    }).then(() => {
      message.info("Hasta pronto");
      localStorage.removeItem("_token");
      router.push("/admin/login");
    }).catch(err => {
      message.error(err);
    });
  }, []);

  return loading?(
    <Row className={"mx-0 justify-content-center align-items-center min-vh-100"}>
      <Spin size={"large"}/>
    </Row>
  ):(
    <>
      <Head>
        <title>Panel de administración</title>
        <link rel={"stylesheet"} href={"/css/dashboard.css"}/>
      </Head>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo"/>
          <Menu theme="dark" defaultSelectedKeys={current} mode="inline">
            <SubMenu key="products" icon={<BarcodeOutlined />} title="Productos">
              <Menu.Item key="listProducts" onClick={() => router.push("/admin/products")}>Lista de productos</Menu.Item>
              <Menu.Item key="createProduct" onClick={() => router.push("/admin/products/create")}>Nuevo producto</Menu.Item>
            </SubMenu>
            <Menu.Item key="dashboard" onClick={() => LogOut()} icon={<LogoutOutlined />}>
              Salir
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {breadcrumbs && <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumbs.map((item, index) => (
                <Breadcrumb.Item key={index} href={item.link}>{item.name}</Breadcrumb.Item>
              ))}
            </Breadcrumb>}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Diseño y desarrollo por Manuel Fernández para TUL</Footer>
        </Layout>
      </Layout>
    </>
  )
}