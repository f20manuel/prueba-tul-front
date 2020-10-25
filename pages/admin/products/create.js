import * as React from 'react';
import LayoutComponent from "../../../components/LayoutComponent";
import {Form, Input, Button, message} from "antd";
import {api} from "../../../helpers";
import Axios from "axios";
import {useRouter} from "next/router";

export default function create() {
  const router = useRouter();
  const breadcrumbs = [
    { link: "/admin/products", name: "Productos" },
    { name: "Nuevo Producto" },
  ]

  const [loadingSave, setLoadingSave] = React.useState(false);
  const handleSave = React.useCallback((values) => {
    setLoadingSave(true);
    Axios.post(api("products"), values, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('_token')}`,
      }
    })
      .then(({ data }) => {
        switch (data.status) {
          case "success":
            message.success(data.message);
            setTimeout(() => {
              router.push("/admin/products");
            }, 300);
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
        <Form
          name={"create-product-form"}
          onFinish={values => handleSave(values)}
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
                Guardar
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </LayoutComponent>
  );
}