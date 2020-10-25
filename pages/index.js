import * as React from 'react';
import HeaderComponent from "../components/HeaderComponent";
import {Card} from "antd";
import {Col, Container, Row} from "react-bootstrap";
import ProductsList from "../components/ProductsList";

export default function Home() {
    return (
    <div>
      <HeaderComponent/>

      <Container>
        <Row>
          <Col>
            <Card className={"my-3"}>
              <h4 className={"card-title"}>
                Nuestros productos
              </h4>
              <ProductsList/>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
