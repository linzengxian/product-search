import React from 'react';
import { Layout, Upload, message, Typography, Card, Row, Empty, Modal, Button, List } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './MainPage.css';
import axios from 'axios'
import { searchAmazon } from 'unofficial-amazon-search';
import ProductDetail from '../component/ProductDetail.js'

const { Dragger } = Upload;
const { Title } = Typography;
const { Header, Content, Sider } = Layout;
const { Meta } = Card;
const props = {
    name: 'file',
    multiple: false,
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            console.log(info)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
class MainPage extends React.Component {

    constructor() {
        super()
        this.state = {
            result: [],
            product:null
        }
    }
    showModal = (product) => {
        console.log(product)
        this.setState({
            product:product,
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        // searchAmazon('xbox controller').then(data => {
        //     console.log(data);
        //     console.log(data.pageNumber)    // 1
        //     console.log(data.searchResults, data.searchResults);
        // });
    }
    getResult = (file) => {
        console.log(file)
        const reader = new FileReader();

        reader.onload = e => {
            let img64 = reader.result.replace('data:image/png;base64,', '')
                .replace('data:image/jpeg;base64,', '')
                .replace('data:image/gif;base64,', '');

            let body = {
                "requests": [
                    {
                        "image": {
                            "content": img64
                        },
                        "features": [
                            {
                                "type": "PRODUCT_SEARCH",
                                "maxResults": 5
                            }
                        ],
                        "imageContext": {
                            "productSearchParams": {
                                "productSet": "projects/impactful-shard-291623/locations/us-east1/productSets/test-product-set",
                                "productCategories": [
                                    "homegoods"
                                ],
                                "filter": ""
                            }
                        }
                    }
                ]
            }
            body = JSON.stringify(body)
            const headers = {
                'Content-Type': 'application/json'
            }
            axios.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBKN2khvOa7jEiXvqNS7AIiGIpbc4SOzxI", body, {
                headers: headers
            })
                .then(result => {
                    console.log(result)
                    this.setState({
                        result: result.data.responses[0].productSearchResults.results
                    })
                })
        };
        reader.readAsDataURL(file);

        // Prevent upload
        return false;
    }
    generateResultList = () => {
        let result = this.state.result
        if (result.length === 0) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Please upload the picture on the left side to get the search result"></Empty>
        }
        const resultComponents = result.map(p => {
            let src = p.product.name.substring(p.product.name.lastIndexOf("/"))
            src = "https://storage.googleapis.com/cse518/images" + src + ".jpg"
            return <Card
                hoverable
                style={{ width: 250, padding: 24 }}
                cover={<img alt="example" src={src} />}
                onClick={() => this.showModal(p)}
            >
                <Meta title={p.product.displayName} description={p.product.productLabels[2].value} />
            </Card>
        })
        return <Row>{resultComponents}</Row>
    }
    render() {
        const resultList = this.generateResultList();
        return <Layout>
            <Header className="header">
                <Title style={{ 'color': 'white' }}>Product Search</Title>
            </Header>
            <Layout>
                <Sider width={300} className="site-layout-background">
                    <Dragger beforeUpload={this.getResult} {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>

                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files</p>
                    </Dragger>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            marginTop: 24,
                            minHeight: 600,
                            maxHeight: 600,
                            overflow:"auto"
                        }}
                    >
                        {resultList}
                        <Modal
                            title="Detail"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    Return
                                </Button>
                            ]}
                            width={800}
                        >
                            <ProductDetail product={this.state.product}></ProductDetail>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    }
}

export default MainPage;
