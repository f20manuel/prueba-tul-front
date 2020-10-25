import * as React from 'react';
import {Navbar, Nav, Button, Container} from 'react-bootstrap';
import Head from "next/head";
import {Dropdown, message, Card, Badge, Modal} from "antd";
import {
  ShoppingCartOutlined, ShoppingOutlined
} from "@ant-design/icons";
import Axios from "axios";
import {api} from "../helpers";
import {useRouter} from "next/router";

export default function HeaderComponent({ title }) {
  const router = useRouter();
  
  const [cart, setCart] = React.useState([]);
  const getCart = React.useCallback(() => {
    Axios.get(api("cart")).then(({ data }) => {
      setCart(data.data);
      setLoadingCart(false);
    }).catch(err => {
      message.error(err.message);
    })
  }, []);

  React.useEffect(() => {
    getCart();
  }, []);

  const quitarUno = React.useCallback((cart, product) => {
    if (cart.quantity > 1) {
      Axios.post(api(`cart/${cart.id}`), {
        quantity: cart.quantity - 1,
        product: product.id,
        _method: "PUT",
      }).then(({data}) => {
        message.success(data.message);
        router.reload();
      }).catch(err => {
        message.error(err.message);
      });
    } else {
      quitarTodos(cart, product);
    }
  }, []);

  const quitarTodos = React.useCallback((cart, product) => {
    Axios.post(api(`cart/${cart.id}`), {
      product: product.id,
      _method: "DELETE",
    }).then(({ data }) => {
      message.success(data.message);
      router.reload();
    }).catch(err => {
      message.error(err.message);
    });
  }, []);

  const handlePayment = React.useCallback(() => {
    Axios.post(api("cart/checkout"), {})
      .then(({ data }) => {
        message.success(data.message);
        setTimeout(() => {
          router.reload();
        }, 1000);
      }).catch(err => {
      message.error(err.message);
    });
  }, []);

  const checkout = () => {
    Modal.confirm({
      icon: <ShoppingOutlined />,
      content: "Estas a punto de completar tu compra.",
      onOk() {
        handlePayment();
      }
    });
  }

  const cartContent = (
    <div className={"d-flex justify-content-between align-items-center"}>
      <Card>
        {cart.length > 0 ? cart.map(item => item.products.map((product, index) => (
          <div key={index} className={"shadow p-2 mb-3"}>
            {console.log(item)}
            <div className={"d-flex justify-content-between align-items-center"}>
              <h5>{product.name}</h5>
              <div className={"btn-group"}>
                <Button variant={"secondary"} onClick={() => quitarUno(item, product)}>Quitar 1</Button>
                <Button variant={"secondary"} onClick={() => quitarTodos(item, product)}>Quitar todos</Button>
              </div>
            </div>
            <p className={"lead"}>cant.: {item.quantity}</p>
          </div>
        ))):(
          <h5>No data</h5>
        )}
        {cart.length > 0 && <Button onClick={() => checkout()} className={"btn-block"}>Pagar</Button>}
      </Card>
    </div>
  )

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto align-items-center">
                <Nav.Link href="/admin/register">Registrarse</Nav.Link>
                <Button href={"/admin/login"}>
                  Acceder
                </Button>
                <Dropdown overlay={cartContent} placement="bottomRight" className={"ml-3"}>
                  {cart.length > 0 ? (
                    <Badge count={cart.length}>
                      <ShoppingCartOutlined style={{fontSize: 24}} />
                    </Badge>
                  ):(
                    <ShoppingCartOutlined style={{fontSize: 24}} />
                  )}
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}