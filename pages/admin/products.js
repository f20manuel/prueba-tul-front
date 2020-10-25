import * as React from "react";
import {useRouter} from "next/router";
import LayoutComponent from "../../components/LayoutComponent";
import {api} from "../../helpers";
import Axios from "axios";
import {Button} from "react-bootstrap";
import {Table, Input, Modal, message} from "antd";
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons';

export default function products(){
  const router = useRouter();

  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [listProducts, setListProducts] = React.useState([]);
  const getProducts = React.useCallback((search = '') => {
    setLoadingProducts(true);
    Axios.post(api("products/list"), {
      search: search
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('_token')}`
      }
    }).then(({ data }) => {
      if(data.data) {
        data.data.forEach(product => {
          setListProducts(listProducts => [
            ...listProducts,
            {
              id: product.id,
              SKU: product.SKU,
              name: product.name,
              description: product.description || 'No se encontro una descripción.',
            }
          ]);
        });
      }
      setLoadingProducts(false);
    }).catch(err => {
      message.error(err);
      setLoadingProducts(false);
    });
  }, []);

  React.useEffect(() => {
    getProducts();
  }, [])

  const breadcrumbs = [
    { name: "Productos" }
  ]

  const columns = [
    {
      title: "SKU",
      dataIndex: "SKU",
      key: "SKU",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Acciones",
      key: "actions",
      align: 'right',
      render: (text, record) => (
        <div className={"btn-group"}>
          <Button onClick={() => router.push({
            pathname: "/admin/products/edit/[id]",
            query: { id: record.id }
          })} size={"sm"}>Editar</Button>
          <Button onClick={() => handleDelete(record.id)} variant={"danger"} size={"sm"}>Borrar</Button>
        </div>
      ),
    },
  ]

  const handleSearch = (search) => {
    setListProducts([]);
    getProducts(search);
  }

  const deleteProduct = (id) => {
    Axios.post(api(`products/${id}`), {
      _method: "DELETE",
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("_token")}`,
      }
    }).then(({ data }) => {
      message.success(data.message);
      setListProducts([]);
      getProducts();
    }).catch(err => {
      message.error(err.message);
    });
  }

  const handleDelete = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Estas segur@ de borrar este producto",
      onOk() {
        deleteProduct(id);
      }
    })
  }

  return (
    <LayoutComponent
      breadcrumbs={breadcrumbs}
      current={["products", "listProducts"]}
    >
      <div className={"d-flex justify-content-between align-items-center mb-3"}>
        <div className={"d-flex justify-content-end align-items-center"}>
          <h4 style={{width: "100%"}} className={"mr-2 mb-0"}>Lista de productos</h4>
          <Input.Search placeholder="Buscar en productos" onSearch={search => handleSearch(search)} enterButton />
        </div>
        <Button href={"products/create"} size={"sm"}>Añadir</Button>
      </div>
      <Table loading={loadingProducts} dataSource={listProducts} columns={columns} />
    </LayoutComponent>
  )
}