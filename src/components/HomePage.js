import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoadingOverlay from 'react-loading-overlay'
import {PacmanLoader} from 'react-spinners'
import UrlBar from './UrlBar';
import VideoPlayer from './VideoPlayer';
import PlayList from './PlayList';
import { isvalidYoutubeUrl } from "../utils";
import { videoDataAction } from "../actions/videoActions";
class HomePage extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            urlValue: '',
            urlList:[],
            notValid: false,
            errorMsg:'',
            loading: false,
            selectedIndex: -1
        }
    }

    static getDerivedStateFromProps(nextProps,prevState){
        if(nextProps.videoData.flag && prevState.loading){
            if(nextProps.videoData.data.error){
                return {
                    notValid: true,
                    errorMsg: nextProps.videoData.data.error
                }
            }
            return {
                urlList: prevState.urlList.concat(JSON.parse(JSON.stringify(nextProps.videoData.data))),
                selectedIndex: prevState.urlList.length ? prevState.selectedIndex : prevState.urlList.length,
                loading: false
            }
        }
        if(nextProps.videoData.loading !== prevState.loading){
            return {
                loading:nextProps.videoData.loading
            }
        }
        return null;
    }
    changeUrl = (e) => {
        this.setState({
            urlValue: e.target.value,
            notValid:false
        })
    }

    removeVideo = (url) => {
        const index = this.state.urlList.findIndex(el => el.);
        if(index > -1){
            this.setState(prevState => {
                prevState.urlList.splice(index,1);
              return {...{
                    selectedIndex: prevState.selectedIndex === index ? '' : prevState.selectedIndex,
                    urlList:prevState.urlList,
                }}
            })
        }
    }
    changeVideo = (index) => {
        this.setState({
            selectedIndex:  index
        })
    }

    end = (e) =>{
        const index = this.state.urlList.findIndex(el => el.url === url);
        this.setState(prevState => {
            prevState.splice
        })
    }
    addUrl = (e) => {
        e.preventDefault()
        const id = isvalidYoutubeUrl(this.state.urlValue)
        if(id){
            if (this.state.urlList.findIndex(el => el.url === this.state.urlValue) > -1) {
                this.setState({
                    notValid: true,
                    urlValue: '',
                    errorMsg:'URL already exists in the playlist'
                })
            }else{
                this.props.videoDataAction(id)
            }
        }else{
            this.setState({
                notValid: true,
                urlValue: '',
                errorMsg:'Please enter a valid Youtube URL'
            })
        }
       
    }

    render() {
        return(
            <LoadingOverlay 
                active={this.props.videoData.loading}
                spinner={<PacmanLoader color='#ffffff' />}
                fadeSpeed={0}>
            <div className="container ">
                <div className="header">
                    <UrlBar value={this.state.urlValue} changeUrl={this.changeUrl} addUrl={this.addUrl}/>
                    {this.state.notValid && <div className="error">{this.state.errorMsg}</div>}
                </div>
                <div className="body">
                    <VideoPlayer  video={this.state.urlList[this.state.selectedIndex]} end={this.end}/>
                    <PlayList list={this.state.urlList} removeVideo={this.removeVideo} changeVideo={this.changeVideo}/>
                </div>
            </div>
            </LoadingOverlay>
        )
    }
}

HomePage.propTypes = {
    videoDataAction:PropTypes.func.isRequired,
    videoData: PropTypes.shape({
        flag:PropTypes.bool.isRequired,
        error:PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        data:PropTypes.object.isRequired,
    })
}
const mapStateToProps = state => ({
    videoData: state.videoDataReducer
})

export default connect (mapStateToProps,{videoDataAction}) (HomePage)

