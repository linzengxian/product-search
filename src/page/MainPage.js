import React from 'react';
import { Layout, Upload, message, Typography, Card, Row, Empty, Modal, Button, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './MainPage.css';
import axios from 'axios'
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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition();
recognition.continuous = false;
const synth = window.speechSynthesis;
const voicePitch=0.9;
const voiceRate=0.9
const voiceName="Google US English";
recognition.start(); 
class MainPage extends React.Component {

    constructor() {
        super()
        this.state = {
            result: [],
            product:null,
            isListening:false,
            showAllProducts:true,
            speakTranscript:'',
            loading:false
        }
    }

    voicecommands=()=>{
        recognition.onstart =()=>{
            console.log('voice is activited');
        }

        function includesSome(transcriptList,list){
            return list.some(i => transcriptList.includes(i))
        }
        function includesAll(transcriptList,list){
            return list.every(i => transcriptList.includes(i))
        }

        recognition.onresult=(e)=>{
            
            let current=e.resultIndex;
            let transcript=e.results[current][0].transcript.trim().toLowerCase()
            console.log(e.results)
            let transcriptList=transcript.split(" ");
            console.log("Speech to text:",transcriptList);
            // console.log("hhhh "+transcript+" "+this.state.speakTranscript)
            switch(true){
                case includesAll(transcriptList,["alex"]) :{
                    this.setState({isListening:true})
                    this.speak("hi how can I help you");
                }
                break;
                case this.state.isListening && transcript!==this.state.speakTranscript:
                    switch(true){
                        case includesSome(transcriptList,['stop']):{
                            this.speak("stop now");
                            this.setState({isListening:false});
                            recognition.stop();
                            break;
                        }
                        case includesSome(transcriptList,['hello','hi']):{this.speak("hi how can I help you"); break;}
                        case this.state.showAllProducts:{ //voice commands for all products without clicking single image
                            switch(true){
                                case includesAll(transcriptList,['product']):{
                                    const numberList=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth']
                                    if(includesSome(transcriptList,numberList)){
                                        if(includesAll(transcriptList,['price'])||includesAll(transcript,['how','much'])){
                                            transcriptList.forEach(i => {
                                                const index=numberList.indexOf(i);
                                                if(index>-1)
                                                this.speak("the price of "+numberList[index]+" product is "+this.state.result[index].product.productLabels[1].value);
                                            });
                                        }
                                        else if(includesAll(transcriptList,['what'])){
                                            transcriptList.forEach(i => {
                                                const index=numberList.indexOf(i);
                                                if(index>-1)
                                                this.speak("the "+numberList[index]+" product is "+this.state.result[index].product.displayName+"And it is "+this.state.result[index].product.productLabels[2].value);
                                            });
                                        }
                                        else {
                                            this.speak("sorry i didn't catch that")
                                        }
                                    }
                                    else {
                                        this.speak("sorry i didn't catch that")
                                    }
                                    break;
                                }
                                
                                default: this.speak("sorry i didn't catch that")
                            }
                        }
                        break;
                        case !this.state.showAllProducts:{//voice commands for single product after clicking single image
                            switch(true){
                                case includesSome(transcriptList,['what','is','it','this']):{
                                    if(includesAll(transcriptList,['price'])||includesAll(transcript,['how much'])){
                                        this.speak("the price of this product is "+this.state.product.product.productLabels[1].value);
                                    }
                                    else{
                                    this.speak("this product is "+this.state.product.product.displayName+"and it is "+this.state.product.product.productLabels[2].value);
                                    }
                                    break;
                                }
                                default:this.speak("sorry i didn't catch that")
                            }
                        }
                        break;
                    }
        }
        }

        recognition.onend =  ()=> {
            recognition.start()
            // recognition.stop();
        };
        
        recognition.onerror=(e)=>{
            console.log("error: ",e.error)
        }
        
        // if(!this.state.isListening){
        //     recognition.start(); 
        // }
    }

    speak=(message)=>{
        this.setState({speakTranscript:message.toLowerCase()})
        
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.pitch = voicePitch;
        utterThis.rate = voiceRate;
        const voices = synth.getVoices();
        for(var i = 0; i < voices.length ; i++) {
            if(voices[i].name===voiceName)
            var selectVoice=voices[i];
        }
        utterThis.voice=selectVoice;
        synth.speak(utterThis);
    }

    showModal = (product) => {
        console.log(product)
        this.setState({
            product:product,
            visible: true,
            showAllProducts:false
        });
        this.voicecommands();
    };

    handleOk = e => {
        this.setState({
            visible: false,
            showAllProducts:true
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            showAllProducts:true
        });
    };

    componentDidMount() {
        recognition.onend =  ()=> {
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
        console.log(file)
        const reader = new FileReader();

        this.setState({
            loading:true
        })
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
                    this.setState({
                        result: result.data.responses[0].productSearchResults.results,
                        showAllProducts:true,
                        loading:false
                    })
                    this.voicecommands();
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
