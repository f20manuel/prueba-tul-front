import * as React from 'react';
import LayoutComponent from "../../../../components/LayoutComponent";
import {Form, Input, Button, message, Spin} from "antd";
import {api} from "../../../../helpers";
import Axios from "axios";
import {useRouter} from "next/router";

export default function edit({ id }) {
  const router = useRouter();

  const [loadingProduct, setLoadingProduct] = React.useState(true);
  const [product, setProduct] = React.useState({});
  const getProduct = React.useCallback(() => {
    setLoadingProduct(true);
    Axios.get(api(`products/${id}/edit`), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("_token")}`,
      }
    }).then(({ data }) => {
      setProduct(data.data);
      setLoadingProduct(false);
    }).catch(err => {
      message.error(err);
      setLoadingProduct(false);
    })
  }, []);

  React.useEffect(() => {
    getProduct();
  }, []);

  const breadcrumbs = [
    { link: "/admin/products", name: "Productos" },
    { name: product?.name },
  ];

  const [loadingSave, setLoadingSave] = React.useState(false);
  const handleSave = React.useCallback((values, id) => {
    setLoadingSave(true);
    Axios.post(api(`products/${id}`), {
      name: values.name,
      SKU: values.SKU,
      description: values.description,
      _method: "PUT",
    }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("_token")}`,
      }
    })
      .then(({ data }) => {
        switch (data.status) {
          case "success":
            message.success(data.message);
            router.push("/admin/products");
            break;
          case "error":
            message.error(data.message);
        }
        setLoadingSave(false);
      })
      .catch(err => {
        message.error(err.message);
        setLoadingSave(false);
      })
  }, []);

  return (
    <LayoutComponent current={["products", "createProduct"]} breadcrumbs={breadcrumbs}>
      <div className={"p-3"}>
        {loadingProduct ? (
          <div className={"d-flex justify-content-center align-items-center"}>
            <Spin />
          </div>
        ):(
          <Form
            name={"create-product-form"}
            initialValues={product}
            onFinish={values => handleSave(values, id)}
          >
            <Form.Item
              label={"SKU"}
              name={"SKU"}
              rules={[{ required: true, message: 'Debes ingresar un SKU para este producto' }]}
            >
              <Input
                type={"text"}
                placeholder={"SKU"}
              />
            </Form.Item>
            <Form.Item
              label={"Nombre"}
              name={"name"}
              rules={[{ required: true, message: 'Debes ingresar un nombre para este producto' }]}
            >
              <Input
                type={"text"}
                placeholder={"Nombre del producto"}
              />
            </Form.Item>
            <Form.Item
              label={"Descripción "}
              name={"description"}
            >
              <Input.TextArea
                rows={4}
                placeholder={"Descripción del producto"}
              />
            </Form.Item>
            <div className={"float-right"}>
              <Form.Item>
                <Button
                  loading={loadingSave}
                  type="primary"
                  htmlType="submit">
                  Actualizar
                </Button>
              </Form.Item>
            </div>
          </Form>
        )}
      </div>
    </LayoutComponent>
  );
}

edit.getInitialProps = ({ query: { id } }) => {
  return { id }
}