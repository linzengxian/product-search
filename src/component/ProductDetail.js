import React from 'react';
import { Typography, Row, List, Col, Image, Divider,Rate,Statistic } from 'antd';
import { searchAmazon } from 'unofficial-amazon-search';
const { Title, Text } = Typography;

class ProductDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }
    loadPrice = () => {
        const product = this.props.product.product
        searchAmazon(product.productLabels[0].value).then(data => {
            // let result = data.searchResults
            // console.log(result)
            // let itemComponent = result.map(item => {
            //     console.log(item.imageUrl)
            //     return <List.Item>
            //         <List.Item.Meta
            //             avatar={<Avatar src={item.imageUrl} />}
            //             title={<Text>grg</Text>}
            //         />
            //     </List.Item>
            // })
            // itemComponent = <List>
            //     {itemComponent}
            // </List>
            console.log(data)
            this.setState({
                items: data.searchResults
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
                                    title={<a href={"https://www.amazon.com/" + item.productUrl}>{item.title}</a>}
                                    description={<div><Rate disabled defaultValue={item.rating.score} />
                                     {item.prices.length === 0 ? <Text strong>{"\n"}Out of Stock</Text> :<Statistic title="Price (USD)" value={item.prices[0].price} precision={2} />}
                                    </div>}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    }
}

export default ProductDetail;
