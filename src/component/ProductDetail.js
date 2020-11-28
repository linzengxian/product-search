import React from 'react';
import { Typography, Row, List, Col, Image, Divider,Rate,Statistic,Spin } from 'antd';
import { searchAmazon } from 'unofficial-amazon-search';
const { Title, Text } = Typography;

class ProductDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            loading:false
        }
    }
    loadPrice = () => {
        const product = this.props.product.product
        this.setState({
            loading:true
        })
        searchAmazon(product.productLabels[0].value).then(data => {
            this.setState({
                items: data.searchResults,
                loading:false
            })
        });
    }

    componentDidMount() {
        this.loadPrice()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.product !== this.props.product) {
            this.loadPrice()
        }
    }
    render() {
        const product = this.props.product.product
        const description = product.productLabels[2].value
        let src = product.name.substring(product.name.lastIndexOf("/"))
        src = "https://storage.googleapis.com/cse518/images" + src + ".jpg"
        return <div><Row>
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
            <Divider>Buy</Divider>
            <Row>
                <Col span={24}>
                <Spin spinning={this.state.loading}>
                    <List
                        itemLayout="horizontal"
                        style={{
                            height:300,
                            overflow:"auto"
                        }}
                        dataSource={this.state.items}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Image width={150} src={item.imageUrl} />}
                                    title={<a href={"https://www.amazon.com/" + item.productUrl} target="_blank">{item.title}</a>}
                                    description={<div><Rate disabled defaultValue={item.rating.score} />
                                     {item.prices.length === 0 ? <Text strong>{"\n"}Out of Stock</Text> :<Statistic title="Price (USD)" value={item.prices[0].price} precision={2} />}
                                    </div>}
                                />
                            </List.Item>
                        )}
                    />
                    </Spin>
                </Col>
            </Row>
        </div>
    }
}

export default ProductDetail;
