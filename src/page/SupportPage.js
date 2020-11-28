import React, { Component } from "react";
import './MainPage.css';
import { Layout, Row, Col, Typography, Anchor } from "antd";
import {
  Link as Navigator
} from "react-router-dom";

const { Link } = Anchor;
const { Header,Footer } = Layout;
const { Title } = Typography;
// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.',
// ];

class SupportPage extends Component {
  state = {};
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo">
            <Title style={{ 'color': 'white' }}>Product Search</Title>
          </div>
          <div className="menuItem"><Navigator to="/">Home</Navigator></div>
        </Header>
        <Layout style={{ backgroundColor: 'white' }}>
          <Row>
            <Col span={10} offset={6} >
              <div style={{ marginTop: "20px" }}>
                <Title level={1} >ProductFinder Support</Title>
                <Title id='How-to-search-a-product' level={2}>How to search a product</Title>
                <Title level={5}>
                  You can click on left side button to upload an image, then our application will automatically search for similar products and display products information on right side in order of similarity.
                </Title>
                <Title id='How-to-know-product-details' level={2}>How to know product details</Title>
                <Title id='Click-A-Product' level={3}>Click A Product</Title>
                <Title level={5}>
                  You can click on image to see more details of product, including larger image, product name, product description
                </Title>

                <Title id='Voice-Controll' level={3}>Voice Controll</Title>
                <Title level={5}>
                  You can use voice commands to controll the application speaking the information to you. Please check the Voice Commands section.
                </Title>

                <Title id='Voice-Commands' level={2}>Voice Commands</Title>
                <Title level={5}>
                  Following are supported commands to controll the application to speak out informations. Please say complete sentence to describe your questions.
                </Title>
                <Title id="Alex" level={3}>Alex</Title>
                <Title level={5}>
                  Say "Alex" to start Speech Recognition
                </Title>

                <Title id="Ask-Product-Information" level={3}>Ask Product Information</Title>
                <Title level={4}>when at homepage</Title>
                <Title level={5}>
                  Say "What is first product" to let the application speak out first product's name and description. This command also apply to second, third, etc.
                </Title>
                <Title level={5}>
                  Say "What is price of first product" to let the application speak out first product's price. This command also apply to second, third, etc.
                </Title>

                <Title level={4}>After Clicking Specific Product</Title>
                <Title level={5}>
                  Say "What is it" to let the application speak out current product's name and description.
                </Title>
                <Title level={5}>
                  Say "What is price of this product" or "How much is this product" to let the application speak out current product's price.
                </Title>

                <Title id="Stop" level={3}>Stop</Title>
                <Title level={5}>
                  Say "Stop" to stop Speech Recognition
                </Title>


              </div>
            </Col>
            <Col span={4} offset={1}>
              <div style={{ position: "sticky", top: "10px" }}>
                <Anchor style={{ marginTop: '20px' }}>
                  <Link href="#How-to-search-a-product" title="How to search a product" ></Link>
                  <Link href="#How-to-know-product-details" title="How to know product details">
                    <Link href="#Click-A-Product" title="Click A Product" />
                    <Link href="#Voice-Controll" title="Voice Controll" />
                  </Link>
                  <Link href="#Voice-Commands" title="Voice Commands">
                    <Link href="#Alex" title="Alex" />
                    <Link href="#Ask-Product-Information" title="Ask Product Information" />
                    <Link href="#Stop" title="Stop" />
                  </Link>
                </Anchor>
              </div>
            </Col>
          </Row>
        </Layout>
        <Footer style={{ height: '500px', backgroundColor: 'white' }}></Footer>


      </Layout>
    );
  }
}

export default SupportPage;
