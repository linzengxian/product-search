import React, { useState, Component } from "react";

import { Layout, Row, Col, Typography, Card, Divider, List, Affix, Anchor } from "antd";
const { Link } = Anchor;
const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

class SupportPage extends Component {
  state = {};
  render() {
    return (
      <Layout>
        <Header className="header">
          <Title style={{ 'color': 'white' }}>Product Search</Title>
        </Header>
        <Layout style={{ backgroundColor: 'white' }}>
          <Row>
            <Col span={10} offset={6} >
              <div style={{marginTop:"20px"}}>
              <Title level={1} >ProductFinder Support</Title>
                <Title id='How-to-search-a-product' level={2}>How to search a product</Title>
                <Title level={5}>
                You can click on left side button to upload an image, then this application will automatically search for similar products and display products information on right side in order of similarity.
                </Title>
                <Title id='How-to-know-product-details' level={2}>How to know product details</Title>
                <Title id='Clicking-the-image' level={3}>Clicking the image</Title>
                <Title level={5}>
                  You can click on image to see more details of product, including larger image, product name, product description,
                </Title>
                <Title id='Voice-Commands' level={3}>Voice Commands</Title>
                <Title level={5}>
                  You can use voice commands to controll the application speak the information to you.
                </Title>
              </div>
            </Col>
            <Col span={4} offset={1}>
              <div style={{ position: "sticky", top: "10px" }}>
                <Anchor style={{marginTop:'20px'}}>
                  <Link href="#How-to-search-a-product" title="How to search a product" ></Link>
                  <Link href="#How-to-know-product-details" title="How to know product details">
                    <Link href="#Clicking-the-image" title="Clicking the image" />
                    <Link href="#Voice-Commands" title="Voice Commands" />
                  </Link>
                </Anchor>
              </div>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}

export default SupportPage;
