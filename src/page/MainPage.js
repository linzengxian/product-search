import React from 'react';
import { Layout, Upload, message, Typography, Card, Row, Empty, Modal, Button, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './MainPage.css';
import axios from 'axios'
import ProductDetail from '../component/ProductDetail.js'
import {
    Link
} from "react-router-dom";

const { Wit, log } = require('node-wit');
const client = new Wit({
    accessToken: 'SCQQMPEKI4XXWFMAG53ZG3XF2XTRDWOQ'
});


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
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition();
recognition.continuous = false;
const synth = window.speechSynthesis;
const voicePitch = 0.9;
const voiceRate = 0.9
const voiceName = "Google US English";
recognition.start();
class MainPage extends React.Component {

    constructor() {
        super()
        this.state = {
            result: [],
            product: null,
            isListening: false,
            showAllProducts: true,
            speakTranscript: '',
            loading: false,
            image: null
        }
    }

    voicecommands = () => {
        recognition.onstart = () => {
            console.log('voice is activited');
        }

        function includesSome(transcriptList, list) {
            return list.some(i => transcriptList.includes(i))
        }
        function includesAll(transcriptList, list) {
            return list.every(i => transcriptList.includes(i))
        }

        recognition.onresult = (e) => {

            let current = e.resultIndex;
            let transcript = e.results[current][0].transcript.trim().toLowerCase()
            let transcriptList = transcript.split(" ");
            console.log("Speech to text:", transcriptList);

            // console.log("hhhh ",client.message("what's price of second product"))
            client.message(transcript, {})
                .then((data) => {
                    console.log('Yay, got Wit.ai response: ' + JSON.stringify(data.intents));
                    var intent=null
                    if(data.intents.length>0){
                    intent = data.intents[0].name
                    }
                    if (intent === "start") {
                        this.setState({ isListening: true })
                        this.speak("hi how can I help you");
                    }
                    else if (this.state.isListening && transcript !== this.state.speakTranscript) {
                        if (intent === "stop") {
                            this.speak("stop now");
                            this.setState({ isListening: false });
                            recognition.stop();
                        }
                        else if (intent === "greeting") {
                            this.speak("hi how can I help you"); 
                        }
                        else if(intent===null){
                            this.speak("sorry i didn't catch that")
                        }
                        else if (this.state.showAllProducts) {
                            const numberList = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']
                            if (intent === "all_price") {
                                if (includesSome(transcriptList, numberList)) {
                                    transcriptList.forEach(i => {
                                        const index = numberList.indexOf(i);
                                        if (index > -1)
                                            this.speak("the price of " + numberList[index] + " product is " + this.state.result[index].product.productLabels[1].value);
                                    });
                                }
                                else {
                                    this.speak("sorry i didn't catch that")
                                }
                            }
                            else if (intent === "all_product") {
                                if (includesSome(transcriptList, numberList)) {
                                    transcriptList.forEach(i => {
                                        const index = numberList.indexOf(i);
                                        if (index > -1)
                                            this.speak("the " + numberList[index] + " product is " + this.state.result[index].product.displayName + "And it is " + this.state.result[index].product.productLabels[2].value);
                                    });
                                }
                                else {
                                    this.speak("sorry i didn't catch that")
                                }
                            }
                            else{
                                this.speak("sorry,which product you are asking")
                            }
                        }
                        else if (!this.state.showAllProducts){
                            if(intent==="single_price"){
                                this.speak("the price of this product is " + this.state.product.product.productLabels[1].value);
                            }
                            else if(intent==="single_product"){
                                this.speak("this product is " + this.state.product.product.displayName + "and it is " + this.state.product.product.productLabels[2].value);
                            }
                            else{
                                this.speak("sorry i didn't catch that")
                            }
                        }
                    }
                })
                .catch(console.error);

        }

        recognition.onend = () => {
            recognition.start()
            // recognition.stop();
        };

        recognition.onerror = (e) => {
            console.log("error: ", e.error)
        }

        // if(!this.state.isListening){
        //     recognition.start(); 
        // }
    }

    speak = (message) => {
        this.setState({ speakTranscript: message.toLowerCase() })

        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.pitch = voicePitch;
        utterThis.rate = voiceRate;
        const voices = synth.getVoices();
        for (var i = 0; i < voices.length; i++) {
            if (voices[i].name === voiceName)
                var selectVoice = voices[i];
        }
        utterThis.voice = selectVoice;
        synth.speak(utterThis);
    }

    showModal = (product) => {
        console.log(product)
        this.setState({
            product: product,
            visible: true,
            showAllProducts: false
        });
        this.voicecommands();
    };

    handleOk = e => {
        this.setState({
            visible: false,
            showAllProducts: true
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            showAllProducts: true
        });
    };

    componentDidMount() {
        recognition.onend = () => {
            recognition.start()
            // recognition.stop();
        };

        // searchAmazon('xbox controller').then(data => {
        //     console.log(data);
        //     console.log(data.pageNumber)    // 1
        //     console.log(data.searchResults, data.searchResults);
        // });
    }
    getResult = (file) => {
        const reader = new FileReader();
        this.setState({
            loading: true
        })
        reader.onload = e => {
            this.setState({
                image: reader.result
            })
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
                    this.setState({
                        result: result.data.responses[0].productSearchResults.results,
                        showAllProducts: true,
                        loading: false
                    })
                    this.voicecommands();
                }).catch(e => {
                    message.error("search fail! make sure you have correct image format or check network connection")
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
                <div className="logo" style={{ marginTop: '5px' }}>
                    <Title style={{ 'color': 'white' }}>Product Finder</Title>
                </div>
                <div className="menuItem"><Link to="/support">Support</Link></div>
            </Header>
            <Layout>
                <Sider width={300} className="site-layout-background">
                    <Dragger beforeUpload={this.getResult} {...props}>
                        <div>
                            <img width={290} style={{ marginTop: 0 }} src={this.state.image}></img>
                        </div>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>

                        <p className="ant-upload-text">Click or drag image to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single image upload, make sure you have correct image format.</p>
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
                            overflow: "auto"
                        }}
                    >
                        <Spin spinning={this.state.loading}>
                            {resultList}
                        </Spin>
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
