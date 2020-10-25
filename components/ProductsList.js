import * as React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import {api} from "../helpers";
import Axios from "axios";
import {useRouter} from "next/router";
import {Card, message, Spin} from "antd";

export default function ProductsList() {
  const router = useRouter();

  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const getProducts = React.useCallback((search = '') => {
    setLoadingProducts(true);

    Axios.get(api(`products/${search}`))
      .then(({ data }) => {
        setProducts(data.data);
        setLoadingProducts(false);
      }).catch(err => {
        message.error(err.message);
        setLoadingProducts(false);
    });
  }, []);

  React.useEffect(() => {
    setProducts([]);
    getProducts();
  }, []);

  const AddToCart = React.useCallback((product) => {
    if (product.carts.length > 0) {
      Axios.post(api(`cart/${product.carts['0'].id}`), {
        quantity: product.carts['0'].quantity + 1,
        product: product.id,
        _method: "PUT",
      }).then(({ data }) => {
        message.success(data.message);
        router.reload();
      }).catch(err => {
        message.error(err.message);
      });
    } else {
      Axios.post(api('cart'), {
        product: product.id
      }).then(({ data }) => {
        message.success(data.message);
        router.reload();
      }).catch(err => {
        message.error(err.message);
      });
    }
  });

  return loadingProducts?(
    <Row className={"justify-content-center align-items-center"}>
      <Spin />
    </Row>
  ):products && (
    <Row>
      {products.map((product, index) => (
        <Col md={4} key={index}>
          <Card
            title={product.name}
            extra={<Button
              size={"sm"}
              onClick={() => AddToCart(product)
            }>
              {product.carts.length > 0 ? 'Añadir otro' : 'Añadir al carrito'}
            </Button>}>
            <p className={"lead"}>
              {product.description}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
}