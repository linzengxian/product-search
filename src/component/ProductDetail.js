import React from 'react';
import { Layout, Upload, message, Typography, Card, Row, Empty, Modal, Button, List, Col, Image } from 'antd';
const { Title, Text } = Typography;

class ProductDetail extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {
        const product = this.props.product.product
        const description = product.productLabels[2].value
        let src = product.name.substring(product.name.lastIndexOf("/"))
        src = "https://storage.googleapis.com/cse518/images" + src + ".jpg"
        return <Row>
            <Col span={8}>
                <Image
                    width={200}
                    src={src}
                />
            </Col>
            <Col span={16}>
                <Title level={2}>{product.displayName}</Title>
                <Text>{description}</Text>
            </Col>
        </Row>
    }
}

export default ProductDetail;
